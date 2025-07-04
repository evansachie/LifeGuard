using Domain;
using Firebase.Database;
using Infrastructure.FirebaseService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.HealthReportService
{
    public class HealthReportData
    {
        private readonly FirebaseClient _client;
        private readonly FirebaseSensorService _firebaseSensorService;

        public HealthReportData(FirebaseClient client, FirebaseSensorService firebaseSensorService)
        {
            _client = client;
            _firebaseSensorService = firebaseSensorService;
        }


        public async Task<HealthReport> Generate300DayHealthReportAsync(string deviceId)
        {
            DateTime endDate = DateTime.UtcNow;
            DateTime startDate = endDate.AddDays(-29);

            long startTimestamp = new DateTimeOffset(startDate).ToUnixTimeSeconds();
            long endTimestamp = new DateTimeOffset(endDate).ToUnixTimeSeconds();

            var readings = await _firebaseSensorService.GetReadingsFromDevice30DaysAsync(deviceId, startTimestamp, endTimestamp);

            var dataPoints = readings.ToList();
           

            if (dataPoints.Count == 0)
                return null;

            var report = new HealthReport
            {
                DeviceId = deviceId,
                ReportDate = endDate,
                ReportPeriod = "30-Day Average",
                TotalSteps = dataPoints.Max(r => r.motionData.stepCount) - dataPoints.Min(r => r.motionData.stepCount),
                AvgDailySteps = (int)Math.Round(dataPoints.Average(r => r.motionData.stepCount)),
                AvgAmbientTemp = dataPoints.Average(r => r.environmental.temperature),
                AvgHumidity = Math.Round(dataPoints.Average(r => r.environmental.humidity), 2),
                AvgAirQualityIndex = (int)Math.Round(dataPoints.Average(r => r.environmental.airQuality.aqi)),
                DataPointCount = dataPoints.Count,

            };

            report.Status = DetermineHealthStatus(report);

            return report;
        }

        private string DetermineHealthStatus(HealthReport report)
        {
            var warnings = new List<string>();

            if (report.AvgAirQualityIndex > 100)
                warnings.Add("Poor Air Quality");
            

            return warnings.Any() ? $"Warning: {string.Join(", ", warnings)}" : "Normal";
        }
        

        
    }

}
