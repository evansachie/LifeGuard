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
    public class AddReportHandler : IRequestHandler<AddReportRequest, Result>
    {
        private readonly IHealthReportRepository _healthReportRepository;

        public AddReportHandler(IHealthReportRepository healthReportRepository)
        {
            _healthReportRepository = healthReportRepository;
        }


        public async Task<Result> Handle(AddReportRequest request, CancellationToken token)
        {
            var result = await _healthReportRepository.Add(request.HealthReport);

            return new Result(true, ResultStatusCode.Success, "Report Added Successfully");

        }




    }
}
