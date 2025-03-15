using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamServer.Models
{
    public class Student
    {
        public Student(int id, string firstName, string lastName, DateTime dateOfBirth, string email)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Email = email;
            Grades = new HashSet<Grade>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } 
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; } 

        public ICollection<Grade> Grades { get; set; } 
    }

}
