using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
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
        [ValidateNever]
        public Student Student { get; set; }
        public int SubjectId { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public Subject Subject { get; set; }
        public int GradeValue { get; set; }
        public bool IsRealGrade { get; set; } = true;
    }

}
