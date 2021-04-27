using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class StudentAptitude
    {
        public int IdAptitude { get; set; }
        public virtual Aptitude Aptitude { get; set; }
        public string IdStudent { get; set; }
        public virtual Student Student { get; set; }
    }
}
