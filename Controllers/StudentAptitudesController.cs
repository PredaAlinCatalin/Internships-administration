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
    public class StudentAptitudesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentAptitudesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/StudentAptitudes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentAptitude>>> GetStudentAptitudes()
        {
            return await _context.StudentAptitudes.ToListAsync();
        }

        // GET: api/StudentAptitudes/student/1/aptitude/2
        [HttpGet("student/{idStudent}/aptitude/{idAptitude}")]
        public async Task<ActionResult<StudentAptitude>> GetStudentAptitude(string idStudent, int idAptitude)
        {
            var studentAptitude = await _context.StudentAptitudes.FindAsync(idStudent, idAptitude);

            if (studentAptitude == null)
            {
                return NotFound();
            }

            return studentAptitude;
        }

        // POST: api/StudentAptitudes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<StudentAptitude>> PostStudentAptitude(StudentAptitude studentAptitude)
        {
            _context.StudentAptitudes.Add(studentAptitude);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentAptitudeExists(studentAptitude.IdStudent, studentAptitude.IdAptitude))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentAptitude", new { idStudent = studentAptitude.IdStudent, idAptitude = studentAptitude.IdAptitude }, studentAptitude);
        }

        // DELETE: api/StudentAptitudes/5
        [HttpDelete("student/{idStudent}/aptitude/{idAptitude}")]
        public async Task<ActionResult<StudentAptitude>> DeleteStudentAptitude(string idStudent, int idAptitude)
        {
            var studentAptitude = await _context.StudentAptitudes.FindAsync(idStudent, idAptitude);
            if (studentAptitude == null)
            {
                return NotFound();
            }

            _context.StudentAptitudes.Remove(studentAptitude);
            await _context.SaveChangesAsync();

            return studentAptitude;
        }

        private bool StudentAptitudeExists(string idStudent, int idAptitude)
        {
            return _context.StudentAptitudes.Any(e => e.IdStudent == idStudent && e.IdAptitude == idAptitude);
        }
    }
}
