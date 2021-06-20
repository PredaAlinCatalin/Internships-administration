﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Licenta.DTOs;
using Licenta.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Licenta.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Licenta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([Required] RegisterDTO register)
        {
            var user = new IdentityUser
            {
                UserName = register.Email,
                Email = register.Email,
                SecurityStamp = Guid.NewGuid().ToString()
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
                    var student = new Student {UserId = user.Id, PhotoPath = "anonymousPhoto.png", CoverPath = "anonymousCover.png" };
                    _context.Students.Add(student);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return UnprocessableEntity("The student details argument could not be processed! " + e);
                }
            }

            else if (register.Role == "Company")
            {
                try
                {
                    var company = new Company { UserId = user.Id, LogoPath = "anonymousLogo.png", CoverPath = "anonymousCover.png" };
                    _context.Companies.Add(company);
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return UnprocessableEntity("The company details argument could not be processed!" + e);
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
                            where s.UserId == user.Id
                            select s.Id;

                userId = (await query.FirstAsync()).ToString();
                userRole = "Student";
            }
            else if (await _userManager.IsInRoleAsync(user, "Company"))
            {
                // Return the ID of this student to the front end
                //var query = from s in _context.Companies
                //            where s.UserId == user.Id
                //            select s.Id;

                //userId = (await query.FirstAsync()).ToString();
                //userRole = "Company";

                var companyId = await _context.Companies
                                            .Where(c => c.UserId == user.Id)
                                            .Select(c => c.Id)
                                            .SingleOrDefaultAsync();
                userId = companyId.ToString();
                userRole = "Company";
            }
            else if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                userId = user.Id;
                userRole = "Admin";
            }
            else
            {
                throw new Exception("User doesn't have a known role");
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }
            var authSigninKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(30),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256Signature)
                );

            var response = new LoginResponseDTO
            {
                UserId = userId,
                UserRole = userRole,
                Token = new JwtSecurityTokenHandler().WriteToken(token)
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
