using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentFormDTO
    {
        public string Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Faculty { get; set; }
        public string Specialization { get; set; }
        public int Year { get; set; }
        public double AnnualAverage { get; set; }
        public string PersonalDescription { get; set; }
        public string PhotoPath { get; set; }
        public string Passions { get; set; }
        public string PhoneNumber { get; set; }
    }
}
