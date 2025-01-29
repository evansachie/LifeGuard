using Application.Models.ApiResult;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.Features.ResendOTP
{
    public class ResendOTPCommand : IRequest<Result>
    {
        public string Email { get; set; }

      
    }
}
