using ExamServer.Data;
using ExamServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExamServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class subjectsController : Controller
    {
        private readonly ISubjectRepository _repository;


        public subjectsController(ISubjectRepository repository)
        {
            _repository = repository;
        }


        [HttpGet]
        public IActionResult GetAll()
        {
            var subjects = _repository.GetAll();
            return Ok(subjects);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var subject = _repository.GetById(id);
            if (subject == null)
                return NotFound();
            return Ok(subject);
        }
        [HttpGet("{id}/grades")]
        public IActionResult GetGradesBySubjectId(int id)
        {
            var subject = _repository.GetById(id);
            if (subject == null)
                return NotFound();
            return Ok(subject.Grades);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Subject subject)
        {
            if (subject == null)
                return BadRequest("Subject cannot be null");
            _repository.Add(subject);
            return CreatedAtAction(nameof(Get), new { id = subject.Id }, subject);
        }


        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Subject subject)
        {
            if (subject == null)
                return BadRequest("Subject cannot be null");
            subject.Id = id; 
            _repository.Update(subject);
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
