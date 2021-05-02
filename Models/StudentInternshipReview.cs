using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class StudentInternshipReview
    {
        public string IdStudent { get; set; }
        public virtual Student Student { get; set; }
        public int IdInternship { get; set; }
        public virtual Internship Internship { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
        public int Grade { get; set; }
    }
}
