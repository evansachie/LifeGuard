using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models
{
    public class RegistrationResponse
    {
        public string UserId { get; set; }
        public bool EmailVerified { get; set; }
        public string Message { get; set; }
        public bool AccountCreated { get; set; }
    }
}
