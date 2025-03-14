using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamServer.Models
{
    public class Grade
    {
        public Grade(int id, int studentId, int subjectId, int gradeValue)
        {
            Id = id;
            StudentId = studentId;
            SubjectId = subjectId;
            GradeValue = gradeValue;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public int SubjectId { get; set; }
        public Subject Subject { get; set; }
        public int GradeValue { get; set; } 
    }

}
