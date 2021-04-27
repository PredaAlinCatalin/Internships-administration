using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Licenta.Models
{
    public class Internship
    {
        public int Id { get; set; }
       
        public string Name { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Deadline { get; set; }
        public int MaxNumberStudents { get; set; }
        public bool Paid { get; set; }

        public string Description { get; set; }
        
        public virtual ICollection<StudentInternship> StudentInternships { get; set; }
        public virtual ICollection<InternshipCategory> InternshipCategories { get; set; }
        public virtual ICollection<InternshipAptitude> InternshipAptitudes { get; set; }
        public string IdCompany { get; set; }
        public virtual Company Company { get; set; }
        public int IdCity { get; set; }
        public virtual City City { get; set; }
    }
}
