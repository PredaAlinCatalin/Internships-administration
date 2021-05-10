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
    public class ForeignLanguagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ForeignLanguagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ForeignLanguages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ForeignLanguage>>> GetForeignLanguages()
        {
            return await _context.ForeignLanguages.ToListAsync();
        }

        // GET: api/AptitudesByStudent/5
        [HttpGet("student/{id}")]
        public async Task<ActionResult<IEnumerable<ForeignLanguage>>> GetAptitudesByStudent(int id)
        {
            //List<ForeignLanguage> ForeignLanguages = await _context.ForeignLanguages.ToListAsync();
            //List<ForeignLanguage> result = new List<ForeignLanguage>();
            //foreach (ForeignLanguage ForeignLanguage in ForeignLanguages)
            //{
            //    if (ForeignLanguage.StudentId == id)
            //        result.Add(ForeignLanguage);
            //}

            //if (result.Count == 0)
            //    return NotFound();

            //return result;

            //List<ForeignLanguage> foreignLanguages = new List<ForeignLanguage>();

            //Student student = await _context.Students.FindAsync(id);

            //if (student == null)
            //    return NotFound();

            //if (student.StudentForeignLanguages == null)
            //    return NotFound();

            //foreach (StudentForeignLanguage studentForeignLanguage in student.StudentForeignLanguages)
            //{
            //    foreignLanguages.Add(studentForeignLanguage.ForeignLanguage);
            //}
            //return foreignLanguages;


            List<ForeignLanguage> foreignLanguages = new List<ForeignLanguage>();
            List<StudentForeignLanguage> studentForeignLanguages = await _context.StudentForeignLanguages
                                                                    .Include(f => f.ForeignLanguage)
                                                                    .ToListAsync();

            foreach (StudentForeignLanguage studentForeignLanguage in studentForeignLanguages)
            {
                if (studentForeignLanguage.StudentId == id)
                {
                    //ForeignLanguage foreignLanguage = await _context.ForeignLanguages.FindAsync(studentForeignLanguage.IdForeignLanguage);
                    foreignLanguages.Add(studentForeignLanguage.ForeignLanguage);
                }

            }

            if (foreignLanguages.Count == 0)
                return NotFound();

            return foreignLanguages;

        }



        // GET: api/ForeignLanguages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ForeignLanguage>> GetForeignLanguage(int id)
        {
            var foreignLanguage = await _context.ForeignLanguages.FindAsync(id);

            if (foreignLanguage == null)
            {
                return NotFound();
            }

            return foreignLanguage;
        }

        // PUT: api/ForeignLanguages/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForeignLanguage(int id, ForeignLanguage foreignLanguage)
        {
            if (id != foreignLanguage.Id)
            {
                return BadRequest();
            }

            _context.Entry(foreignLanguage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ForeignLanguageExists(id))
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

        // POST: api/ForeignLanguages
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ForeignLanguage>> PostForeignLanguage(ForeignLanguage foreignLanguage)
        {
            _context.ForeignLanguages.Add(foreignLanguage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetForeignLanguage", new { id = foreignLanguage.Id }, foreignLanguage);
        }

        // DELETE: api/ForeignLanguages/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ForeignLanguage>> DeleteForeignLanguage(int id)
        {
            var foreignLanguage = await _context.ForeignLanguages.FindAsync(id);
            if (foreignLanguage == null)
            {
                return NotFound();
            }

            _context.ForeignLanguages.Remove(foreignLanguage);
            await _context.SaveChangesAsync();

            return foreignLanguage;
        }

        private bool ForeignLanguageExists(int id)
        {
            return _context.ForeignLanguages.Any(e => e.Id == id);
        }
    }
}
