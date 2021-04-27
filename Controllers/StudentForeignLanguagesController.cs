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
    public class StudentForeignLanguagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentForeignLanguagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/StudentForeignLanguages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentForeignLanguage>>> GetStudentForeignLanguages()
        {
            return await _context.StudentForeignLanguages.ToListAsync();
        }

        // GET: api/StudentForeignLanguages/5
        [HttpGet("student/{idStudent}/foreignLanguage/{idForeignLanguage}")]
        public async Task<ActionResult<StudentForeignLanguage>> GetStudentForeignLanguage(string idStudent, int idForeignLanguage)
        {
            var studentForeignLanguage = await _context.StudentForeignLanguages.FindAsync(idStudent, idForeignLanguage);

            if (studentForeignLanguage == null)
            {
                return NotFound();
            }

            return studentForeignLanguage;
        }

        // POST: api/StudentForeignLanguages
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<StudentForeignLanguage>> PostStudentForeignLanguage(StudentForeignLanguage studentForeignLanguage)
        {
            _context.StudentForeignLanguages.Add(studentForeignLanguage);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentForeignLanguageExists(studentForeignLanguage.IdStudent, studentForeignLanguage.IdForeignLanguage))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentForeignLanguage", new { idStudent = studentForeignLanguage.IdStudent, idForeignLanguage = studentForeignLanguage.IdForeignLanguage }, studentForeignLanguage);
        }

        // DELETE: api/StudentForeignLanguages/5
        [HttpDelete("student/{idStudent}/foreignLanguage/{idForeignLanguage}")]
        public async Task<ActionResult<StudentForeignLanguage>> DeleteStudentForeignLanguage(string idStudent, int idForeignLanguage)
        {
            var studentForeignLanguage = await _context.StudentForeignLanguages.FindAsync(idStudent, idForeignLanguage);
            if (studentForeignLanguage == null)
            {
                return NotFound();
            }

            _context.StudentForeignLanguages.Remove(studentForeignLanguage);
            await _context.SaveChangesAsync();

            return studentForeignLanguage;
        }

        private bool StudentForeignLanguageExists(string idStudent, int idForeignLanguage)
        {
            return _context.StudentForeignLanguages.Any(e => e.IdStudent == idStudent && e.IdForeignLanguage == idForeignLanguage);
        }
    }
}
