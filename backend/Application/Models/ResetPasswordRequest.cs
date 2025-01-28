using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models
{
    public class ResetPasswordRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
        [Required]
        [MinLength(6)]
        public string ConfirmPassword { get; set; }
    }
}
