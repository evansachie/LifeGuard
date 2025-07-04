using Domain;
using Firebase.Database;
using Firebase.Database.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FirebaseService
{
    public class FirebaseSensorService
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


        public async Task<List<SensorReading>> GetReadingsFromDevice30DaysAsync(string deviceId, long startTimestamp, long endTimestamp)
        {
            var readings = await _client
            .Child("devices").Child(deviceId).Child("sensorData")
            .OrderByKey()
            .StartAt(startTimestamp.ToString())
            .EndAt(endTimestamp.ToString())
            .OnceAsync<SensorReading>();

            return readings.Select(r => r.Object).ToList();
        }
    }
}