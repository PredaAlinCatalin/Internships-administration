﻿using System;
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
    public class StudentInternshipReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentInternshipReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/StudentInternshipReviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentInternshipReview>>> GetStudentInternshipReviews()
        {
            return await _context.StudentInternshipReviews.ToListAsync();
        }

        [HttpGet("student/{id}")]
        public async Task<ActionResult<IEnumerable<StudentInternshipReview>>> GetStudentInternshipReviewsByStudentId(string id)
        {
            List<StudentInternshipReview> studentInternshipReviews = await _context.StudentInternshipReviews.ToListAsync();

            List<StudentInternshipReview> result = new List<StudentInternshipReview>();

            foreach (StudentInternshipReview studentInternshipReview in studentInternshipReviews)
            {
                if (studentInternshipReview.IdStudent == id)
                    result.Add(studentInternshipReview);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }

        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<StudentInternshipReview>>> GetStudentInternshipReviewsByInternshipId(int id)
        {
            List<StudentInternshipReview> studentInternshipReviews = await _context.StudentInternshipReviews.ToListAsync();

            List<StudentInternshipReview> result = new List<StudentInternshipReview>();

            foreach (StudentInternshipReview studentInternshipReview in studentInternshipReviews)
            {
                if (studentInternshipReview.IdInternship == id)
                    result.Add(studentInternshipReview);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }


        // GET: api/StudentInternshipReviews/5
        [HttpGet("student/{idStudent}/internship/{idInternship}")]
        public async Task<ActionResult<StudentInternshipReview>> GetStudentInternshipReview(string idStudent, int idInternship)
        {
            List<StudentInternshipReview> studentInternshipReviews = await _context.StudentInternshipReviews.ToListAsync();

            StudentInternshipReview result = null;

            foreach (StudentInternshipReview studentInternshipReview in studentInternshipReviews)
            {
                if (studentInternshipReview.IdInternship == idInternship && studentInternshipReview.IdStudent == idStudent)
                    result = studentInternshipReview;
            }

            if (result == null)
                return NotFound();

            return result;
        }

        // PUT: api/StudentInternshipReviews/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("student/{idStudent}/internship/{idInternship}")]
        public async Task<IActionResult> PutStudentInternshipReview(string idStudent, int idInternship, StudentInternshipReview studentInternshipReview)
        {
            if (idStudent != studentInternshipReview.IdStudent && idInternship != studentInternshipReview.IdInternship)
            {
                return BadRequest();
            }

            _context.Entry(studentInternshipReview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentInternshipReviewExists(idStudent, idInternship))
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

        // POST: api/StudentInternshipReviews
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<StudentInternshipReview>> PostStudentInternshipReview(StudentInternshipReview studentInternshipReview)
        {
            _context.StudentInternshipReviews.Add(studentInternshipReview);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentInternshipReviewExists(studentInternshipReview.IdStudent, studentInternshipReview.IdInternship))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudentInternshipReview", new { id = studentInternshipReview.IdStudent }, studentInternshipReview);
        }

        // DELETE: api/StudentInternshipReviews/5
        [HttpDelete("student/{idStudent}/internship/{idInternship}")]
        public async Task<ActionResult<StudentInternshipReview>> DeleteStudentInternshipReview(string idStudent, int idInternship)
        {
            var studentInternshipReview = await _context.StudentInternshipReviews.FindAsync(idStudent, idInternship);
            if (studentInternshipReview == null)
            {
                return NotFound();
            }

            _context.StudentInternshipReviews.Remove(studentInternshipReview);
            await _context.SaveChangesAsync();

            return studentInternshipReview;
        }

        private bool StudentInternshipReviewExists(string idStudent, int idInternship)
        {
            return _context.StudentInternshipReviews.Any(e => e.IdStudent == idStudent && e.IdInternship == idInternship);
        }
    }
}
