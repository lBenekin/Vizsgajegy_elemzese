using ExamServer.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ExamServer.Data
{
    public interface ISubjectRepository
    {
        IEnumerable<Subject> GetAll();

        Subject GetById(int id);

        void Add(Subject entity);

        void Update(Subject entity);

        void Delete(int id);
    }
    public class SubjectRepository :ISubjectRepository
    {
        private readonly SchoolDbContext _context;

        public SubjectRepository(SchoolDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Subject> GetAll()
        {
            return _context.Subjects.Include(s => s.Grades).ToList();
        }

        public Subject GetById(int id)
        {
            return _context.Subjects
                .Include(s => s.Grades)
                .ThenInclude(g => g.Student)
                .FirstOrDefault(s => s.Id == id);
        }

        public void Add(Subject subject)
        {
            _context.Subjects.Add(subject);
            _context.SaveChanges();
        }

        public void Update(Subject subject)
        {
            _context.Subjects.Update(subject);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var subject = _context.Subjects.Find(id);
            if (subject != null)
            {
                _context.Subjects.Remove(subject);
                _context.SaveChanges();
            }
        }
    }
}
