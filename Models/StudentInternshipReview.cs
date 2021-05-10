using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class StudentInternshipReview
    {
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }
        public int InternshipId { get; set; }
        public virtual Internship Internship { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Comment { get; set; }
        [Required]
        public int Grade { get; set; }
    }
}
