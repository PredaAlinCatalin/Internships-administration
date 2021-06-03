using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Licenta.DTOs
{
    public class CompanyDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LogoPath { get; set; }
        public string CoverPath { get; set; }
        public string Description { get; set; }
        public string Industry { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
    }
}
