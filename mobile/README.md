# LifeGuard Mobile App

<p align="center">
  <img src="../docs/images/lifeguard-logo.png" alt="LifeGuard Logo" width="200"/>
</p>

A Flutter-based mobile application for the LifeGuard health and environmental monitoring system.

## Features

- Real-time health monitoring
- Environmental data tracking
- Emergency alerts and notifications
- Health analytics dashboard
- Emergency contact management
- Dark/Light theme support
- Location tracking
- Cross-platform (iOS & Android)

## Getting Started

### Prerequisites

- Flutter SDK (latest stable version)
- Android Studio / XCode
- VS Code (recommended)
- A physical device or emulator

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
