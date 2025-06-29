using Application.Contracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public int? Age { get; set; }    
        public string? Gender { get; set; }
        public int? Weight { get; set; }
        public int? Height { get; set; }
        public string? Bio {  get; set; }   
        public string SecretKey { get; set; }
        public string? PhotoUrl { get; set; }
        public string? PhotoPublicId { get; set; }
        
    }
}