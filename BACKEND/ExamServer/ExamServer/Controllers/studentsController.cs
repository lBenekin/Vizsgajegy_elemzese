using ExamServer.Data;
using ExamServer.Models;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
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

        [HttpGet("{id}/subjects")]
        public IActionResult GetSubjectsByStudentId(int id)
        {
            var subjects = _repository.GetSubjectByStudentId(id);
            if (subjects == null)
                return NotFound();
            return Ok(subjects);
        }

        [HttpGet("{id}/{subjectId}/statistics")]
        public IActionResult GetStudentSubjectStatistics(int id, int subjectId)
        {
            var statistics = _repository.GetStudentStatisticsBySubject(id, subjectId);
            if (statistics == null)
                return NotFound();
            return Ok(statistics);
        }

        [HttpGet("{id}/{subjectId}/grades")]
        public IActionResult GetStudentSubjectGrades(int id, int subjectId)
        {
            var grades = _repository.GetStudentGradesBySubject(id, subjectId);
            if (grades == null)
                return NotFound();
            return Ok(grades);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Student student)
        {
            if (student == null)
                return BadRequest("Student is null");

            _repository.Add(student); // innen jönnek a subject ID-k
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

        [HttpPut("{id}/subjects")]
        public IActionResult PutSubjects(int id, List<int> subjectIds)
        {
            if (subjectIds == null)
                return BadRequest("Subject ID list is required.");

            var student = _repository.GetById(id);
            if (student == null)
                return NotFound($"Student with id {id} not found.");

            _repository.UpdateStudentSubjects(id, subjectIds);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repository.Delete(id);
            return NoContent();
        }
    }
}
