using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class SavedStudentInternship
    {
        [Required]
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }
        public int InternshipId { get; set; }
        public virtual Internship Internship { get; set; }
    }
}
