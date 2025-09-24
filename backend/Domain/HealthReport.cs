using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class HealthReport : BaseEntity
    {
        public string DeviceId { get; set; }
        public DateTime ReportDate { get; set; }
        public string ReportPeriod { get; set; }
        public int TotalSteps { get; set; }
        public double AvgAmbientTemp { get; set; }
        public double AvgHumidity { get; set; }
        public int AvgAirQualityIndex { get; set; }
        public double Avgco2 { get; set; }
        public double Avgvoc { get; set; }
        public double Avgpm25 { get; set; }
        public double Avgpm10 { get; set; }
        public int Minaqi { get; set; }
        public int Maxaqi { get; set; }
        public double AvgbloodPressureSystolic { get; set; }
        public double AvgbloodPressureDiastolic { get; set; }
        public double AvgBodyTemperature { get; set; }
        public double AvgHeartRate { get; set; }
        public double AvgOxygenSaturation { get; set; }   
        public int FallCount { get; set; } 
        public int AvgDailySteps { get; set; }
        public double AvgPressure { get; set; } 
        public DateTime LastUpdate { get; set; }
        public string Status { get; set; }
        public int DataPointCount { get; set; }
    }
}
