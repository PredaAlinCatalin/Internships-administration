using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class EducationDTO
    {
        public int Id { get; set; }
        [Required]
        public string StartDate { get; set; }
        [Required]
        public string EndDate { get; set; }
        [Required]
        public string Institution { get; set; }
        [Required]
        public string Specialization { get; set; }
        [Required]
        public int StudentId { get; set; }
    }
}
