using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class HealthReport 
    {
        public string DeviceId { get; set; }
        public string UserId { get; set; }
        public DateTime ReportDate { get; set; }
        public string ReportPeriod { get; set; }
        public int TotalSteps { get; set; }
        public double AvgAmbientTemp { get; set; }
        public double AvgHumidity { get; set; }
        public int AvgAirQualityIndex { get; set; }
        public double AvgDailySteps { get; set; }
        public double AvgPressure { get; set; } 
        public DateTime LastUpdate { get; set; }
        public string Status { get; set; }
        public int DataPointCount { get; set; }
    }
}
