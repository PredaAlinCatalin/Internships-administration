﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class LoginResponseDTO
    {
        public string UserId { get; set; }
        public string UserRole { get; set; }
        public string Token { get; set; }
    }
}
