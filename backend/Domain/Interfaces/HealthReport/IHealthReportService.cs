using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Domain.Interfaces.HealthReport
{
    public interface IHealthReportService
    {
        Task<Domain.HealthReport> GenerateHealthReportAsync(string deviceId, int range);
    }
}
