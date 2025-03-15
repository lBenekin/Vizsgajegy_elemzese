using ExamServer.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ExamServer.Data
{
    public interface IStudentRepository
    {
        IEnumerable<Student> GetAll();

        Student GetById(int id);

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
        .Include(s => s.Grades)         // Betöltjük a Grades adatokat is
        .ThenInclude(g => g.Subject)    // Betöltjük a kapcsolódó Subject adatokat is
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
    }
}
