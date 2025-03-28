using ExamServer.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamServer.Data
{
    public class SchoolDbContext : DbContext
    {
        public DbSet<Student> Students { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public SchoolDbContext()
        {
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connString = @"Data Source=(LocalDB)\MSSQLLocalDB;Initial Catalog=SchoolDb;Integrated Security=True;MultipleActiveResultSets=true";
            optionsBuilder.UseSqlServer(connString);
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>().HasData(
        new Student { Id = 1, FirstName = "John", LastName = "Doe", DateOfBirth = new DateTime(2000, 5, 15), Email = "john.doe@example.com" },
        new Student { Id = 2, FirstName = "Jane", LastName = "Smith", DateOfBirth = new DateTime(1999, 8, 25), Email = "jane.smith@example.com" },
        new Student { Id = 3, FirstName = "Mark", LastName = "Johnson", DateOfBirth = new DateTime(2001, 2, 5), Email = "mark.johnson@example.com" },
        new Student { Id = 4, FirstName = "Filip", LastName = "Ugovsek", DateOfBirth = new DateTime(2011, 1, 10), Email = "filip.ugovsek@example.com" }
    );

            // Seed adatok a Subject entitáshoz
            modelBuilder.Entity<Subject>().HasData(
                new Subject { Id = 1, Name = "Mathematics", Code = "MATH101", Description = "Basic Mathematics course" },
                new Subject { Id = 2, Name = "English", Code = "ENG101", Description = "English Language course" },
                new Subject { Id = 3, Name = "History", Code = "HIST101", Description = "Introduction to History" },
                new Subject { Id = 4, Name = "IT", Code = "IT101", Description = "Introduction to Information Technology" },
                new Subject { Id = 5, Name = "PE", Code = "PE101", Description = "Physical Education" }
            );

            // Seed adatok a Grade entitáshoz
            modelBuilder.Entity<Grade>().HasData(
                new Grade { Id = 1, StudentId = 1, SubjectId = 1, GradeValue = 5 },  // John Doe - Mathematics - 5
                new Grade { Id = 2, StudentId = 2, SubjectId = 1, GradeValue = 4 },  // Jane Smith - Mathematics - 4
                new Grade { Id = 3, StudentId = 3, SubjectId = 2, GradeValue = 3 },  // Mark Johnson - English - 3
                new Grade { Id = 4, StudentId = 1, SubjectId = 2, GradeValue = 5 },  // John Doe - English - 4
                new Grade { Id = 10, StudentId = 1, SubjectId = 2, GradeValue = 1 },  // John Doe - English - 2
                new Grade { Id = 11, StudentId = 1, SubjectId = 2, GradeValue = 4 },  // John Doe - English - 3
                new Grade { Id = 12, StudentId = 1, SubjectId = 2, GradeValue = 3 },  // John Doe - English - 3
                new Grade { Id = 13, StudentId = 1, SubjectId = 2, GradeValue = 4 },  // John Doe - English - 3
                new Grade { Id = 5, StudentId = 1, SubjectId = 3, GradeValue = 5 },  // John Doe - History - 5
                new Grade { Id = 6, StudentId = 1, SubjectId = 4, GradeValue = 1 },  // John Doe - IT - 1
                new Grade { Id = 7, StudentId = 1, SubjectId = 5, GradeValue = 3 },  // John Doe - PE - 3
                new Grade { Id = 8, StudentId = 4, SubjectId = 1, GradeValue = 2 },  // Filip Ugovsek - Mathematics - 2
                new Grade { Id = 9, StudentId = 4, SubjectId = 4, GradeValue = 5 }   // Filip Ugovsek - IT - 5
            );

            // Grade kapcsolatok (maradnak változatlanul)
            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Student)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.StudentId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Subject)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.SubjectId);

            base.OnModelCreating(modelBuilder);
        }

    }
}
