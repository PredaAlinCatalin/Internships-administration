using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class InternshipCategory
    {
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public int InternshipId { get; set; }
        public virtual Internship Internship { get; set; }
    }
}
