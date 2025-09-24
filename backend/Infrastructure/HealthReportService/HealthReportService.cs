using Domain;
using Domain.Contracts.Firebase;
using Domain.Interfaces.HealthReport;
using Firebase.Database;
using Infrastructure.FirebaseService;
using LiteDB;
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
                         && r.health != null)
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
                ? Math.Round(tempPoints.Average(r => r.environmental.temperature), 1)
                : 0;

            var humidityPoints = dataPoints.Where(r => r.environmental.humidity != null).ToList();
            double avgHumidity = humidityPoints.Any()
                ? Math.Round(humidityPoints.Average(r => r.environmental.humidity), 1)
                : 0;

            var aqiPoints = dataPoints.Where(r => r.environmental.airQuality.aqi != null).ToList();
            int avgAirQualityIndex = aqiPoints.Any()
                ? (int)Math.Round(aqiPoints.Average(r => r.environmental.airQuality.aqi))
                : 0;

            int minAqi = aqiPoints.Any() ? (int)aqiPoints.Min(r => r.environmental.airQuality.aqi) : 0;
            int maxAqi = aqiPoints.Any() ? (int)aqiPoints.Max(r => r.environmental.airQuality.aqi) : 0;

            var co2Points = dataPoints.Where(r => r.environmental.airQuality.co2 != null).ToList();
            double avgco2= co2Points.Any()
                ? Math.Round(co2Points.Average(r => r.environmental.airQuality.co2), 2)
                : 0;

            var vocPoints = dataPoints.Where(r => r.environmental.airQuality.voc != null).ToList();
            double avgvoc = vocPoints.Any()
                ? Math.Round(vocPoints.Average(r => r.environmental.airQuality.voc),2)
                : 0;

            var pm25Points = dataPoints.Where(r => r.environmental.airQuality.pm25 != null).ToList();
            double avgpm25 = pm25Points.Any()
                ?Math.Round(pm25Points.Average(r => r.environmental.airQuality.pm25), 2)
                : 0;

            var pm10Points = dataPoints.Where(r => r.environmental.airQuality.pm10 != null).ToList();
            double avgpm10 = pm10Points.Any()
                ? Math.Round(pm10Points.Average(r => r.environmental.airQuality.pm10), 2)
                : 0;

            var pressurePoints = dataPoints.Where(r => r.environmental.pressure != null).ToList();
            double avgPressure = pressurePoints.Any()
                ? Math.Round(pressurePoints.Average(r => r.environmental.pressure), 2)
                : 0;

            var bloodPressureSystolicPoints = dataPoints.Where(r => r.health.bloodPressure.systolic != null).ToList();
            double avgbloodPressureSystolic = bloodPressureSystolicPoints.Any()
                                            ? Math.Round(bloodPressureSystolicPoints.Average(r => r.health.bloodPressure.systolic), 2) :
                                            0;

            var bloodPressureDiastolicPoints = dataPoints.Where(r => r.health.bloodPressure.diastolic != null).ToList();
            double avgbloodPressureDiastolic = bloodPressureDiastolicPoints.Any()
                                            ? Math.Round(bloodPressureDiastolicPoints.Average(r => r.health.bloodPressure.diastolic), 2) :
                                            0;

            var bodyTemperaturePoints = dataPoints.Where(r => r.health.bodyTemperature != null).ToList();
            double avgBodyTemperature = bodyTemperaturePoints.Any()
                                        ? Math.Round(bodyTemperaturePoints.Average(r => r.health.bodyTemperature), 2)
                                        : 0;

            var heartRatePoints = dataPoints.Where(r => r.health.heartRate != null).ToList();
            double avgHeartRate = heartRatePoints.Any()
                               ? Math.Round(heartRatePoints.Average(r => r.health.heartRate), 2)
                               : 0;

            var oxygenSaturationPoints = dataPoints.Where(r => r.health.oxygenSaturation != null).ToList();
            int avgOxygenSaturation = oxygenSaturationPoints.Any()
                                      ? (int)Math.Round(oxygenSaturationPoints.Average(r => r.health.oxygenSaturation), 2)
                                      : 0;

            int fallCount = dataPoints.Count(r => r.motion.fallDetected);



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
                Avgco2 = avgco2,
                Avgvoc = avgvoc,
                Avgpm25 = avgpm25,
                Avgpm10 = avgpm10,
                Minaqi = minAqi,
                Maxaqi = maxAqi,
                AvgPressure = avgPressure,
                AvgbloodPressureSystolic = avgbloodPressureSystolic,
                AvgbloodPressureDiastolic = avgbloodPressureDiastolic,
                AvgBodyTemperature = avgBodyTemperature,
                AvgHeartRate = avgHeartRate,
                AvgOxygenSaturation = avgOxygenSaturation,
                FallCount = fallCount,
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
