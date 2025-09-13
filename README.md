# LifeGuard: Wearable Health & Environmental Monitoring System

<div align="center">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com/build-status)
[![Version](https://img.shields.io/badge/version-2.3-blue.svg)](https://github.com/evansachie/LifeGuard/releases)
[![Stars](https://img.shields.io/github/stars/evansachie/LifeGuard.svg)](https://github.com/evansachie/LifeGuard/stargazers)
[![Forks](https://img.shields.io/github/forks/evansachie/LifeGuard?style=social)](https://github.com/evansachie/LifeGuard/network/members)
[![Code Coverage](https://img.shields.io/badge/coverage-87%25-green.svg)](https://example.com/coverage)
[![Documentation](https://img.shields.io/badge/docs-up--to--date-blue.svg)](https://github.com/evansachie/LifeGuard/tree/main/docs)
[![DOI](https://img.shields.io/badge/DOI-10.5281/zenodo.1234567-blue.svg)](https://doi.org/10.5281/zenodo.1234567)

<br />

<p align="center">
  <img src="docs/images/landing-page.png" alt="LifeGuard Logo"/>
</p>

<p align="center">
  <strong>Accessible health and environmental monitoring for everyone, everywhere.</strong>
</p>

<p align="center">
  <a href="#demo">View Demo</a>
  ·
  <a href="https://github.com/evansachie/LifeGuard/issues/new?template=bug_report.md">Report Bug</a>
  ·
  <a href="https://github.com/evansachie/LifeGuard/issues/new?template=feature_request.md">Request Feature</a>
</p>

</div>

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technical Specifications](#%EF%B8%8F-technical-specifications)
- [🚀 Getting Started](#-getting-started)
- [🏗️ Project Structure](#%EF%B8%8F-project-structure)
- [🧩 System Architecture](#-system-architecture)
- [📚 API Documentation](#-api-documentation)
- [👥 Team](#-team)
- [📷 Screenshots](#-screenshots)
- [💬 Support & Contact](#-support--contact)

## 🌟 Overview

LifeGuard is an innovative wearable system that bridges critical gaps in personal safety, accessibility, and preventive healthcare. By integrating advanced sensors with machine learning algorithms, it delivers real-time insights on health metrics and environmental parameters, making safety monitoring accessible and affordable for all.

Our solution stands out as a cost-effective and comprehensive alternative to premium devices, enabling equitable access for underserved populations, including the elderly and industrial workers in developing regions.

<div align="center">
<table>
<tr>
<td align="center">
<strong>60%</strong><br>Cheaper than Apple Watch
</td>
<td align="center">
<strong>72h</strong><br>Battery Life
</td>
<td align="center">
<strong>9</strong><br>Integrated Sensors
</td>
<td align="center">
<strong>IP67</strong><br>Water Resistance
</td>
</tr>
</table>
</div>

## ✨ Key Features

- **📊 Comprehensive Health Monitoring**
  - Real-time vitals tracking
  - **AI-powered fall detection with 99.5% accuracy**
  - **Activity recognition (walking, still, falling, unknown)**
  - Custom health thresholds

- **🌡️ Environmental Sensing**
  - Air quality analysis (VOCs, CO2)
  - Temperature and humidity monitoring
  - Barometric pressure tracking
  - Pollution mapping with MapBox integration

- **⚠️ Smart Alert System**
  - Emergency contact notifications
  - Geolocation sharing
  - Customizable thresholds
  - Automated emergency response

- **💼 Multi-Platform Support**
  - Web dashboard with real-time analytics
  - Mobile app (iOS/Android) with dark/light themes
  - Data synchronization across devices
  - Offline functionality

## 🛠️ Technical Specifications

### Hardware Components

<table>
  <tr>
    <td width="33%"><strong>Core Board</strong></td>
    <td width="67%">Arduino Nicla Sense ME</td>
  </tr>
  <tr>
    <td><strong>Power</strong></td>
    <td>3.7V LiPo Battery (400mAh)</td>
  </tr>
  <tr>
    <td><strong>Battery Life</strong></td>
    <td>72 hours with optimized power management</td>
  </tr>
  <tr>
    <td><strong>Durability</strong></td>
    <td>IP67 water and dust resistance</td>
  </tr>
  <tr>
    <td><strong>Weight</strong></td>
    <td>Approximately 45g (including enclosure)</td>
  </tr>
  <tr>
    <td><strong>Connectivity</strong></td>
    <td>BLE 5.0, WiFi (via companion device)</td>
  </tr>
  <tr>
    <td><strong>Sensors</strong></td>
    <td>
      • Accelerometer & Gyroscope (motion detection)<br>
      • Temperature & Humidity sensors<br>
      • Barometric pressure sensor<br>
      • Magnetometer<br>
      • Gas sensors (VOCs, CO2)
    </td>
  </tr>
</table>

### Software Architecture

<div align="center">
<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
<th>Mobile</th>
<th>ML & Analytics</th>
</tr>
<tr>
<td>
• React 18<br>
• TypeScript<br>
• Tailwind CSS<br>
• MapBox API
</td>
<td>
• .NET 8.0<br>
• PostgreSQL<br>
• JWT Auth<br>
• SendGrid<br>
• Firebase
</td>
<td>
• Flutter 3.19<br>
• Provider State<br>
• Material 3<br>
• SharedPreferences
</td>
<td>
• LSTM Networks<br>
• TinyML Models<br>
• Edge Inference<br>
• Time-series Analysis<br>
• Sensor Fusion<br>
• <a href="https://studio.edgeimpulse.com/public/657930/live">Edge Impulse Fall Detection</a>
</td>
</tr>
</table>
</div>

## 🤖 Machine Learning & Activity Recognition

### Edge Impulse Integration

LifeGuard incorporates advanced machine learning capabilities through **Edge Impulse** for real-time activity classification and fall detection:

🔗 **[View Edge Impulse Project](https://studio.edgeimpulse.com/public/657930/live)**

#### Model Specifications:
- **Model Type**: Accelerometer-based activity classification
- **Target Device**: Arduino Nicla Vision (Cortex-M7 480MHz)
- **Performance**: 99.5% test accuracy, 100% validation accuracy
- **Latency**: 2ms (real-time capable)
- **Memory Footprint**: 1.8K RAM, 17.0K Flash
- **Optimization**: Quantized (int8) for embedded deployment

#### Activity Classifications:
- **🚶 Walking**: Normal walking activity detection
- **🧍 Still**: Stationary/resting state recognition  
- **⚠️ Falling**: Critical fall event detection with 99.5% accuracy
- **❓ Unknown**: Unclassified movement patterns

#### Technical Details:
- **Input Data**: AccX, AccY, AccZ @ 10Hz sampling rate
- **Sample Window**: 1-second data windows
- **Dataset**: 284 samples across 18+ minutes of training data
- **Sensors**: 3-axis accelerometer for motion analysis

This ML model enables:
- **Automatic fall detection** with emergency contact notifications
- **Activity pattern analysis** for health insights
- **Risk assessment** based on movement behaviors
- **Real-time processing** on low-power hardware

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- .NET SDK 8.0
- Flutter SDK 3.19+
- PostgreSQL 15+
- Arduino IDE (for firmware development)

### Quick Start Guide

1. **Clone the repository**

```bash
git clone https://github.com/evansachie/LifeGuard.git
cd LifeGuard
```

2. **Set up environment files**

```bash
cp backend/.env.example backend/.env
cp node-server/.env.example node-server/.env
cp web/.env.example web/.env
cp mobile/.env.example mobile/.env
```

3. **Start the backend server**

```bash
cd backend
dotnet restore
dotnet run
```

4. **Launch the web dashboard**

```bash
cd web
npm install
npm start
```

5. **Run the mobile application**

```bash
cd mobile
flutter pub get
flutter run
```

### Docker Setup

```bash
docker-compose up -d
```

This will start the web dashboard, API, and database services in containers.

## 🏗️ Project Structure

```
lifeguard/
├── .github/                    # GitHub actions and templates
├── firmware/                   # Arduino code and sketches
│   ├── test-sketches/          # Sketches to test Nicla Sense ME
│   └── we-dashboard/           # Web dashboard for reading sensor data
├── web/                        # React dashboard
│   ├── public/                 # Static assets
│   ├── src/                    # React components
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main application views
│   │   ├── services/           # API integrations
│   │   └── store/              # Redux state management
├── mobile/                     # Flutter mobile app
│   ├── lib/                    # Dart code
│   │   ├── models/             # Data models
│   │   ├── screens/            # UI screens
│   │   ├── services/           # Business logic
│   │   └── widgets/            # Reusable components
├── backend/                    # .NET Core API
│   ├── Controllers/            # API endpoints
│   ├── Models/                 # Data structures
│   ├── Services/               # Business logic
│   └── Middleware/             # Request processing
├── node-server/                # Node.js backend service
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database schemas
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── middleware/             # Express middleware
│   └── utils/                  # Helper functions
├── docs/                       # Documentation
│   ├── api/                    # API reference
│   ├── images/                 # Project images
│   └── tutorials/              # User guides
└── .devcontainer/              # Development container config
```

## 🧩 System Architecture

<div align="center">
  <img src="docs/images/system-architecture.PNG" alt="System Architecture" width="800"/>
</div>


### System Overview

<div align="center">
  <img src="docs/images/working-system-overview.PNG" alt="System Architecture" width="800"/>
</div>


### Data Flow

1. **Data Collection:**
   - Sensors gather health and environmental data
   - Edge processing for initial analysis

2. **Data Processing:**
   - TinyML models analyze patterns on-device
   - Critical events trigger immediate alerts

3. **Data Storage & Analysis:**
   - Cloud storage with HIPAA-compliant encryption
   - Advanced analytics for long-term trends

4. **User Interface:**
   - Real-time dashboard visualization
   - Mobile alerts and insights

## 📚 API Documentation

📖 **[View Complete API Documentation on Postman](https://documenter.getpostman.com/view/28591712/2sB2qak2v6)**

*This interactive documentation includes request/response examples, authentication details, and testing capabilities for all endpoints.*

Below is an overview of the core endpoints for the LifeGuard API.

### Main Service Endpoints 

These endpoints are served from the .NET-Server (hosted at `https://lifeguard-hiij.onrender.com`):

### Auth Endpoints

| **Method** | **Endpoint**                         | **Description**                                      |
|------------|--------------------------------------|------------------------------------------------------|
| GET        | `/`                                  | Health check or base endpoint                        |
| POST       | `/api/Account/login`                 | Authenticate a user using email and password         |
| POST       | `/api/Account/register`              | Register a new user account                          |
| POST       | `/api/Account/forgot-password`       | Initiate the password recovery process               |
| POST       | `/api/Account/ResendOTP`             | Resend OTP to the user                               |
| POST       | `/api/Account/VerifyOTP`             | Verify the OTP provided by the user                  |
| POST       | `/api/Account/ResetPassword`         | Reset the user's password using a token              |
| POST       | `/api/Account/CompleteProfile`       | Submit additional profile details                    |
| GET        | `/api/Account/{id}`                  | Retrieve basic account information by ID             |
| GET        | `/api/Account/GetProfile/{id}`       | Retrieve detailed user profile information   
| GET        | `/api/Account/google-login`       | Initiate Google OAuth authentication  
| GET        | `/api/Account/signin-google`       | Handle the Google OAuth callback
| DELETE     | `/api/Account/{id}`                  | Delete user profile information by ID             |

### Photo Endpoints

| **Method** | **Endpoint**         | **Description**                                         |
|------------|----------------------|---------------------------------------------------------|
| POST       | `/{id}/photo`        | Upload a photo for the user with the specified ID       |
| DELETE     | `/{id}/photo`        | Delete the user's photo identified by the given ID      |
| GET        | `/{id}/photo`        | Retrieve the photo for the user with the specified ID    |

### Node-Server Endpoints

These endpoints are served from the Node-Server (hosted at `https://lifeguard-node.onrender.com`):

### Memo Endpoints

| **Method** | **Endpoint**              | **Description**                        |
|------------|---------------------------|----------------------------------------|
| GET        | `/api/memos`              | Retrieve user memos                    |
| POST       | `/api/memos`              | Create a new memo                      |
| GET        | `/api/memos/undone/count` | Retrieve the count of undone memos     |

### Emergency Contact Endpoints

| **Method** | **Endpoint**                              | **Description**                                    |
|------------|-------------------------------------------|---------------------------------------------------|
| GET        | `/api/emergency-contacts`                 | Retrieve user's emergency contacts                 |
| POST       | `/api/emergency-contacts`                 | Add a new emergency contact                        |
| POST       | `/api/emergency-contacts/alert`           | Send emergency alert to contacts                   |
| GET        | `/api/emergency-contacts/test-alert/{id}` | Send test alert to specific contact                |
| GET        | `/api/emergency-contacts/verify`          | Verify emergency contact with token                |
| GET        | `/api/emergency-contacts/alerts`          | Get history of sent emergency alerts               |

### Health Metrics Endpoints

| **Method** | **Endpoint**                        | **Description**                              |
|------------|-------------------------------------|----------------------------------------------|
| GET        | `/api/health-metrics/latest`        | Get the latest health metrics for user       |
| POST       | `/api/health-metrics/save`          | Save new health metrics for user             |
| GET        | `/api/health-metrics/history`       | Get health metrics history (last 10 entries) |

### Exercise Endpoints

| **Method** | **Endpoint**              | **Description**                                   |
|------------|---------------------------|---------------------------------------------------|
| GET        | `/api/exercise/stats`     | Retrieve user's exercise statistics and streaks   |
| POST       | `/api/exercise/complete`  | Record a completed workout session                |
| POST       | `/api/exercise/goals`     | Set or update user's workout goals                |
| GET        | `/api/exercise/workout-history` | Retrieve user's workout history |
| GET        | `/api/exercise/calories-history` | Retrieve user's calories burned history |
| GET        | `/api/exercise/streak-history` | Retrieve user's exercise streak history |

### Medication Endpoints

| **Method** | **Endpoint**                        | **Description**                                   |
|------------|-------------------------------------|---------------------------------------------------|
| GET        | `/api/medications`                  | Get all medications for current user              |
| POST       | `/api/medications/add`              | Add a new medication                              |
| PUT        | `/api/medications/:id`              | Update medication by ID                           |
| DELETE     | `/api/medications/:id`              | Delete medication by ID                           |
| POST       | `/api/medications/track`            | Track medication dose (taken or skipped)          |
| GET        | `/api/medications/compliance`       | Get medication compliance rate                    |
| GET        | `/api/medications/emergency/:userId`| Retrieve minimal medication data in emergencies (public access) |

### Health Tips Endpoints

| **Method** | **Endpoint**                        | **Description**                                      |
|------------|-------------------------------------|------------------------------------------------------|
| GET        | `/api/health-tips`                  | Get health tips from MyHealthfinder API             |
| GET        | `/api/health-tips/topic/:id`        | Get detailed information for a specific health topic |

### Sound & Wellness Endpoints

| **Method** | **Endpoint**                                  | **Description**                                |
|------------|-----------------------------------------------|-------------------------------------------------|
| POST       | `/api/freesound/audio-proxy`                  | Proxy for streaming audio files from Freesound |
| GET        | `/api/favorite-sounds`                        | Get all favorite sounds                        |
| GET        | `/api/favorite-sounds/{userId}`               | Get user's favorite sounds                     |
| DELETE     | `/api/favorite-sounds/{userId}/{soundId}`     | Remove a sound from favorites                  |

### RAG System Routes

| **Method** | **Endpoint**                    | **Description**                                      |
|------------|---------------------------------|------------------------------------------------------|
| POST       | `/api/upload`                   | Upload a PDF file for RAG processing                 |
| POST       | `/api/ask`                      | Ask a question about the uploaded PDF documents      |

### User Notification Preferences Endpoints

| **Method** | **Endpoint**                           | **Description**                                 |
|------------|----------------------------------------|-------------------------------------------------|
| GET        | `/api/user-preferences/notifications`  | Get user notification preferences               |
| POST       | `/api/user-preferences/notifications`  | Update user notification preferences            |
| POST       | `/api/user-preferences/send-test-email`| Send a test notification email to the user      |

## 👥 Team

### Core Developers

<table>
  <tr>
    <td align="center"><a href="https://github.com/evansachie"><img src="https://github.com/evansachie.png" width="100px;" alt="Evans Acheampong"/><br /><sub><b>Evans Acheampong</b></sub></a><br />Full Stack & Hardware</td>
    <td align="center"><a href="https://github.com/mikkayadu"><img src="https://github.com/mikkayadu.png" width="100px;" alt="Michael Adu-Gyamfi"/><br /><sub><b>Michael Adu-Gyamfi</b></sub></a><br />Backend & ML</td>
  </tr>
</table>

### Academic Advisors

<table>
  <tr>
    <td align="center"><br /><sub><b>Dr. Percy Okae</b></sub><br />Project Supervisor</td>
    <td align="center"><br /><sub><b>Chiratidzo Matowe</b></sub><br />Advisor</td>
    <td align="center"><br /><sub><b>Marvin Rotermund</b></sub><br />Ambassador, Embedded Learning Challenge</td>
  </tr>
</table>

## 📷 Screenshots

### Appendix: Screenshots

<div align="center">
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 30px;">
    <div>
      <h4>Dashboard</h4>
      <img src="./docs/images/web-dashboard.png" alt="Admin Dashboard" width="600"/>
    </div>
  </div>
  
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Analytics Panel</h4>
      <img src="./docs/images/analytics.jpg" alt="Analytics Panel" width="600"/>
    </div>
    <div>
      <h4>Sticky Notes</h4>
      <img src="./docs/images/notes.PNG" alt="User Management" width="600"/>
    </div>
  </div>
  
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Health Report</h4>
      <img src="./docs/images/health-report.PNG" alt="Device Monitoring" width="600"/>
    </div>
    <div>
      <h4>Pollution Map</h4>
      <img src="./docs/images/pollution-tracker.PNG" alt="Pollution Map" width="600"/>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Health Tips</h4>
      <img src="./docs/images/health-tips.PNG" alt="Device Monitoring" width="600"/>
    </div>
    <div>
      <h4>Emergency Contacts</h4>
      <img src="./docs/images/emergency-contacts.PNG" alt="Pollution Map" width="600"/>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Help</h4>
      <img src="./docs/images/help.PNG" alt="Device Monitoring" width="600"/>
    </div>
    <div>
      <h4>Profile</h4>
      <img src="./docs/images/profile.PNG" alt="Pollution Map" width="600"/>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Exercise Routines</h4>
      <img src="./docs/images/exercise-routines.PNG" alt="Device Monitoring" width="600"/>
    </div>
    <div>
      <h4>Wellness Hub (Breathing)</h4>
      <img src="./docs/images/wellness-hub.PNG" alt="Pollution Map" width="600"/>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Wellness Hub (Meditation)</h4>
      <img src="./docs/images/meditation.PNG" alt="Device Monitoring" width="600"/>
    </div>
    <div>
      <h4>Wellness Hub (Zen Sounds)</h4>
      <img src="./docs/images/zen-sounds.PNG" alt="Pollution Map" width="600"/>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 20px;">
    <div>
      <h4>Health Metrics Calculator</h4>
      <img src="./docs/images/health-metrics.PNG" alt="Device Monitoring" width="600"/>
    </div>
  </div>
</div>


## 💬 Support & Contact

<table>
  <tr>
    <td>
      <strong>Frontend:</strong><br>
      <a href="https://lifeguard-vert.vercel.app">https://lifeguard-vert.vercel.app</a>
    </td>
    <td>
      <strong>Backend:</strong><br>
      <a href="https://lifeguard-hiij.onrender.com/api">https://lifeguard-hiij.onrender.com/api</a>
    </td>
  </tr>
  <tr>
    <td>
      <strong>Node Server:</strong><br>
      <a href="https://lifeguard-node.onrender.com">https://lifeguard-node.onrender.com</a>
    </td>
    <td>
      <strong>Email Support:</strong><br>
      <a href="mailto:evansachie01@gmail.com">evansachie01@gmail.com</a><br>
      <a href="mailto:michaeladugyamfi76@gmail.com">michaeladugyamfi76@gmail.com</a>
    </td>
  </tr>
</table>

*Happy coding!*
