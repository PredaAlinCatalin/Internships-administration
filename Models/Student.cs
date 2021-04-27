﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Licenta.Models
{
    public class Student
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
        //aptitudini, limbi straine, pasiuni, educatie, experienta, proiecte
        public virtual ICollection<StudentInternship> StudentInternships { get; set; }
        public virtual ICollection<StudentAptitude> StudentAptitudes { get; set; }
        public virtual ICollection<StudentForeignLanguage> StudentForeignLanguages { get; set; }
        public string Passions { get; set; }
        public virtual ICollection<Education> Educations { get; set; }
        public virtual ICollection<Experience> Experiences { get; set; }
        public virtual ICollection<Project> Projects { get; set; }
        public string UserId { get; set; }
        public virtual IdentityUser User { get; set; }
    }
}