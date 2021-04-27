using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class InternshipDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Deadline { get; set; }
        public int MaxNumberStudents { get; set; }
        public bool Paid { get; set; }

        public string Description { get; set; }
        public string IdCompany { get; set; }
        public int IdCity { get; set; }
    }
}
