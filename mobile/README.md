# LifeGuard Mobile App

<p align="center">
  <img src="../docs/images/lifeguard-logo.png" alt="LifeGuard Logo" width="200"/>
</p>

A Flutter-based mobile application for the LifeGuard health and environmental monitoring system with **Bluetooth Low Energy (BLE) integration** for real-time wearable device connectivity.

## Features

- **🔗 Real-time BLE device connectivity**
  - Automatic device discovery and pairing
  - Real-time sensor data streaming
  - Fall detection with emergency alerts
  - Environmental monitoring (temperature, humidity, air quality)
- **📊 Real-time health monitoring**
  - Activity recognition (walking, still, falling, unknown)
  - Environmental data tracking
  - Historical data visualization  
- **⚠️ Emergency alerts and notifications**
  - Automatic fall detection via ML inference
  - Emergency contact notifications with location
  - Customizable alert thresholds
- **📱 Health analytics dashboard**
  - Real-time sensor data visualization
  - Activity pattern analysis
  - Environmental exposure tracking
- **👥 Emergency contact management**
  - Quick emergency alert system
  - Location sharing capabilities
- **🎨 Modern UI/UX**
  - Dark/Light theme support
  - Material 3 design
  - Responsive layouts
- **📍 Location tracking**
  - GPS integration for emergency services
- **📱 Cross-platform (iOS & Android)**
  - Native performance with Flutter

## New BLE Features

### 🔵 Bluetooth Low Energy Integration
- **Device Discovery**: Automatic scanning for LifeGuard wearable devices
- **Real-time Data Streaming**: Live sensor data from Arduino Nicla Sense ME
- **Fall Detection**: ML-powered fall detection with 99.5% accuracy
- **Environmental Monitoring**: Air quality, temperature, and humidity tracking
- **Device Control**: RGB LED control for visual feedback
- **Auto-reconnect**: Automatic device reconnection when in range

### 📊 Supported Sensor Data
- **Motion Sensors**: Accelerometer, Gyroscope, Quaternion data
- **Environmental**: Temperature, Humidity, Barometric Pressure
- **Air Quality**: VOCs, CO2 levels, Gas sensors
- **Activity Recognition**: Walking, Still, Falling, Unknown states
- **Health Metrics**: Real-time vitals and activity patterns

## Getting Started

### Prerequisites

- Flutter SDK (latest stable version)
- Android Studio / XCode
- VS Code (recommended)
- A physical device or emulator
- **Arduino Nicla Sense ME device (for BLE features)**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AWESOME04/LifeGuard.git
cd LifeGuard/mobile
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## Project Structure

```
mobile/
├── lib/
│   ├── main.dart              # App entry point
│   ├── screens/               # UI screens
│   │   ├── wellness_hub/      # Wellness hub screen
│   │   ├── exercise_routines/ # Exercise routines
│   │   └── ...               # Other screens
│   ├── data/                  # Data models and providers
│   ├── providers/            # State management
│   ├── services/            # API services
│   ├── utils/              # Utility functions
│   └── widgets/            # Reusable widgets
├── assets/                 # Images, fonts, etc.
└── test/                  # Unit and widget tests
```

## Dependencies

Key packages used in this project:

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.0          # State management
  http: ^1.1.0             # API calls
  shared_preferences: ^2.0.0 # Local storage
  youtube_player_flutter: ^8.1.2 # Video player
  just_audio_background: ^0.0.1-beta.7 # Audio handling
```

## Configuration

The app uses environment variables for configuration. Create a `.env` file in the root directory:

## Key Features Implementation

### Health Monitoring
- Real-time data synchronization with wearable device
- Historical data visualization
- Activity tracking and recognition

### Environmental Tracking
- Temperature monitoring
- Air quality analysis
- Humidity tracking
- Atmospheric pressure monitoring

### Emergency System
- Fall detection alerts
- Emergency contact notification
- Location sharing
- Quick dial emergency numbers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Support

For support, please email:
- Evans Acheampong: evansachie01@gmail.com
- Michael Adu-Gyamfi: michaeladugyamfi76@gmail.com
