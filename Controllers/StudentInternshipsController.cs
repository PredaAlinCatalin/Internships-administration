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
    public class StudentInternshipsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentInternshipsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/StudentInternships
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentInternship>>> GetStudentInternships()
        {
            return await _context.StudentInternships.ToListAsync();
        }

        [HttpGet("student/{id}")]
        public async Task<ActionResult<IEnumerable<StudentInternship>>> GetStudentInternshipsByStudentId(string id)
        {
            List<StudentInternship> studentInternships = await _context.StudentInternships.ToListAsync();

            List<StudentInternship> result = new List<StudentInternship>();

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdStudent == id)
                    result.Add(studentInternship);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }

        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<StudentInternship>>> GetStudentInternshipsByInternshipId(int id)
        {
            List<StudentInternship> studentInternships = await _context.StudentInternships.ToListAsync();

            List<StudentInternship> result = new List<StudentInternship>();

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdInternship == id)
                    result.Add(studentInternship);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }


        // GET: api/StudentInternships/5
        [HttpGet("student/{idStudent}/internship/{idInternship}")]
        public async Task<ActionResult<StudentInternship>> GetStudentInternship(string idStudent, int idInternship)
        {
            List<StudentInternship> studentInternships = await _context.StudentInternships.ToListAsync();

            StudentInternship result = null;

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdInternship == idInternship && studentInternship.IdStudent == idStudent)
                    result = studentInternship;
            }

            if (result == null)
                return NotFound();

            return result;
        }

        // PUT: api/StudentInternships/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("student/{idStudent}/internship/{idInternship}")]
        public async Task<IActionResult> PutStudentInternship(string idStudent, int idInternship, StudentInternship studentInternship)
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
                if (!StudentInternshipExists(idStudent, idInternship))
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

        // POST: api/StudentInternships
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<StudentInternship>> PostStudentInternship(StudentInternship studentInternship)
        {
            _context.StudentInternships.Add(studentInternship);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentInternshipExists(studentInternship.IdStudent, studentInternship.IdInternship))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentInternship", new { id = studentInternship.IdStudent }, studentInternship);
        }

        // DELETE: api/StudentInternships/5
        [HttpDelete("student/{idStudent}/internship/{idInternship}")]
        public async Task<ActionResult<StudentInternship>> DeleteStudentInternship(string idStudent, int idInternship)
        {
            var studentInternship = await _context.StudentInternships.FindAsync(idStudent, idInternship);
            if (studentInternship == null)
            {
                return NotFound();
            }

            _context.StudentInternships.Remove(studentInternship);
            await _context.SaveChangesAsync();

            return studentInternship;
        }

        private bool StudentInternshipExists(string idStudent, int idInternship)
        {
            return _context.StudentInternships.Any(e => e.IdStudent == idStudent && e.IdInternship == idInternship);
        }
    }
}
