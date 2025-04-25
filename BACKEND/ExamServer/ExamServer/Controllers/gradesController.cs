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

        // GET: api/<gradesController>
        [HttpGet]
        public IActionResult GetAll()
        {
            var grades = _repository.GetAll(); 
            return Ok(grades);
        }

        // GET api/<gradesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<gradesController>
        [HttpPost]
        public IActionResult Post([FromBody] Grade grade)
        {
            if (grade == null)
                return BadRequest("Grade cannot be null");
            _repository.Add(grade);
            return CreatedAtAction(nameof(Get), new { id = grade.Id }, grade);
        }

        // PUT api/<gradesController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Grade grade)
        {
            if (grade == null)
                return BadRequest("Grade cannot be null");
            grade.Id = id;
            _repository.Update(grade);
            return NoContent();
        }

        // DELETE api/<gradesController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repository.Delete(id);
            return NoContent();
        }
    }
}
