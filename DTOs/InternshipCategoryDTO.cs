using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class InternshipCategoryDTO
    {
        [Required]
        public int InternshipId { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }
}
