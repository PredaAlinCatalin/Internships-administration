using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class InternshipCategory
    {
        public int IdCategory { get; set; }
        public virtual Category Category { get; set; }
        public int IdInternship { get; set; }
        public virtual Internship Internship { get; set; }
    }
}
