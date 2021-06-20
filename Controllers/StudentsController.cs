using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Licenta.Data;
using Licenta.Models;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Licenta.DTOs;
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace Licenta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper;
        private readonly UserManager<IdentityUser> _userManager;
        public StudentsController(ApplicationDbContext context, IWebHostEnvironment env, IMapper mapper, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _env = env;
            _mapper = mapper;
            _userManager = userManager;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetStudents()
        {
            IEnumerable<Student> students = await _context.Students.ToListAsync();
            List<StudentDTO> studentsDTO = new List<StudentDTO>();
            foreach(var student in students)
            {
                var user = await _userManager.FindByIdAsync(student.UserId);
                var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
                var email = await _userManager.GetEmailAsync(user);

                var studentDTO = _mapper.Map<StudentDTO>(student);
                studentDTO.PhoneNumber = phoneNumber;
                studentDTO.Email = email;
                studentsDTO.Add(studentDTO);
            }
            return Ok(studentsDTO);
        }


        [HttpGet("internship/{id}")]
        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetStudentsByInternshipId(int id)
        {
            List<StudentInternship> studentInternships = await _context.StudentInternships
                                                                .Include(s => s.Student)
                                                                .ToListAsync();
            List<StudentDTO> studentsDTO = new List<StudentDTO>();

            foreach (StudentInternship studentInternship in studentInternships)
            {
                if (studentInternship.InternshipId == id)
                {
                    var user = await _userManager.FindByIdAsync(studentInternship.Student.UserId);
                    var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
                    var email = await _userManager.GetEmailAsync(user);

                    var studentDTO = _mapper.Map<StudentDTO>(studentInternship.Student);
                    studentDTO.PhoneNumber = phoneNumber;
                    studentDTO.Email = email;
                    studentsDTO.Add(studentDTO);
                }
            }

            if (studentsDTO.Count == 0)
                return NotFound();

            return Ok(studentsDTO); 

        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDTO>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            var user = await _userManager.FindByIdAsync(student.UserId);
            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            var email = await _userManager.GetEmailAsync(user);

            var studentDTO = _mapper.Map<StudentDTO>(student);
            studentDTO.PhoneNumber = phoneNumber;
            studentDTO.Email = email;

            if (student == null)
            {
                return NotFound();
            }

            return studentDTO;
        }

        [HttpPost("savePhoto/{id}")]
        public JsonResult SavePhoto(int id)
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                //string filename = postedFile.FileName;
                string filename = "" + id + "1.png";
                var physicalPath = _env.ContentRootPath + "/ClientApp/public/photos/" + filename;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(filename);

            }
            catch (Exception)
            {
                return new JsonResult("anonymous.png");
            }
        }

        [HttpPost("savecover/{id}")]
        public JsonResult SaveCover(String id)
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                //string filename = postedFile.FileName;
                string filename = "" + id + "2.png";
                var physicalPath = _env.ContentRootPath + "/ClientApp/public/covers/" + filename;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(filename);

            }
            catch (Exception)
            {
                return new JsonResult("anonymous.png");
            }
        }

        // PUT: api/Students/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, StudentFormDTO studentFormDTO)
        {
            var student = _mapper.Map<Student>(studentFormDTO);

            if (id != student.Id)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            var user = await _userManager.FindByIdAsync(student.UserId);
            if (user.PhoneNumber != studentFormDTO.PhoneNumber)
            {
                var changePhoneResult = await _userManager.SetPhoneNumberAsync(user, studentFormDTO.PhoneNumber);

                if (!changePhoneResult.Succeeded)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, changePhoneResult.Errors);
                }
            }

            //var changePhoneNumberToken = await _userManager.GenerateChangePhoneNumberTokenAsync(user, studentFormDTO.PhoneNumber);
            

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
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

        // POST: api/Students
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            var resp = _context.Students.Add(student);
            
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.Id }, student);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Student>> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return student;
        }

        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Id == id);
        }
    }
}
