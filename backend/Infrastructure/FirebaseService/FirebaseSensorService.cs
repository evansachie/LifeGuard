using Domain;
using Domain.Contracts.Firebase;
using Firebase.Database;
using Firebase.Database.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FirebaseService
{
    public class FirebaseSensorService : IFirebaseSensorService
    {
        private readonly FirebaseClient _client;

        public FirebaseSensorService(FirebaseClient client)
        {
            _client = client;
        }

        public async Task<List<SensorReading>> GetReadingsForDevice(string deviceId)
        {
            var readings = await _client
                    .Child("devices")
                    .Child(deviceId)
                    .Child("sensorData")
                    .OnceAsync<SensorReading>();


            return readings.Select(r => r.Object).ToList();
        }


        public async Task<List<SensorReading>> GetReadingsFromDeviceAsync(string deviceId, long startTimestamp, long endTimestamp)
        {
            var readings = await _client
            .Child("devices")
            .Child(deviceId)
            .Child("sensorData")
            .OnceAsync<SensorReading>();

            var dataPoints = readings
            .Select(r => r.Object)
            .Where(r => r.timestamp >= startTimestamp && r.timestamp <= endTimestamp)
            .ToList();

            return dataPoints;
        }
    }
}