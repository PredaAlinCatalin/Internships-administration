using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Models
{
    public class SavedStudentInternship
    {
        public string IdStudent { get; set; }
        public Student Student { get; set; }
        public int IdInternship { get; set; }
        public Internship Internship { get; set; }
    }
}
