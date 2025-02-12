using Application.Models.ApiResult;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Features.CompleteProfile
{
    public class CompleteProfileCommand : IRequest<Result>
    {
        public string Email { get; set; }
        public string? Gender { get; set; }
        public int? Weight { get; set; }
        public int? Height { get; set; }
    }
}
