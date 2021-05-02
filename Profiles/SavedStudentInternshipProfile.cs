using AutoMapper;
using Licenta.DTOs;
using Licenta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Profiles
{
    public class SavedStudentInternshipProfile : Profile
    {
        public SavedStudentInternshipProfile()
        {
            CreateMap<SavedStudentInternship, SavedStudentInternshipDTO>();
            CreateMap<SavedStudentInternshipDTO, SavedStudentInternship>();
        }
    }
}
