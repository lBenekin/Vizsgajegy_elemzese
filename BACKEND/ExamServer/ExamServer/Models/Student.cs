using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ExamServer.Models
{
    public class Student
    {
        public Student()
        {
            Grades = new HashSet<Grade>();
            //Subjects = new HashSet<StudentSubject>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } 
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public ICollection<Grade> Grades { get; set; }
        [NotMapped] //Nem rakja Db-be
        public IEnumerable<Subject> Subjects => Grades
            ?.Select(g => g.Subject)
            .Distinct()
            .ToList();
    }

}
