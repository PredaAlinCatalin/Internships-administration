using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class EducationDTO
    {
        public int Id { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Institution { get; set; }
        public string Specialization { get; set; }
        public string IdStudent { get; set; }
    }
}
