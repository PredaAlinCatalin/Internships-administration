using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class InternshipAptitude
    {
        public int InternshipId { get; set; }
        public virtual Internship Internship { get; set; }
        public int AptitudeId { get; set; }
        public virtual Aptitude Aptitude { get; set; }
    }
}
