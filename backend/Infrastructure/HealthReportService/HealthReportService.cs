using Domain;
using Domain.Contracts.Firebase;
using Domain.Interfaces.HealthReport;
using Firebase.Database;
using Infrastructure.FirebaseService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.HealthReportService
{
    public class HealthReportService : IHealthReportService
    {
        private readonly FirebaseClient _client;
        private readonly IFirebaseSensorService _firebaseSensorService;

        public HealthReportService(FirebaseClient client, IFirebaseSensorService firebaseSensorService)
        {
            _client = client;
            _firebaseSensorService = firebaseSensorService;
        }

        public async Task<HealthReport?> GenerateHealthReportAsync(string deviceId, int range)
        {
            DateTime endDate = DateTime.UtcNow;
            DateTime startDate = endDate.AddDays(-1 * range);

            long startTimestamp = new DateTimeOffset(startDate).ToUnixTimeMilliseconds();
            long endTimestamp = new DateTimeOffset(endDate).ToUnixTimeMilliseconds();

            var readings = await _firebaseSensorService.GetReadingsFromDeviceAsync(deviceId, startTimestamp, endTimestamp);
            var status = await _firebaseSensorService.GetDeviceStatusAsync(deviceId);

            var dataPoints = readings
                .Where(r => r.motion != null
                         && r.environmental != null
                         && r.environmental.airQuality != null)
                .ToList();

            
            if (dataPoints.Count == 0)
                return null;

            var stepPoints = dataPoints.Where(r => r.motion.stepCount != null).ToList();
            int totalSteps = (stepPoints.Count >= 2)
                ? stepPoints.Max(r => r.motion.stepCount) - stepPoints.Min(r => r.motion.stepCount)
                : 0;
            int avgDailySteps = stepPoints.Any()
                ? (int)Math.Round(stepPoints.Average(r => r.motion.stepCount))
                : 0;

            var tempPoints = dataPoints.Where(r => r.environmental.temperature != null).ToList();
            double avgAmbientTemp = tempPoints.Any()
                ? tempPoints.Average(r => r.environmental.temperature)
                : 0;

            var humidityPoints = dataPoints.Where(r => r.environmental.humidity != null).ToList();
            double avgHumidity = humidityPoints.Any()
                ? Math.Round(humidityPoints.Average(r => r.environmental.humidity), 2)
                : 0;

            var aqiPoints = dataPoints.Where(r => r.environmental.airQuality.aqi != null).ToList();
            int avgAirQualityIndex = aqiPoints.Any()
                ? (int)Math.Round(aqiPoints.Average(r => r.environmental.airQuality.aqi))
                : 0;

            var report = new HealthReport
            {
                DeviceId = deviceId,
                UserId = status.LastDataKey[5..],
                ReportDate = endDate,
                ReportPeriod = $"{range}-Day Average",
                TotalSteps = totalSteps,
                AvgDailySteps = avgDailySteps,
                AvgAmbientTemp = avgAmbientTemp,
                AvgHumidity = avgHumidity,
                AvgAirQualityIndex = avgAirQualityIndex,
                DataPointCount = dataPoints.Count,
                LastUpdate = status.LastUpdate,

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
