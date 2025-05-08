using System;
using ExamServer.Data.Utils;
using ExamServer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace ExamServer.Data
{
    public interface IStudentRepository
    {
        IEnumerable<Student> GetAll();

        Student GetById(int id);
        IEnumerable<Subject> GetSubjectByStudentId(int id);
        Statistic GetStudentStatisticsBySubject(int id, int subjectId);
        IEnumerable<Grade> GetStudentGradesBySubject(int id, int subjectId);
        void Add(Student entity);

        void Update(Student entity);
        void UpdateStudentSubjects(int studentId, List<int> newSubjectIds);

        void Delete(int id);
    }

    public class StudentRepository : IStudentRepository
    {
        private readonly SchoolDbContext _context;

        public StudentRepository(SchoolDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Student> GetAll()
        {
            var students = _context
                .Students.Include(s => s.Grades)
                .ThenInclude(g => g.Subject)
                .ToList();

            return (students);
        }

        public Student GetById(int id)
        {
            return _context
                .Students.Include(s => s.Grades)
                .ThenInclude(g => g.Subject) // Betöltjük a tantárgyakat is a jegyekhez
                .FirstOrDefault(s => s.Id == id);
        }

        public IEnumerable<Subject> GetSubjectByStudentId(int id)
        {
            var subjects = _context
                .Grades.Include(g => g.Subject)
                .Where(g => g.StudentId == id && !g.IsRealGrade)
                .Select(g => g.Subject)
                .ToList();

            return subjects;
        }

        public Statistic GetStudentStatisticsBySubject(int id, int subjectId)
        {
            var student = GetById(id);
            if (student == null)
                return null;
            var subject = student.Grades.FirstOrDefault(g => g.SubjectId == subjectId).Subject;
            if (subject == null)
                return null;
            var grades = student
                .Grades.Where(g => g.SubjectId == subjectId)
                .Select(g => g.GradeValue)
                .ToList();
            return new Statistic
            {
                Average = Math.Round(Statistics.GetAverage(grades), 2),
                Median = Statistics.GetMedian(grades),
                Mode = Statistics.GetMode(grades),
                Distribution = Statistics.GetDistribution(grades),
                Difference = Statistics.GetDifference(grades),
            };
        }

        public IEnumerable<Grade> GetStudentGradesBySubject(int id, int subjectId)
        {
            var student = GetById(id);
            if (student == null)
                return null;
            var subject = student.Grades.FirstOrDefault(g => g.SubjectId == subjectId).Subject;
            if (subject == null)
                return null;
            var grades = student.Grades.Where(g => g.SubjectId == subjectId);
            return grades;
        }

        public void Add(Student student)
        {
            _context.Students.Add(student);
            _context.SaveChanges();
        }

        public void Update(Student student)
        {
            _context.Students.Update(student);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var student = _context.Students.Find(id);
            if (student != null)
            {
                _context.Grades.RemoveRange(student.Grades);

                _context.Students.Remove(student);
                _context.SaveChanges();
            }
        }

        public void UpdateStudentSubjects(int studentId, List<int> newSubjectIds)
        {
            var student = _context
                .Students.Include(s => s.Grades)
                .FirstOrDefault(s => s.Id == studentId);

            if (student == null)
                throw new Exception("Student not found");

            var currentSubjectIds = student.Grades.Select(g => g.SubjectId).Distinct().ToList();

            var subjectsToAdd = newSubjectIds.Except(currentSubjectIds).ToList();
            var subjectsToRemove = currentSubjectIds.Except(newSubjectIds).ToList();

            foreach (var subjectId in subjectsToAdd)
            {
                student.Grades.Add(
                    new Grade
                    {
                        StudentId = studentId,
                        SubjectId = subjectId,
                        GradeValue = -1, // strázsa érték
                        IsRealGrade = false,
                    }
                );
            }

            var gradesToRemove = student
                .Grades.Where(g => subjectsToRemove.Contains(g.SubjectId)) //Berakom hogy && !g.IsRealGrade és akkor csak a strázsa lesz törölve így mindegyik hozzá tartozó jegy
                .ToList();

            _context.Grades.RemoveRange(gradesToRemove);

            _context.SaveChanges();
        }
    }
}
