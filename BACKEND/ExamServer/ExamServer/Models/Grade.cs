using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamServer.Models
{
    public class Grade
    {
        public Grade()
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int StudentId { get; set; }
        [JsonIgnore]
        public Student Student { get; set; }
        public int SubjectId { get; set; }
        [JsonIgnore]
        public Subject Subject { get; set; }
        public int GradeValue { get; set; } 
    }

}
