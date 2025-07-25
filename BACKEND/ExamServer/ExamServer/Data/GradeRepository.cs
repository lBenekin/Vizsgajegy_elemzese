﻿using ExamServer.Models;

namespace ExamServer.Data
{
    public interface IGradeRepository
    {
        IEnumerable<Grade> GetAll();

        Student GetById(int id);
        void Add(Grade entity);

        void Update(Grade grade);

        void Delete(int id);
    }

    public class GradeRepository : IGradeRepository
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

        public void Add(Grade grade)
        {
            _context.Grades.Add(grade);
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

        public Student GetById(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(Grade grade)
        {
            _context.Grades.Update(grade);
            _context.SaveChanges();
        }
    }
}
