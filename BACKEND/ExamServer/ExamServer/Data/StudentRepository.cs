using ExamServer.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ExamServer.Data
{
    public interface IStudentRepository
    {
        IEnumerable<Student> GetAll();

        Student GetById(int id);
        Statistic GetStudentStatistics(int id);
        Statistic GetStudentStatisticsBySubject(int id, int subjectId);
        void Add(Student entity);

        void Update(Student entity);

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
            return _context.Students.Include(s => s.Grades).ToList();
        }

        public Student GetById(int id)
        {
            return _context.Students
        .Include(s => s.Grades)
            .ThenInclude(g => g.Subject) // Betöltjük a tantárgyakat is a jegyekhez
        .FirstOrDefault(s => s.Id == id);
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
                _context.Students.Remove(student);
                _context.SaveChanges();
            }
        }
        public Statistic GetStudentStatistics(int id)
        {
            var student = GetById(id);
            if (student == null)
                return null;
            var grades = student.Grades.Select(g => g.GradeValue).ToList();
            return new Statistic
            {
                Average = Math.Round(GetAverage(grades),2),
                Median = GetMedian(grades),
                Mode = GetMode(grades),
                Distribution = GetDistribution(grades)
            };
        }
        public Statistic GetStudentStatisticsBySubject(int id, int subjectId)
        {
            var student = GetById(id);
            if (student == null)
                return null;
            var subject = student.Grades.FirstOrDefault(g => g.SubjectId == subjectId).Subject;
            if (subject == null)
                return null;
            var grades = student.Grades.Where(g => g.SubjectId == subjectId).Select(g => g.GradeValue).ToList();
            return new Statistic
            {
                Average = Math.Round(GetAverage(grades), 2),
                Median = GetMedian(grades),
                Mode = GetMode(grades),
                Distribution = GetDistribution(grades),
                Difference = GetDifference(grades)
            };
        }
        private List<int> GetDifference(List<int> grades)
        {
            var differences = new List<int>();
            for (int i = 0; i < grades.Count - 1; i++)
            {
                differences.Add(Math.Abs(grades[i + 1] - grades[i]));
            }
            return differences;
        }
        private Dictionary<double, int> GetDistribution(List<int> grades)
        {

            var gradeRange = new Dictionary<double, int>
            {
                { 1, 0 },
                { 2, 0 },
                { 3, 0 },
                { 4, 0 },
                { 5, 0 }
            };

            foreach (var grade in grades)
            {
                if (gradeRange.ContainsKey(grade))
                {
                    gradeRange[grade]++;
                }
            }

            return gradeRange;
        }
        private double GetMode(List<int> grades)
        {
            var mode = grades.GroupBy(g => g)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();
            return mode;
        }

        private double GetMedian(List<int> grades)
        {
            grades.Sort();
            var count = grades.Count;
            if (count % 2 == 0)
                return (grades[count / 2 - 1] + grades[count / 2]) / 2;
            return grades[count / 2];
        }

        private double GetAverage(List<int> grades)
        {
            return grades.Average();
        }

    }
}
