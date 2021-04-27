using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Licenta.Models
{
    public class Aptitude
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<StudentAptitude> StudentAptitudes { get; set; }
        public virtual ICollection<InternshipAptitude> InternshipAptitudes { get; set; }

    }
}
