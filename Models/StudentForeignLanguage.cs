using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class StudentForeignLanguage
    {
        public int IdForeignLanguage { get; set; }
        public virtual ForeignLanguage ForeignLanguage { get; set; }
        public string IdStudent { get; set; }
        public virtual Student Student { get; set; }
    }
}
