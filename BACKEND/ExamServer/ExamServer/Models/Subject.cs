﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        [JsonIgnore]
        public ICollection<Grade> Grades { get; set; }
    }
}
