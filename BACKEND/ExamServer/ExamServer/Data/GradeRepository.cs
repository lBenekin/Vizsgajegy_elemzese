using ExamServer.Models;
using System;

namespace ExamServer.Data
{
    public class GradeRepository : ISchoolRepository<Grade>
    {
        private readonly SchoolDbContext _context;

        public GradeRepository(SchoolDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Grade> GetAll()
        {
            return _context.Grades.ToList();
        }

        public Grade GetById(int id)
        {
            return _context.Grades.Find(id);
        }

        public void Add(Grade grade)
        {
            _context.Grades.Add(grade);
            _context.SaveChanges();
        }

        public void Update(Grade grade)
        {
            _context.Grades.Update(grade);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var grade = _context.Grades.Find(id);
            if (grade != null)
            {
                _context.Grades.Remove(grade);
                _context.SaveChanges();
            }
        }
    }
}
