using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class StudentInternship
    {
        public string IdStudent { get; set; }
        public virtual Student Student { get; set; }
        public int IdInternship { get; set; }
        public virtual Internship Internship { get; set; }
        public string ApplicationDate { get; set; }
        public string CompanyFeedback { get; set; }
        public string Status { get; set; }
    }
}
