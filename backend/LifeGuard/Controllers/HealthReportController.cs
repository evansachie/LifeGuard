using Domain;
using Domain.Contracts.Firebase;
using Domain.Interfaces.HealthReport;
using Microsoft.AspNetCore.Mvc;

namespace LifeGuard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthReportController :ControllerBase
    {
        private readonly IHealthReportService healthReportService;
        public HealthReportController(IHealthReportService healthReportService)
        { 
            this.healthReportService = healthReportService;
        }

        [HttpGet]
        public async Task<ActionResult<HealthReport>> GenerateHealthReport(string deviceId, int range)
        {
            var report = await healthReportService.GenerateHealthReportAsync(deviceId, range);
            
            return Ok(report);
        }
    }
}
