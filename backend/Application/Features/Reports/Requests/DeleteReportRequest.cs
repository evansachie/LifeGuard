using Application.Models.ApiResult;
using Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Reports.Requests
{
    public class DeleteReportRequest : IRequest<Result>
    {
        public HealthReport HealthReport;
        
    }
}
