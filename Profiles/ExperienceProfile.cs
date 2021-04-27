using AutoMapper;
using Licenta.DTOs;
using Licenta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Profiles
{
    public class ExperienceProfile : Profile
    {
        public ExperienceProfile()
        {
            CreateMap<Experience, ExperienceDTO>();
            CreateMap<ExperienceDTO, Experience>();
        }
    }
}
