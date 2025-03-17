using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamServer.Models
{
    public class Subject
    {
        public Subject()
        {
            Grades = new HashSet<Grade>();
            //Students = new HashSet<StudentSubject>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public ICollection<Grade> Grades { get; set; }
        //public ICollection<StudentSubject> Students { get; set; }
    }
}
