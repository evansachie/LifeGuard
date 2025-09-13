using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.GroupedSensorData
{
    public class AirQuality
    {
        public double aqi { get; set; }
        public double co2 { get; set; }
        public double pm10 { get; set; }
        public double pm25 { get; set; }
        public double voc { get; set; }
    }
}
