using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentInternshipDTO
    {
        public string IdStudent { get; set; }
        public int IdInternship { get; set; }
        public string ApplicationDate { get; set; }
        public int InternshipGrade { get; set; }
        public string Status { get; set; }
    }
}
