using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Contracts.Firebase
{
    public interface IFirebaseSensorService
    {
        Task<List<SensorReading>> GetReadingsFromDeviceAsync(string deviceId, long startTimestamp, long endTimestamp);

        Task<Status> GetDeviceStatusAsync(string deviceId);
    }
}
