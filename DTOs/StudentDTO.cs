using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentDTO
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public int Year { get; set; }
        public double AnnualAverage { get; set; }
        public string PersonalDescription { get; set; }
        public string PhotoPath { get; set; }
        public string CoverPath { get; set; }
        public string Passions { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string UserId { get; set; }
        public int? FacultyId { get; set; }
    }
}
