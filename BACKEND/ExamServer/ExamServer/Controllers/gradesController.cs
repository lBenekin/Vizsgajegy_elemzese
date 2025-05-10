using ExamServer.Data;
using ExamServer.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class gradesController : ControllerBase
    {
        private readonly IGradeRepository _repository;

        public gradesController(IGradeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var grades = _repository.GetAll();
            return Ok(grades);
        }

        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        public IActionResult Post([FromBody] Grade grade)
        {
            if (grade == null)
                return BadRequest("Grade cannot be null");
            _repository.Add(grade);
            return CreatedAtAction(nameof(Get), new { id = grade.Id }, grade);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Grade grade)
        {
            if (grade == null)
                return BadRequest("Grade cannot be null");
            grade.Id = id;
            _repository.Update(grade);
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
