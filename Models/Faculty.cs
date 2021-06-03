using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class Faculty
    {
        public int Id { get; set; }
        [required]
        public string Name { get; set; }
        public virtual ICollection<Student> Students { get; set; }
    }
}
