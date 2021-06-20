using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Licenta.Models;
using Licenta.DTOs;
using AutoMapper;
using Licenta.Repositories;

namespace Licenta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InternshipsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IInternshipsRepository _repository;

        public InternshipsController(IMapper mapper, IInternshipsRepository repository)
        {
            _mapper = mapper;
            _repository = repository;

        }

        //GET: api/Internships
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternships()
        {
            IEnumerable<Internship> internships = await _repository.GetAllInternshipsAsync();
            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByCompanyId(int companyId)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsByCompanyId(companyId);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        [HttpGet("company/{companyId}/status/{status}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByCompanyIdAndStatus(int companyId, string status)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsByCompanyIdAndStatus(companyId, status);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        [HttpGet("approved")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsBySearchCityName(string searchString, string city)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsBySearchCityName(searchString, city);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByCategoryId(int categoryId)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsByCategoryId(categoryId);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        [HttpGet("city/{cityId}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByCityId(int cityId)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsByCityId(cityId);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByStudentId(int studentId)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsByStudentId(studentId);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));

        }

        [HttpGet("studentSaved/{studentId}")]
        public async Task<ActionResult<IEnumerable<InternshipDTO>>> GetInternshipsByStudentIdSaved(int studentId)
        {
            IEnumerable<Internship> internships = await _repository.GetInternshipsByStudentIdSaved(studentId);

            return Ok(_mapper.Map<IEnumerable<InternshipDTO>>(internships));
        }

        // GET: api/Internships/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InternshipDTO>> GetInternshipById(int id)
        {
            var internship = await _repository.GetInternshipById(id);

            if (internship == null)
            {
                return NotFound();
            }

            return _mapper.Map<InternshipDTO>(internship);
        }

        // PUT: api/Internships/5
        [HttpPut("{id}")]
        public async Task<ActionResult<InternshipDTO>> PutInternship(int id, Internship internship)
        {
            if (id != internship.Id)
            {
                return BadRequest();
            }

            try
            {
                await _repository.UpdateInternship(internship);
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

            return _mapper.Map<InternshipDTO>(internship);
        }

        // POST: api/Internships
        [HttpPost]
        public async Task<ActionResult<Internship>> PostInternship(Internship internship)
        {
            await _repository.CreateInternship(internship);

            return CreatedAtAction("GetInternship", new { id = internship.Id }, internship);
        }

        // DELETE: api/Internships/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Internship>> DeleteInternship(int id)
        {
            var internship = await _repository.GetInternshipById(id);
            if (internship == null)
            {
                return NotFound();
            }

            await _repository.DeleteInternship(internship);

            return internship;
        }

        private bool InternshipExists(int id)
        {
            return _repository.GetInternshipById(id) != null;
        }
    }
}
