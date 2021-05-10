using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class StudentAptitude
    {
        public int AptitudeId { get; set; }
        public virtual Aptitude Aptitude { get; set; }
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }
    }
}
