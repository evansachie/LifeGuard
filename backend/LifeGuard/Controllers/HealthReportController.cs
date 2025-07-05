using Domain;
using Domain.Contracts.Firebase;
using Domain.Contracts.PDFService;
using Domain.Interfaces.HealthReport;
using Microsoft.AspNetCore.Mvc;

namespace LifeGuard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthReportController :ControllerBase
    {
        private readonly IHealthReportService _healthReportService;
        private readonly IPDFGeneratorService _pdfGeneratorService;
        public HealthReportController(IHealthReportService healthReportService, IPDFGeneratorService pdfGeneratorService)
        { 
            this._healthReportService = healthReportService;
            _pdfGeneratorService = pdfGeneratorService;
        }

        [HttpGet]
        public async Task<ActionResult<HealthReport>> GenerateHealthReport(string deviceId, int range)
        {
            var report = await _healthReportService.GenerateHealthReportAsync(deviceId, range);
            
            return Ok(report);
        }

        //[HttpGet("{deviceId}.pdf")]
        //public async Task<IActionResult> GetHealthReportPdf(string deviceId, [FromQuery] int range = 30)
        //{
        //    var report = await _healthReportService.GenerateHealthReportAsync(deviceId, range);

        //    if (report == null)
        //        return NotFound("No health report data found.");

        //    var pdfBytes = _pdfGeneratorService.GenerateHealthReportPdf(report);

        //    var filename = $"HealthReport_{deviceId}_{DateTime.UtcNow:yyyyMMdd}.pdf";

        //    return File(pdfBytes, "application/pdf", filename);
        //}

    }
}
