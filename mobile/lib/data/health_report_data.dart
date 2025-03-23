Map<String, dynamic> generateHealthReport(Map<String, dynamic>? userData) {
  return {
    'userInfo': {
      'reportId': 'HR${DateTime.now().millisecondsSinceEpoch}',
      'date': DateTime.now().toIso8601String(),
      'name': 'Evans Acheampong',
    },
    'vitals': {
      'temperature': {
        'average': '36.5°C',
        'min': '36.2°C',
        'max': '37.1°C',
        'status': 'Normal'
      },
      'heartRate': {
        'average': '72 bpm',
        'min': '65 bpm',
        'max': '85 bpm',
        'status': 'Good'
      },
      'activityLevel': {
        'average': '6,248 steps',
        'min': '4,500 steps',
        'max': '8,000 steps',
        'status': 'Active'
      }
    },
    'environmentalMetrics': {
      'airQuality': {
        'average': '75 AQI',
        'status': 'Moderate'
      },
      'humidity': {
        'average': '65%',
        'status': 'Normal'
      },
      'pressure': {
        'average': '1013 hPa',
        'status': 'Stable'
      }
    },
    'recommendations': [
      'Consider increasing daily water intake',
      'Maintain current activity level',
      'Monitor ambient temperature during peak hours',
      'Keep up the good work with your exercise routine'
    ]
  };
}
