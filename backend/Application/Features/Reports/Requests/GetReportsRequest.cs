using Application.Models.ApiResult;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Reports.Requests
{
    public class GetReportsRequest  : IRequest<Result>
    {
        public string UserId { get; set; }
    }
}
