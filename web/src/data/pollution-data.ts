import { PollutionZone } from '../types/pollutionTracker.types';

// Mock pollution zone data
export const pollutionZones: PollutionZone[] = [
  {
    id: '1',
    name: 'University of Ghana, Legon',
    coordinates: [5.6505, -0.187],
    radius: 500,
    level: 'high',
    data: {
      aqi: 156,
      pm25: 75.2,
      pm10: 142.8
    },
    description: 'High pollution levels due to dense traffic and construction'
  },
  {
    id: '2',
    name: 'UG Business School Area',
    coordinates: [5.6478, -0.1864],
    radius: 300,
    level: 'medium',
    data: {
      aqi: 89,
      pm25: 35.5,
      pm10: 82.3
    },
    description: 'Moderate pollution due to medium traffic flow'
  },
  {
    id: '3',
    name: 'Legon Hall Area',
    coordinates: [5.6525, -0.1875],
    radius: 400,
    level: 'low',
    data: {
      aqi: 42,
      pm25: 12.8,
      pm10: 38.5
    },
    description: 'Lower pollution levels with good air circulation'
  },
  {
    id: '4',
    name: 'Athletic Oval Area',
    coordinates: [5.6498, -0.1882],
    radius: 400,
    level: 'moderate',
    data: {
      aqi: 95,
      pm25: 42.3,
      pm10: 88.7
    },
    description: 'Moderate pollution with occasional spikes during events'
  },
  {
    id: '5',
    name: 'Engineering Department',
    coordinates: [5.651, -0.1865],
    radius: 350,
    level: 'veryhigh',
    data: {
      aqi: 190,
      pm25: 78.4,
      pm10: 150.1
    },
    description: 'Very high pollution from nearby construction'
  },
  {
    id: '6',
    name: 'Science Complex',
    coordinates: [5.6485, -0.1859],
    radius: 350,
    level: 'moderate',
    data: {
      aqi: 87,
      pm25: 33.1,
      pm10: 79.4
    },
    description: 'Moderate levels with occasional laboratory emissions'
  },
  {
    id: '7',
    name: 'Balme Library',
    coordinates: [5.6502, -0.188],
    radius: 300,
    level: 'low',
    data: {
      aqi: 40,
      pm25: 11.2,
      pm10: 35.9
    },
    description: 'Low pollution due to central campus location and greenery'
  },
  {
    id: '8',
    name: 'Volta Hall Area',
    coordinates: [5.653, -0.1868],
    radius: 250,
    level: 'medium',
    data: {
      aqi: 102,
      pm25: 45.6,
      pm10: 92.4
    },
    description: 'Medium pollution affected by main road proximity'
  },
  {
    id: '9',
    name: 'Night Market Area',
    coordinates: [5.6468, -0.1862],
    radius: 400,
    level: 'hazardous',
    data: {
      aqi: 315,
      pm25: 120.3,
      pm10: 220.5
    },
    description: 'Hazardous conditions due to cooking smoke and generators'
  },
  {
    id: '10',
    name: 'Commonwealth Hall',
    coordinates: [5.6515, -0.1855],
    radius: 300,
    level: 'medium',
    data: {
      aqi: 91,
      pm25: 38.7,
      pm10: 85.9
    },
    description: 'Medium pollution levels with regular traffic flow'
  }
];