using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.GroupedSensorData
{
    public class MotionData
    {
        public AccelerometerData accelerometer { get; set; }
        public string activity { get; set; }
        public bool fallDetected { get; set; }
        public GyroscopeData gyroscope { get; set; }
        public int stepCount { get; set; }
    }
}
