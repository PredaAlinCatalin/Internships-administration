﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class StudentAptitudeDTO
    {
        [Required]
        public int AptitudeId { get; set; }
        [Required]
        public int StudentId { get; set; }
    }
}
