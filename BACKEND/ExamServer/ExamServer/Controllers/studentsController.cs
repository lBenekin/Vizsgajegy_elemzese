using ExamServer.Data;
using ExamServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExamServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class studentsController : Controller
    {
        private readonly IStudentRepository _repository;


        public studentsController(IStudentRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var students = _repository.GetAll();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var student = _repository.GetById(id);
            if (student == null)
                return NotFound();
            return Ok(student);
        }
        [HttpGet("{id}/grades")]
        public IActionResult GetGradesByStudentId(int id)
        {
            var student = _repository.GetById(id);
            if (student == null)
                return NotFound();
            return Ok(student.Grades);
        }
        [HttpGet("{id}/statistics")]
        public IActionResult GetStudentStatistics(int id)
        {
            var statistics = _repository.GetStatistics(id);
            if (statistics == null)
                return NotFound();
            return Ok(statistics);
        }
        [HttpGet("{id}/{subjectId}/statistics")]
        public IActionResult GetStudentSubjectStatistics(int id, int subjectId)
        {
            var statistics = _repository.GetStatistics(id);
            if (statistics == null)
                return NotFound();
            return Ok(statistics);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Student student)
        {
            if (student == null)
                return BadRequest("Student cannot be null");
            _repository.Add(student);
            return CreatedAtAction(nameof(Get), new { id = student.Id }, student);
        }


        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Student student)
        {
            if (student == null)
                return BadRequest("Student cannot be null");
            student.Id = id; 
            _repository.Update(student);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repository.Delete(id);
            return NoContent();
        }
        [HttpGet("{id}/subjects")]
        public IActionResult GetSubjectsByStudentId(int id)
        {
            var student = _repository.GetById(id);
            if (student == null)
                return NotFound();

            var subjectsWithGrades = student.Grades
                .GroupBy(g => g.Subject)
                .Select(group => new
                {
                    Subject = new
                    {
                        Id = group.Key.Id,
                        Name = group.Key.Name,
                        Code = group.Key.Code,
                        Description = group.Key.Description
                    },
                    Grades = group.Select(g => g.GradeValue).ToList()
                })
                .ToList();

            return Ok(subjectsWithGrades);
        }
    }
}

