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
        public async Task<ActionResult<IEnumerable<StudentInternship>>> GetStudentInternshipsByStudentId(int id)
        {
            List<StudentInternship> studentInternships = await _context.StudentInternships.ToListAsync();

            List<StudentInternship> result = new List<StudentInternship>();

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.StudentId == id)
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
                if (studentInternship.InternshipId == id)
                    result.Add(studentInternship);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }


        // GET: api/StudentInternships/5
        [HttpGet("student/{studentId}/internship/{InternshipId}")]
        public async Task<ActionResult<StudentInternship>> GetStudentInternship(int studentId, int InternshipId)
        {
            List<StudentInternship> studentInternships = await _context.StudentInternships.ToListAsync();

            StudentInternship result = null;

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.InternshipId == InternshipId && studentInternship.StudentId == studentId)
                    result = studentInternship;
            }

            if (result == null)
                return NotFound();

            return result;
        }

        // PUT: api/StudentInternships/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("student/{studentId}/internship/{InternshipId}")]
        public async Task<IActionResult> PutStudentInternship(int studentId, int InternshipId, StudentInternship studentInternship)
        {
            if (studentId != studentInternship.StudentId && InternshipId != studentInternship.InternshipId)
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
                if (!StudentInternshipExists(studentId, InternshipId))
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
                if (StudentInternshipExists(studentInternship.StudentId, studentInternship.InternshipId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentInternship", new { id = studentInternship.StudentId }, studentInternship);
        }

        // DELETE: api/StudentInternships/5
        [HttpDelete("student/{studentId}/internship/{InternshipId}")]
        public async Task<ActionResult<StudentInternship>> DeleteStudentInternship(int studentId, int InternshipId)
        {
            var studentInternship = await _context.StudentInternships.FindAsync(studentId, InternshipId);
            if (studentInternship == null)
            {
                return NotFound();
            }

            _context.StudentInternships.Remove(studentInternship);
            await _context.SaveChangesAsync();

            return studentInternship;
        }

        private bool StudentInternshipExists(int studentId, int InternshipId)
        {
            return _context.StudentInternships.Any(e => e.StudentId == studentId && e.InternshipId == InternshipId);
        }
    }
}
