using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Licenta.DTOs;
using Licenta.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Licenta.Models;

namespace CazareUbApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([Required] RegisterDTO register)
        {
            var user = new IdentityUser
            {
                UserName = register.Email,
                Email = register.Email
            };

            var result = await _userManager.CreateAsync(user, register.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            result = await _userManager.AddToRoleAsync(user, register.Role);

            if (!result.Succeeded)
            {
                // Should never happen, unless role doesn't exist.
                throw new Exception("Failed to add user to role");
            }

            if (register.Role == "Student")
            {
                try
                {
                    var student = new Student();
                    student.Id = user.Id;
                    student.UserId = user.Id;
                    student.PhotoPath = "anonymousPhoto.png";
                    _context.Students.Add(student);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return UnprocessableEntity("The student details argument could not be processed!");
                }
            }

            else if (register.Role == "Company")
            {
                try
                {
                    var company = new Company();
                    company.Id = user.Id;
                    company.UserId = user.Id;
                    company.LogoPath = "anonymousLogo.png";
                    _context.Companies.Add(company);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return UnprocessableEntity("The student details argument could not be processed!");
                }
            }

            return Ok();
        }


        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login([Required] LoginDTO login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);

            if (user == null)
            {
                return BadRequest();
            }

            var signInResult = await _signInManager.PasswordSignInAsync(user, login.Password, false, false);

            // Invalid email or password
            if (!signInResult.Succeeded)
            {
                return BadRequest();
            }

            // Retrieve user data which the front end needs
            string userId;
            string userRole;
            if (await _userManager.IsInRoleAsync(user, "Student"))
            {
                // Return the ID of this student to the front end
                var query = from s in _context.Students
                            where s.Id == user.Id
                            select s.Id;

                userId = await query.FirstAsync();
                userRole = "Student";
            }
            else if (await _userManager.IsInRoleAsync(user, "Company"))
            {
                // Return the ID of this student to the front end
                var query = from s in _context.Companies
                            where s.Id == user.Id
                            select s.Id;

                userId = await query.FirstAsync();
                userRole = "Company";
            }
            else
            {
                throw new Exception("User doesn't have a known role");
            }

            var response = new LoginResponseDTO
            {
                UserId = userId,
                UserRole = userRole,
            };
            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok();
        }
    }
}
