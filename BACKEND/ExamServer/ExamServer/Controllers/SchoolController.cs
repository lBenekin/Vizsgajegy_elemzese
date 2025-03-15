using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ExamServer.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExamServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchoolController<T> : ControllerBase where T : class
    {
        private readonly ISchoolRepository<T> _repository;

        // A repository beszúrása (dependency injection)
        public SchoolController(ISchoolRepository<T> repository)
        {
            _repository = repository;
        }

        // Az összes elem lekérése
        [HttpGet]
        public IActionResult GetAll()
        {
            var items = _repository.GetAll();  // Az összes elem lekérése
            return Ok(items); // Válasz küldése
        }

        // Egy elem lekérése ID alapján
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var item = _repository.GetById(id);  // Elem lekérése ID alapján
            if (item == null)
                return NotFound();  // Ha nem található, 404-es hibát adunk vissza
            return Ok(item);  // Válasz küldése
        }

        // Új entitás hozzáadása
        [HttpPost]
        public IActionResult Post([FromBody] T entity)
        {
            if (entity == null)
            {
                return BadRequest("Entity cannot be null");
            }

            _repository.Add(entity);  // Entitás hozzáadása az adatbázishoz
            return CreatedAtAction(nameof(Get), new { id = entity }, entity);  // 201-es státusz kód
        }

        // Entitás frissítése
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] T entity)
        {
            if (entity == null)
            {
                return BadRequest("Entity cannot be null");
            }

            _repository.Update(entity);  // Entitás frissítése az adatbázisban
            return NoContent();  // 204-es válasz, ha nincs további tartalom
        }

        // Entitás törlése ID alapján
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repository.Delete(id);  // Entitás törlése az adatbázisból
            return NoContent();  // 204-es válasz
        }
    }
}
