using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Photos
{
    public class GetProfileDto
    {
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public int? Weight { get; set; }
        public int? Height { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Bio { get; set; }
    }
}
