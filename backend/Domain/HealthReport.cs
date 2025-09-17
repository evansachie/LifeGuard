﻿using Domain.Common;
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

        public int Avgco2 { get; set; }
        public int Avgvoc { get; set; }
        public int Avgpm25 { get; set; }
        public int Avgpm10 { get; set; }
        public int Minaqi { get; set; }
        public int Maxaqi { get; set; }
        public int FallCount { get; set; } 
        public double AvgDailySteps { get; set; }
        public double AvgPressure { get; set; } 
        public DateTime LastUpdate { get; set; }
        public string Status { get; set; }
        public int DataPointCount { get; set; }
    }
}
