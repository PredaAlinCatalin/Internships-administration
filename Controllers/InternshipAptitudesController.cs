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
    public class InternshipAptitudesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InternshipAptitudesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/InternshipAptitudes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InternshipAptitude>>> GetInternshipAptitudes()
        {
            return await _context.InternshipAptitudes.ToListAsync();
        }

        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<InternshipAptitude>>> GetInternshipAptitudesByInternshipId(int id)
        {
            List<InternshipAptitude> internshipAptitudes = await _context.InternshipAptitudes
                                                                          .Include(ic => ic.Aptitude)
                                                                          .ToListAsync();

            List<InternshipAptitude> result = new List<InternshipAptitude>();

            foreach (InternshipAptitude internshipAptitude in internshipAptitudes)
            {
                if (internshipAptitude.IdInternship == id)
                    result.Add(internshipAptitude);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }

        // GET: api/InternshipAptitudes/internship/1/aptitude/2
        [HttpGet("internship/{idInternship}/aptitude/{idAptitude}")]
        public async Task<ActionResult<InternshipAptitude>> GetInternshipAptitude(int idInternship, int idAptitude)
        {
            var internshipAptitude = await _context.InternshipAptitudes.FindAsync(idInternship, idAptitude);

            if (internshipAptitude == null)
            {
                return NotFound();
            }

            return internshipAptitude;
        }

        // POST: api/InternshipAptitudes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<InternshipAptitude>> PostInternshipAptitude(InternshipAptitude internshipAptitude)
        {
            _context.InternshipAptitudes.Add(internshipAptitude);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (InternshipAptitudeExists(internshipAptitude.IdInternship, internshipAptitude.IdAptitude))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetInternshipAptitude", new { idInternship = internshipAptitude.IdInternship, idAptitude = internshipAptitude.IdAptitude }, internshipAptitude);
        }

        //[HttpPut("internship/{idInternship}/internship/{idAptitude}")]
        //public async Task<IActionResult> PutInternshipAptitude(int idInternship, int idAptitude, InternshipAptitude internshipAptitude)
        //{
        //    if (idInternship != internshipAptitude.IdInternship && idAptitude != internshipAptitude.IdAptitude)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(internshipAptitude).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!InternshipAptitudeExists(idInternship, idAptitude))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // DELETE: api/InternshipAptitudes/5
        [HttpDelete("internship/{idInternship}/aptitude/{idAptitude}")]
        public async Task<ActionResult<InternshipAptitude>> DeleteInternshipAptitude(int idInternship, int idAptitude)
        {
            var internshipAptitude = await _context.InternshipAptitudes.FindAsync(idInternship, idAptitude);
            if (internshipAptitude == null)
            {
                return NotFound();
            }

            _context.InternshipAptitudes.Remove(internshipAptitude);
            await _context.SaveChangesAsync();

            return internshipAptitude;
        }

        private bool InternshipAptitudeExists(int idInternship, int idAptitude)
        {
            return _context.InternshipAptitudes.Any(e => e.IdInternship == idInternship && e.IdAptitude == idAptitude);
        }
    }
}
