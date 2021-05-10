using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class ExperienceDTO
    {
        public int Id { get; set; }
        [Required]
        public string StartDate { get; set; }
        [Required]
        public string EndDate { get; set; }
        [Required]
        public string Position { get; set; }
        [Required]
        public string Company { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int StudentId { get; set; }
    }
}
