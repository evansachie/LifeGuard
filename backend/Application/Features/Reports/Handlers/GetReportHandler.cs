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
    public class GetReportHandler : IRequestHandler<GetReportRequest, Result>
    {
        private readonly IHealthReportRepository _healthReportRepository;
        public GetReportHandler(IHealthReportRepository healthReportRepository) {
            _healthReportRepository = healthReportRepository;   
        }

        public async Task<Result> Handle(GetReportRequest request, CancellationToken cancellationToken)
        {
            var reports = await _healthReportRepository.GetReportByUserIdAsync(request.UserId);

            if (reports.Count == 0)
            {
                return new Result(false, ResultStatusCode.NotFound, "No reports found for the user.");
            }

            return new Result<IReadOnlyList<HealthReport>>(true, ResultStatusCode.Success, reports);
        }
    }
}
