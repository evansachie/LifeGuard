using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.GroupedSensorData
{
    public class EnvironmentalData
    {
        public AirQuality airQuality { get; set; }
        public double humidity { get; set; }
        public double pressure { get; set; }
        public double temperature { get; set; }
    }
}
