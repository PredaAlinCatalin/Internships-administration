using AutoMapper;
using Licenta.DTOs;
using Licenta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Profiles
{
    public class StudentInternshipProfile : Profile
    {
        public StudentInternshipProfile()
        {
            CreateMap<StudentInternship, StudentInternshipDTO>();
            CreateMap<StudentInternshipDTO, StudentInternship>();
        }
    }
}
