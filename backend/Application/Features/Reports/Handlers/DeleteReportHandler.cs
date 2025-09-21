using Application.Contracts.Persistence;
using Application.Features.Reports.Requests;
using Application.Models.ApiResult;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Reports.Handlers
{
    public class DeleteReportHandler : IRequestHandler<DeleteReportRequest, Result>
    {
        private readonly IHealthReportRepository _healthReportRepository;

        public DeleteReportHandler(IHealthReportRepository healthReportRepository)
        {
            _healthReportRepository = healthReportRepository;
        }


        public async Task<Result> Handle(DeleteReportRequest request, CancellationToken token)
        {
            await _healthReportRepository.Delete(request.HealthReport);

            return new Result(true, ResultStatusCode.Success, "Report deleted successfully.");
        }

    }
    
}
