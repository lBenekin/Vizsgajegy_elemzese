using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamServer.Models
{
    public class Subject
    {
        public Subject(int id, string name, string code, string description)
        {
            Id = id;
            Name = name;
            Code = code;
            Description = description;
            Grades = new HashSet<Grade>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public ICollection<Grade> Grades { get; set; }
    }
}
