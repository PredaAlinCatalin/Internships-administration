using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Licenta.Data;
using Licenta.Models;

namespace Licenta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedStudentInternshipsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SavedStudentInternshipsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SavedStudentInternships
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedStudentInternship>>> GetSavedStudentInternships()
        {
            return await _context.SavedStudentInternships.ToListAsync();
        }

        [HttpGet("student/{id}")]
        public async Task<ActionResult<IEnumerable<SavedStudentInternship>>> GetSavedStudentInternshipsByStudentId(string id)
        {
            List<SavedStudentInternship> studentInternships = await _context.SavedStudentInternships.ToListAsync();

            List<SavedStudentInternship> result = new List<SavedStudentInternship>();

            foreach (SavedStudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdStudent == id)
                    result.Add(studentInternship);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }

        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<SavedStudentInternship>>> GetSavedStudentInternshipsByInternshipId(int id)
        {
            List<SavedStudentInternship> studentInternships = await _context.SavedStudentInternships.ToListAsync();

            List<SavedStudentInternship> result = new List<SavedStudentInternship>();

            foreach (SavedStudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdInternship == id)
                    result.Add(studentInternship);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }


        // GET: api/SavedStudentInternships/5
        [HttpGet("student/{idStudent}/internship/{idInternship}")]
        public async Task<ActionResult<SavedStudentInternship>> GetSavedStudentInternship(string idStudent, int idInternship)
        {
            List<SavedStudentInternship> studentInternships = await _context.SavedStudentInternships.ToListAsync();

            SavedStudentInternship result = null;

            foreach (SavedStudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdInternship == idInternship && studentInternship.IdStudent == idStudent)
                    result = studentInternship;
            }

            if (result == null)
                return NotFound();

            return result;
        }

        // PUT: api/SavedStudentInternships/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("student/{idStudent}/internship/{idInternship}")]
        public async Task<IActionResult> PutSavedStudentInternship(string idStudent, int idInternship, SavedStudentInternship studentInternship)
        {
            if (idStudent != studentInternship.IdStudent && idInternship != studentInternship.IdInternship)
            {
                return BadRequest();
            }

            _context.Entry(studentInternship).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavedStudentInternshipExists(idStudent, idInternship))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SavedStudentInternships
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<SavedStudentInternship>> PostSavedStudentInternship(SavedStudentInternship studentInternship)
        {
            _context.SavedStudentInternships.Add(studentInternship);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SavedStudentInternshipExists(studentInternship.IdStudent, studentInternship.IdInternship))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSavedStudentInternship", new { id = studentInternship.IdStudent }, studentInternship);
        }

        // DELETE: api/SavedStudentInternships/5
        [HttpDelete("student/{idStudent}/internship/{idInternship}")]
        public async Task<ActionResult<SavedStudentInternship>> DeleteSavedStudentInternship(string idStudent, int idInternship)
        {
            var studentInternship = await _context.SavedStudentInternships.FindAsync(idStudent, idInternship);
            if (studentInternship == null)
            {
                return NotFound();
            }

            _context.SavedStudentInternships.Remove(studentInternship);
            await _context.SaveChangesAsync();

            return studentInternship;
        }

        private bool SavedStudentInternshipExists(string idStudent, int idInternship)
        {
            return _context.SavedStudentInternships.Any(e => e.IdStudent == idStudent && e.IdInternship == idInternship);
        }
    }
}
