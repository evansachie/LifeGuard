using Domain.Common;
using Domain.GroupedSensorData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class SensorReading : BaseEntity
    {
        public EnvironmentalData environmental { get; set; }
        public AirQuality  airQuality { get; set; }
        public MotionData motionData { get; set; }
        public long timestamp { get; set; }
        

    }
}
