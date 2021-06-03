using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Licenta.Models
{
    public class Internship
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
        public virtual ICollection<StudentInternship> StudentInternships { get; set; }
        public virtual ICollection<InternshipCategory> InternshipCategories { get; set; }
        public virtual ICollection<InternshipAptitude> InternshipAptitudes { get; set; }
        public virtual ICollection<SavedStudentInternship> SavedStudentInternships { get; set; }
        public virtual ICollection<StudentInternshipReview> StudentInternshipReviews { get; set; }
        [Required]
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; }
        [Required]
        public int CityId { get; set; }
        public virtual City City { get; set; }
    }
}
