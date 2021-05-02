using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Licenta.Data;
using Licenta.Models;
using Microsoft.AspNetCore.Identity;
using IdentityServer4.Models;
using Licenta.DTOs;
using AutoMapper;

namespace Licenta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InternshipsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public InternshipsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

        //GET: api/Internships
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Internship>>> GetInternships()
        //{
        //    return await _context.Internships
        //                    .ToListAsync();
        //}

        [HttpGet("company/{id}")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetInternshipsByCompany(string id)
        {
            List<Internship> internships = await _context.Internships
                                                    .ToListAsync();
            List<Internship> internshipsResult = new List<Internship>();
            foreach (Internship internship in internships)
            {
                if (internship.IdCompany == id)
                    internshipsResult.Add(internship);
            }

            if (internshipsResult.Count == 0)
                return NotFound();

            return internshipsResult;
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByCategoryCitySearch(string searchString, string city, string category)
        {
            if (!string.IsNullOrEmpty(searchString))
                searchString = searchString.ToLower();
            if (!string.IsNullOrEmpty(city))
                city = city.ToLower();
            if (!string.IsNullOrEmpty(category))
                category = category.ToLower();
            List<Internship> internships = await _context.Internships
                                                    .Include(i => i.InternshipCategories)
                                                    .Include(i => i.City)
                                                    .Include(i => i.Company)
                                                    .ToListAsync();
            //bool allEmpty = false;
            //if (string.IsNullOrEmpty(searchString) && string.IsNullOrEmpty(city) && string.IsNullOrEmpty(category))
            //    allEmpty = true;

            List<InternshipDTO> internshipsResult = new List<InternshipDTO>();
            //if (allEmpty)
            //{
            //    internshipsResult = _mapper.Map<List<InternshipDTO>>(internships);
            //    return internshipsResult;
            //}


            foreach (Internship internship in internships)
            {
                if (!string.IsNullOrEmpty(city))
                    if (string.IsNullOrEmpty(internship.City.Name) || internship.City.Name.ToLower() != city)
                        continue;

                //if (!string.IsNullOrEmpty(city) && !string.IsNullOrEmpty(internship.City.Name) && internship.City.Name.ToLower() != city)
                //    continue;

                bool found = false;
                if (!string.IsNullOrEmpty(searchString))
                    if ((string.IsNullOrEmpty(internship.Name) || !internship.Name.ToLower().Contains(searchString)) &&
                            (string.IsNullOrEmpty(internship.Company.Name) || !internship.Company.Name.ToLower().Contains(searchString)))
                        continue;

                //if (!string.IsNullOrEmpty(searchString))
                //    if (string.IsNullOrEmpty(internship.Company.Name) || !internship.Company.Name.ToLower().Contains(searchString))
                //        continue;

                //if (!string.IsNullOrEmpty(searchString) && !string.IsNullOrEmpty(internship.Name) && internship.Name.ToLower().Contains(searchString))
                //    found = true;

                //if (!string.IsNullOrEmpty(searchString) && !string.IsNullOrEmpty(internship.Company.Name) && internship.Company.Name.ToLower().Contains(searchString))
                //    found = true;

                //if (!found || !string.IsNullOrEmpty(searchString))
                //    continue;

                if (string.IsNullOrEmpty(category))
                {
                    internshipsResult.Add(_mapper.Map<InternshipDTO>(internship));
                }

                else {
                    foreach (InternshipCategory internshipCategory in internship.InternshipCategories)
                        if (internshipCategory.Category.Name.ToLower() == category)
                        {
                            internshipsResult.Add(_mapper.Map<InternshipDTO>(internship)); ;
                            break;
                        }
                }

                
                        
            }

            return internshipsResult;
        }

        [HttpGet("category/{idCategory}")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetInternshipsByCategory(int idCategory)
        {
            //List<Internship> internships = await _context.Internships
            //                                        .Include(i => i.InternshipCategories)
            //                                        .ToListAsync();
            List<Internship> internshipsResult = new List<Internship>();
            //foreach (Internship internship in internships)
            //{
            //    foreach (InternshipCategory internshipCategory in internship.InternshipCategories)
            //        if (internshipCategory.IdCategory == idCategory)
            //        {
            //            var searchedInternship = _context.Internships.FirstOrDefault(i => i.Id == internship.Id);
            //            internshipsResult.Add(searchedInternship);
            //            break;
            //        }

            //}

            List<InternshipCategory> internshipCategories = await _context.InternshipCategories.ToListAsync();
            foreach (InternshipCategory internshipCategory in internshipCategories)
            {
                if (internshipCategory.IdCategory == idCategory)
                {
                    Internship searchedInternship = _context.Internships.FirstOrDefault(i => i.Id == internshipCategory.IdInternship);
                    internshipsResult.Add(searchedInternship);
                }
            }

            if (internshipsResult.Count == 0)
                return NotFound();

            return internshipsResult;
        }

        [HttpGet("city/{id}")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetInternshipsByCity(int id)
        {
            List<Internship> internships = await _context.Internships
                                                    .ToListAsync();
            List<Internship> internshipsResult = new List<Internship>();
            foreach (Internship internship in internships)
            {
                if (internship.IdCity == id)
                    internshipsResult.Add(internship);
            }

            if (internshipsResult.Count == 0)
                return NotFound();

            return internshipsResult;
        }



        [HttpGet("student/{id}")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetInternshipsByStudentId(string id)
        {
            List<Internship> internships = new List<Internship>();
            List<StudentInternship> studentInternships = await _context.StudentInternships
                                                                .ToListAsync();

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.IdStudent == id)
                {
                    Internship searchedInternship = await _context.Internships.FirstOrDefaultAsync(i => i.Id == studentInternship.IdInternship);
                    searchedInternship.StudentInternships = null;
                    internships.Add(searchedInternship);
                }
            }

            if (internships.Count == 0)
                return NotFound();

            return internships;

        }

        [HttpGet("studentSaved/{id}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByStudentIdSaved(string id)
        {
            List<InternshipDTO> internships = new List<InternshipDTO>();
            List<SavedStudentInternship> savedStudentInternships = await _context.SavedStudentInternships
                                                                .ToListAsync();

            foreach (SavedStudentInternship savedStudentInternship in savedStudentInternships)
            {
                if (savedStudentInternship.IdStudent == id)
                {
                    Internship searchedInternship = await _context.Internships.FirstOrDefaultAsync(i => i.Id == savedStudentInternship.IdInternship);
                    searchedInternship.SavedStudentInternships = null;
                    internships.Add(_mapper.Map<InternshipDTO>(searchedInternship));
                }
            }

            if (internships.Count == 0)
                return NotFound();

            return internships;

        }

        // GET: api/Internships/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Internship>> GetInternship(int id)
        {
            var internship = await _context.Internships
                                    .FirstOrDefaultAsync(i => i.Id == id);

            if (internship == null)
            {
                return NotFound();
            }

            return internship;
        }

        // PUT: api/Internships/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInternship(int id, Internship internship)
        {
            if (id != internship.Id)
            {
                return BadRequest();
            }

            _context.Entry(internship).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InternshipExists(id))
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

        // POST: api/Internships
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Internship>> PostInternship(Internship internship)
        {
            _context.Internships.Add(internship);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInternship", new { id = internship.Id }, internship);
        }

        // DELETE: api/Internships/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Internship>> DeleteInternship(int id)
        {
            var internship = await _context.Internships.FindAsync(id);
            if (internship == null)
            {
                return NotFound();
            }

            _context.Internships.Remove(internship);
            await _context.SaveChangesAsync();

            return internship;
        }

        private bool InternshipExists(int id)
        {
            return _context.Internships.Any(e => e.Id == id);
        }
    }
}
