﻿using ExamServer.Models;
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
            string connString =
                @"Data Source=(LocalDB)\MSSQLLocalDB;Initial Catalog=SchoolDb;Integrated Security=True;MultipleActiveResultSets=true";
            optionsBuilder.UseSqlServer(connString);
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Student>()
                .HasData(
                    new Student
                    {
                        Id = 1,
                        Name = "John Doe",
                        DateOfBirth = new DateTime(2000, 5, 15),
                        Email = "john.doe@example.com",
                    },
                    new Student
                    {
                        Id = 2,
                        Name = "Jane Smith",
                        DateOfBirth = new DateTime(1999, 8, 25),
                        Email = "jane.smith@example.com",
                    },
                    new Student
                    {
                        Id = 3,
                        Name = "Mark Johnson",
                        DateOfBirth = new DateTime(2001, 2, 5),
                        Email = "mark.johnson@example.com",
                    },
                    new Student
                    {
                        Id = 4,
                        Name = "Filip Ugovsek",
                        DateOfBirth = new DateTime(2011, 1, 10),
                        Email = "filip.ugovsek@example.com",
                    }
                );

            // Seed adatok a Subject entitáshoz
            modelBuilder
                .Entity<Subject>()
                .HasData(
                    new Subject
                    {
                        Id = 1,
                        Name = "Matematika",
                        Code = "MATH101",
                        Description = "Alapfokú matematika kurzus",
                    },
                    new Subject
                    {
                        Id = 2,
                        Name = "Angol nyelv",
                        Code = "ENG101",
                        Description = "Angol nyelvi kurzus",
                    },
                    new Subject
                    {
                        Id = 3,
                        Name = "Történelem",
                        Code = "HIST101",
                        Description = "Bevezetés a történelembe",
                    },
                    new Subject
                    {
                        Id = 4,
                        Name = "Informatika",
                        Code = "IT101",
                        Description = "Bevezetés az informatikába",
                    },
                    new Subject
                    {
                        Id = 5,
                        Name = "Testnevelés",
                        Code = "PE101",
                        Description = "Testnevelés",
                    }
                );

            // Seed adatok a Grade entitáshoz
            modelBuilder
                .Entity<Grade>()
                .HasData(
                    // --------------------
                    // FELVETTE – John Doe (ID 1)
                    new Grade
                    {
                        Id = 100,
                        StudentId = 1,
                        SubjectId = 1,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    new Grade
                    {
                        Id = 101,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    new Grade
                    {
                        Id = 102,
                        StudentId = 1,
                        SubjectId = 3,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    new Grade
                    {
                        Id = 103,
                        StudentId = 1,
                        SubjectId = 4,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    new Grade
                    {
                        Id = 104,
                        StudentId = 1,
                        SubjectId = 5,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    // FELVETTE – Jane Smith (ID 2)
                    new Grade
                    {
                        Id = 105,
                        StudentId = 2,
                        SubjectId = 1,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    // FELVETTE – Mark Johnson (ID 3)
                    new Grade
                    {
                        Id = 106,
                        StudentId = 3,
                        SubjectId = 2,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    // FELVETTE – Filip Ugovsek (ID 4)
                    new Grade
                    {
                        Id = 107,
                        StudentId = 4,
                        SubjectId = 1,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    new Grade
                    {
                        Id = 108,
                        StudentId = 4,
                        SubjectId = 4,
                        GradeValue = -1,
                        IsRealGrade = false,
                    },
                    // --------------------
                    // VALÓDI JEGYEK – John Doe
                    new Grade
                    {
                        Id = 1,
                        StudentId = 1,
                        SubjectId = 1,
                        GradeValue = 5,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 4,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 5,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 10,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 1,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 11,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 4,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 12,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 4,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 13,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 1,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 14,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 5,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 15,
                        StudentId = 1,
                        SubjectId = 2,
                        GradeValue = 4,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 5,
                        StudentId = 1,
                        SubjectId = 3,
                        GradeValue = 5,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 6,
                        StudentId = 1,
                        SubjectId = 4,
                        GradeValue = 1,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 7,
                        StudentId = 1,
                        SubjectId = 5,
                        GradeValue = 3,
                        IsRealGrade = true,
                    },
                    // Jane Smith
                    new Grade
                    {
                        Id = 2,
                        StudentId = 2,
                        SubjectId = 1,
                        GradeValue = 4,
                        IsRealGrade = true,
                    },
                    // Mark Johnson
                    new Grade
                    {
                        Id = 3,
                        StudentId = 3,
                        SubjectId = 2,
                        GradeValue = 3,
                        IsRealGrade = true,
                    },
                    // Filip Ugovsek
                    new Grade
                    {
                        Id = 8,
                        StudentId = 4,
                        SubjectId = 1,
                        GradeValue = 2,
                        IsRealGrade = true,
                    },
                    new Grade
                    {
                        Id = 9,
                        StudentId = 4,
                        SubjectId = 4,
                        GradeValue = 5,
                        IsRealGrade = true,
                    }
                );

            // Grade kapcsolatok (maradnak változatlanul)
            modelBuilder
                .Entity<Grade>()
                .HasOne(g => g.Student)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.StudentId);

            modelBuilder
                .Entity<Grade>()
                .HasOne(g => g.Subject)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.SubjectId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
