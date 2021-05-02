using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentInternshipReviewDTO
    {
        public string IdStudent { get; set; }
        public int IdInternship { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
        public int Grade { get; set; }
    }
}
