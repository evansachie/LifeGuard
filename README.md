# LifeGuard: Wearable Health & Environmental Monitoring System

<p align="center">
  <img src="docs/images/lifeguard-logo.png" alt="LifeGuard Logo" width="200"/>
</p>

LifeGuard is an innovative wearable health and environmental monitoring system built around the Nicla Sense ME board. By combining advanced motion detection with environmental sensing, it provides real-time monitoring and alerts for various safety scenarios, from fall detection to air quality warnings.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Mobile App](#mobile-app)
- [Contributing](#contributing)
- [Documentation](#documentation)

## Overview

LifeGuard addresses critical gaps in personal safety, accessibility, and preventive healthcare through:
- Real-time health and environmental monitoring
- Advanced fall detection and activity recognition
- Comprehensive air quality analysis
- Emergency alert system
- Cost-effective design for accessibility

### Target Audience
- Aging population (55+ years)
- Health-conscious individuals (25-54 years)
- Industrial workers
- Healthcare providers

## Features

### Health Monitoring
- Fall detection using ML algorithms
- Activity recognition (walking, running, cycling)
- Heart rate monitoring
- Emergency alert system

### Environmental Monitoring
- Temperature and humidity sensing
- Air quality analysis (CO2, VOCs)
- Atmospheric pressure monitoring
- Real-time pollution mapping

### Technical Specifications
- **Battery**: LiPo 3.7V, 400mAh
- **Water Resistance**: IP67
- **Connectivity**: BLE/USB
- **Sensors**: 9 integrated sensors
- **Processing**: Edge computing with ML capabilities

## System Architecture

![System Architecture](docs/images/system-architecture.PNG)

### Hardware Components
- Arduino Nicla Sense ME board
- Custom-designed enclosure
- Integrated sensor array

### Software Stack
#### Frontend
- React (Web Dashboard)
- React Native (Mobile App)
- TypeScript
- Tailwind CSS
- Redux

#### Backend
- .NET Core 8.0
- PostgreSQL
- JWT Authentication
- SendGrid (Email)

## API Documentation

### Authentication Endpoints
```http
POST /api/Account/register
POST /api/Account/login
POST /api/Account/verify-otp
POST /api/Account/resend-otp
```

### User Management
```http
GET /api/Account/user-profile
PUT /api/Account/update-profile
POST /api/Account/forgot-password
```

### Health Monitoring
```http
GET /api/Health/vitals
POST /api/Health/record
GET /api/Health/history
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/AWESOME04/LifeGuard.git
cd LifeGuard
```

2. Frontend Setup:
```bash
cd web
npm install
npm start
```

3. Backend Setup:
```bash
cd backend
dotnet restore
dotnet run
```

## Environment Variables

### Frontend (.env)
```env
VITE_MAPBOX_API_KEY=your_mapbox_key
VITE_MODEL_URL=your_model_url
```


### Backend (.env)
```env
CONNECTION_STRING=your_db_connection
JWT_KEY=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
```

## Project Structure
```
lifeguard/
├── hardware/         # PCB & enclosure designs
├── firmware/         # Arduino/C++ code
├── web/             # React dashboard
├── mobile/          # React Native app
├── backend/         # .NET Core API
└── docs/            # Documentation
```

## Documentation
- [Full Documentation (PDF)](docs/LifeGuard_V2.3.pdf)
- [API Documentation](docs/lifeGuard.json)

## Team

### Core Team
- [Evans Acheampong](https://github.com/AWESOME04) - 10987644
  - Frontend Development
  - Hardware Integration
  - Documentation

- [Michael Adu-Gyamfi](https://github.com/mikkayadu) - 10980219
  - Backend Development
  - Machine Learning
  - System Security

### Advisors
- Dr. Percy Okae - Project Supervisor
- Chiratidzo Matowe - Advisor
- Marvin Rotermund - Ambassador, Embedded Learning Challenge


## Support
For support, email evansachie01@gmail.com or michaeladugyamfi76@gmail.com.