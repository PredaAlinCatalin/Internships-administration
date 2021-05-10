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
    public class InternshipCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InternshipCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/InternshipCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InternshipCategory>>> GetInternshipCategories()
        {
            return await _context.InternshipCategories.ToListAsync();
        }

        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<InternshipCategory>>> GetInternshipCategoriesByInternshipId(int id)
        {
            List<InternshipCategory> internshipCategories = await _context.InternshipCategories
                                                                          .Include(ic => ic.Category)
                                                                          .ToListAsync();

            List<InternshipCategory> result = new List<InternshipCategory>();

            foreach (InternshipCategory internshipCategory in internshipCategories)
            {
                if (internshipCategory.InternshipId == id)
                    result.Add(internshipCategory);
            }

            if (result.Count() == 0)
                return NotFound();

            return result;
        }

        // GET: api/InternshipCategories/internship/1/category/2
        [HttpGet("internship/{internshipId}/category/{categoryId}")]
        public async Task<ActionResult<InternshipCategory>> GetInternshipCategory(int internshipId, int categoryId)
        {
            var internshipCategory = await _context.InternshipCategories.FindAsync(internshipId, categoryId);

            if (internshipCategory == null)
            {
                return NotFound();
            }

            return internshipCategory;
        }

        // POST: api/InternshipCategories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<InternshipCategory>> PostInternshipCategory(InternshipCategory internshipCategory)
        {
            _context.InternshipCategories.Add(internshipCategory);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (InternshipCategoryExists(internshipCategory.InternshipId, internshipCategory.CategoryId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetInternshipCategory", new { internshipId = internshipCategory.InternshipId, categoryId = internshipCategory.CategoryId }, internshipCategory);
        }

        //[HttpPut("internship/{internshipId}/internship/{categoryId}")]
        //public async Task<IActionResult> PutInternshipCategory(int internshipId, int categoryId, InternshipCategory internshipCategory)
        //{
        //    if (internshipId != internshipCategory.InternshipId && categoryId != internshipCategory.CategoryId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(internshipCategory).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!InternshipCategoryExists(internshipId, categoryId))
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

        // DELETE: api/InternshipCategories/5
        [HttpDelete("internship/{internshipId}/category/{categoryId}")]
        public async Task<ActionResult<InternshipCategory>> DeleteInternshipCategory(int internshipId, int categoryId)
        {
            var internshipCategory = await _context.InternshipCategories.FindAsync(internshipId, categoryId);
            if (internshipCategory == null)
            {
                return NotFound();
            }

            _context.InternshipCategories.Remove(internshipCategory);
            await _context.SaveChangesAsync();

            return internshipCategory;
        }

        private bool InternshipCategoryExists(int internshipId, int categoryId)
        {
            return _context.InternshipCategories.Any(e => e.InternshipId == internshipId && e.CategoryId == categoryId);
        }
    }
}
