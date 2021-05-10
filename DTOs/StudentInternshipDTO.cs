using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentInternshipDTO
    {
        public int StudentId { get; set; }
        public int InternshipId { get; set; }
        [Required]
        public string ApplicationDate { get; set; }
        public string CompanyFeedback { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
