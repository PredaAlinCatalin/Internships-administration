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
    public class AptitudesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AptitudesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Aptitudes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aptitude>>> GetAptitudes()
        {
            return await _context.Aptitudes.ToListAsync();
        }

        // GET: api/AptitudesByStudent/5
        [HttpGet("student/{id}")]
        public async Task<ActionResult<IEnumerable<Aptitude>>> GetAptitudesByStudent(string id)
        {

            List<Aptitude> aptitudes = new List<Aptitude>();
            List<StudentAptitude> studentAptitudes = await _context.StudentAptitudes
                                                        .Include(a => a.Aptitude)
                                                        .ToListAsync();

            foreach (StudentAptitude studentAptitude in studentAptitudes)
            {
                if (studentAptitude.IdStudent == id)
                {
                    //Aptitude aptitude = await _context.Aptitudes.FindAsync(studentAptitude.IdAptitude);
                    aptitudes.Add(studentAptitude.Aptitude);
                }

            }

            if (aptitudes.Count == 0)
                return NotFound();

            return aptitudes;
        }


        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<Aptitude>>> GetAptitudesByInternship(int id)
        {
            List<Aptitude> aptitudes = new List<Aptitude>();
            List<InternshipAptitude> internshipAptitudes = await _context.InternshipAptitudes
                                                                .Include(c => c.Aptitude)
                                                                .ToListAsync();

            foreach (InternshipAptitude internshipAptitude in internshipAptitudes)
            {
                if (internshipAptitude.IdInternship == id)
                {
                    aptitudes.Add(internshipAptitude.Aptitude);
                }
            }

            if (aptitudes.Count == 0)
                return NotFound();

            return aptitudes;
        }

        // GET: api/Aptitudes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Aptitude>> GetAptitude(int id)
        {
            var aptitude = await _context.Aptitudes.FindAsync(id);

            if (aptitude == null)
            {
                return NotFound();
            }

            return aptitude;
        }

        // PUT: api/Aptitudes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAptitude(int id, Aptitude aptitude)
        {
            if (id != aptitude.Id)
            {
                return BadRequest();
            }

            _context.Entry(aptitude).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AptitudeExists(id))
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

        // POST: api/Aptitudes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Aptitude>> PostAptitude(Aptitude aptitude)
        {
            _context.Aptitudes.Add(aptitude);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAptitude", new { id = aptitude.Id }, aptitude);
        }

        // DELETE: api/Aptitudes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Aptitude>> DeleteAptitude(int id)
        {
            var aptitude = await _context.Aptitudes.FindAsync(id);
            if (aptitude == null)
            {
                return NotFound();
            }

            _context.Aptitudes.Remove(aptitude);
            await _context.SaveChangesAsync();

            return aptitude;
        }

        private bool AptitudeExists(int id)
        {
            return _context.Aptitudes.Any(e => e.Id == id);
        }
    }
}
