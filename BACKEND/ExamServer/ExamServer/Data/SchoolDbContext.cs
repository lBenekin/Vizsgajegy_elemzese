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
            string connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=SchoolDB;Integrated Security=True;MultipleActiveResultSets=True";
            optionsBuilder.UseSqlServer(connectionString);
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>().HasData(
                new Student(1, "John", "Doe", new DateTime(2000, 5, 15), "john.doe@example.com"),
                new Student(2, "Jane", "Smith", new DateTime(1999, 8, 25), "jane.smith@example.com"),
                new Student(3, "Mark", "Johnson", new DateTime(2001, 2, 5), "mark.johnson@example.com")
            );

            // Seed adatok a Subject entitáshoz
            modelBuilder.Entity<Subject>().HasData(
                new Subject(1, "Mathematics", "MATH101", "Basic Mathematics course"),
                new Subject(2, "English", "ENG101", "English Language course"),
                new Subject(3, "History", "HIST101", "Introduction to History")
            );

            // Seed adatok a Grade entitáshoz
            modelBuilder.Entity<Grade>().HasData(
                new Grade(1, 1, 1, 85),  // John Doe - Mathematics - Grade 85
                new Grade(2, 2, 1, 92),  // Jane Smith - Mathematics - Grade 92
                new Grade(3, 3, 2, 78),  // Mark Johnson - English - Grade 78
                new Grade(4, 1, 3, 88),  // John Doe - History - Grade 88
                new Grade(5, 2, 2, 95)   // Jane Smith - English - Grade 95
            );
            /*modelBuilder.Entity<Grade>()
            .HasOne(g => g.Student)
            .WithMany(s => s.Grades)
            .HasForeignKey(g => g.StudentId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Subject)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.SubjectId);*/

            base.OnModelCreating(modelBuilder);
        }

    }
}
