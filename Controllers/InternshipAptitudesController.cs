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
                if (internshipAptitude.InternshipId == id)
                    result.Add(internshipAptitude);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }

        // GET: api/InternshipAptitudes/internship/1/aptitude/2
        [HttpGet("internship/{internshipId}/aptitude/{aptitudeId}")]
        public async Task<ActionResult<InternshipAptitude>> GetInternshipAptitude(int internshipId, int aptitudeId)
        {
            var internshipAptitude = await _context.InternshipAptitudes.FindAsync(internshipId, aptitudeId);

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
                if (InternshipAptitudeExists(internshipAptitude.InternshipId, internshipAptitude.AptitudeId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetInternshipAptitude", new { internshipId = internshipAptitude.InternshipId, aptitudeId = internshipAptitude.AptitudeId }, internshipAptitude);
        }

        //[HttpPut("internship/{internshipId}/internship/{aptitudeId}")]
        //public async Task<IActionResult> PutInternshipAptitude(int internshipId, int aptitudeId, InternshipAptitude internshipAptitude)
        //{
        //    if (internshipId != internshipAptitude.InternshipId && aptitudeId != internshipAptitude.AptitudeId)
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
        //        if (!InternshipAptitudeExists(internshipId, aptitudeId))
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
        [HttpDelete("internship/{internshipId}/aptitude/{aptitudeId}")]
        public async Task<ActionResult<InternshipAptitude>> DeleteInternshipAptitude(int internshipId, int aptitudeId)
        {
            var internshipAptitude = await _context.InternshipAptitudes.FindAsync(internshipId, aptitudeId);
            if (internshipAptitude == null)
            {
                return NotFound();
            }

            _context.InternshipAptitudes.Remove(internshipAptitude);
            await _context.SaveChangesAsync();

            return internshipAptitude;
        }

        private bool InternshipAptitudeExists(int internshipId, int aptitudeId)
        {
            return _context.InternshipAptitudes.Any(e => e.InternshipId == internshipId && e.AptitudeId == aptitudeId);
        }
    }
}
