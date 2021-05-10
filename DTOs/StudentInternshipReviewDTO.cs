using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentInternshipReviewDTO
    {
        [Required]
        public int StudentId { get; set; }
        [Required]
        public int InternshipId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Comment { get; set; }
        [Required]
        public int Grade { get; set; }
    }
}
