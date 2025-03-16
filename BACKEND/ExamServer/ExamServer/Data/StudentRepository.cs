using ExamServer.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ExamServer.Data
{
    public interface IStudentRepository
    {
        IEnumerable<Student> GetAll();

        Student GetById(int id);

        Statistic GetStatistics(int id);
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
                .ThenInclude(g => g.Subject)
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
        public Statistic GetStatistics(int id)
        {
            var student = GetById(id);
            if (student == null)
                return null;
            return new Statistic
            {
                Average = GetAverage(student),
                Median = GetMedian(student),
                Mode = GetMode(student),
                Distribution = GetDistribution(student)
            };
        }

        private Dictionary<double, int> GetDistribution(Student student)
        {
            if (student == null)
                return new Dictionary<double, int>();

            // A hallgató jegyei
            var grades = student.Grades.Select(g => g.GradeValue).ToList();

            // A jegyek 1-től 5-ig terjednek, így inicializáljuk az eloszlást
            var gradeRange = new Dictionary<double, int>
            {
                { 1, 0 },
                { 2, 0 },
                { 3, 0 },
                { 4, 0 },
                { 5, 0 }
            };

            // Jegyek eloszlása
            foreach (var grade in grades)
            {
                if (gradeRange.ContainsKey(grade))
                {
                    gradeRange[grade]++;
                }
            }

            return gradeRange;
        }

        private double GetMode(Student student)
        {
            if (student == null)
                return 0;
            var grades = student.Grades.Select(g => g.GradeValue).ToList();
            var mode = grades.GroupBy(g => g)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();
            return mode;
        }

        private double GetMedian(Student student)
        {
            if (student == null)
                return 0;
            var grades = student.Grades.Select(g => g.GradeValue).OrderBy(g => g).ToList();
            var count = grades.Count;
            if (count % 2 == 0)
                return (grades[count / 2 - 1] + grades[count / 2]) / 2;
            return grades[count / 2];
        }

        private double GetAverage(Student student)
        {
            return student == null ? 0 : student.Grades.Average(g => g.GradeValue);
        }
        
    }
}
