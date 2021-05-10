using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Licenta.Models
{
    public class Experience
    {
        [Key]
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
        public virtual Student Student { get; set; }
    }
}
