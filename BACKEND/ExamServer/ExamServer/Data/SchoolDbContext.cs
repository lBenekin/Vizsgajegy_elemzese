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
                new Subject { Id = 3, Name = "History", Code = "HIST101", Description = "Introduction to History" }
            );

            // Seed adatok a Grade entitáshoz
            modelBuilder.Entity<Grade>().HasData(
                new Grade { Id = 1, StudentId = 1, SubjectId = 1, GradeValue = 85 },  // John Doe - Mathematics - Grade 85
                new Grade { Id = 2, StudentId = 2, SubjectId = 1, GradeValue = 92 },  // Jane Smith - Mathematics - Grade 92
                new Grade { Id = 3, StudentId = 3, SubjectId = 2, GradeValue = 78 },  // Mark Johnson - English - Grade 78
                new Grade { Id = 4, StudentId = 1, SubjectId = 3, GradeValue = 88 },  // John Doe - History - Grade 88
                new Grade { Id = 5, StudentId = 2, SubjectId = 2, GradeValue = 95 }   // Jane Smith - English - Grade 95
            );
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
