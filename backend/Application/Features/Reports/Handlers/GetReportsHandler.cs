using Application.Contracts.Persistence;
using Application.Features.Reports.Requests;
using Application.Models.ApiResult;
using Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Reports.Handlers
{
    public class GetReportsHandler : IRequestHandler<GetReportsRequest, Result>
    {
        private readonly IHealthReportRepository _healthReportRepository;
        public GetReportsHandler(IHealthReportRepository healthReportRepository) {
            _healthReportRepository = healthReportRepository;   
        }

        public async Task<Result> Handle(GetReportsRequest request, CancellationToken cancellationToken)
        {
            var reports = await _healthReportRepository.GetReportsByUserIdAsync(request.UserId);

            if (reports.Count == 0)
            {
                return new Result(false, ResultStatusCode.NotFound, "No reports found for the user.");
            }

            return new Result<IReadOnlyList<HealthReport>>(true, ResultStatusCode.Success, reports);
        }
    }
}
