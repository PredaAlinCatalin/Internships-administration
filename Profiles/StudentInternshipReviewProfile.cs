using AutoMapper;
using Licenta.DTOs;
using Licenta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.Profiles
{
    public class StudentInternshipReviewProfile : Profile
    {
        public StudentInternshipReviewProfile()
        {
            CreateMap<StudentInternshipReview, StudentInternshipReviewDTO>();
            CreateMap<StudentInternshipReviewDTO, StudentInternshipReview>();
        }
    }
}
