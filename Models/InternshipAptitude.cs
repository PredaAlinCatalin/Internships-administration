using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class InternshipAptitude
    {
        public int IdInternship { get; set; }
        public virtual Internship Internship { get; set; }
        public int IdAptitude { get; set; }
        public virtual Aptitude Aptitude { get; set; }
    }
}
