using Licenta.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class InternshipDTO
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string StartDate { get; set; }
        [Required]
        public string EndDate { get; set; }
        [Required]
        public string Deadline { get; set; }
        [Required]
        public string CreationDate { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public int MaxNumberStudents { get; set; }
        [Required]
        public bool Paid { get; set; }
        public int Salary { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int CompanyId { get; set; }
        [Required]
        public int CityId { get; set; }
    }
}
