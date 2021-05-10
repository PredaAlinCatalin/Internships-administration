using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentForeignLanguageDTO
    {
        [Required]
        public int ForeignLanguageId { get; set; }
        [Required]
        public int StudentId { get; set; }
    }
}
