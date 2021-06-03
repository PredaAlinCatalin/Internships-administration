using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Licenta.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LogoPath { get; set; }
        public string CoverPath { get; set; }
        public string Description { get; set; }
        public string Industry { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
        public virtual ICollection<Internship> Internships { get; set; }
        [Required]
        public string UserId { get; set; }
        public virtual IdentityUser User { get; set; }
    }
}
