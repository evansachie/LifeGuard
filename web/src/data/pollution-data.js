export const pollutionZones = [
    {
      id: '1',
      coordinates: [5.6505, -0.1870], // University of Ghana, Legon
      level: 'high',
      radius: 500,
      data: {
        aqi: 156,
        pm25: 75.2,
        pm10: 142.8,
      }
    },
    {
      id: '2',
      coordinates: [5.6478, -0.1864], // UG Business School area
      level: 'medium',
      radius: 300,
      data: {
        aqi: 89,
        pm25: 35.5,
        pm10: 82.3,
      }
    },
    {
      id: '3',
      coordinates: [5.6525, -0.1875], // Legon Hall area
      level: 'low',
      radius: 400,
      data: {
        aqi: 42,
        pm25: 12.8,
        pm10: 38.5,
      }
    },
    {
      id: '4',
      coordinates: [5.6498, -0.1882], // Athletic Oval area
      level: 'medium',
      radius: 400,
      data: {
        aqi: 95,
        pm25: 42.3,
        pm10: 88.7,
      }
    }
];