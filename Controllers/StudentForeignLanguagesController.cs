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
        [HttpGet("student/{studentId}/foreignLanguage/{foreignLanguageId}")]
        public async Task<ActionResult<StudentForeignLanguage>> GetStudentForeignLanguage(int studentId, int foreignLanguageId)
        {
            var studentForeignLanguage = await _context.StudentForeignLanguages.FindAsync(studentId, foreignLanguageId);

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
                if (StudentForeignLanguageExists(studentForeignLanguage.StudentId, studentForeignLanguage.ForeignLanguageId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentForeignLanguage", new { studentId = studentForeignLanguage.StudentId, foreignLanguageId = studentForeignLanguage.ForeignLanguageId }, studentForeignLanguage);
        }

        // DELETE: api/StudentForeignLanguages/5
        [HttpDelete("student/{studentId}/foreignLanguage/{foreignLanguageId}")]
        public async Task<ActionResult<StudentForeignLanguage>> DeleteStudentForeignLanguage(int studentId, int foreignLanguageId)
        {
            var studentForeignLanguage = await _context.StudentForeignLanguages.FindAsync(studentId, foreignLanguageId);
            if (studentForeignLanguage == null)
            {
                return NotFound();
            }

            _context.StudentForeignLanguages.Remove(studentForeignLanguage);
            await _context.SaveChangesAsync();

            return studentForeignLanguage;
        }

        private bool StudentForeignLanguageExists(int studentId, int foreignLanguageId)
        {
            return _context.StudentForeignLanguages.Any(e => e.StudentId == studentId && e.ForeignLanguageId == foreignLanguageId);
        }
    }
}
