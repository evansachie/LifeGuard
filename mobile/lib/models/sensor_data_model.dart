class SensorDataModel {
  final DateTime timestamp;
  final double? temperature;
  final double? humidity;
  final double? pressure;
  final List<double>? accelerometer; // [x, y, z]
  final List<double>? gyroscope; // [x, y, z]
  final List<double>? quaternion; // [x, y, z, w]
  final double? airQuality;
  final int? co2Level;
  final int? gasLevel;
  final String? activityInference;
  
  SensorDataModel({
    required this.timestamp,
    this.temperature,
    this.humidity,
    this.pressure,
    this.accelerometer,
    this.gyroscope,
    this.quaternion,
    this.airQuality,
    this.co2Level,
    this.gasLevel,
    this.activityInference,
  });
  
  bool get hasEnvironmentalData => 
      temperature != null || humidity != null || pressure != null || airQuality != null;
  
  bool get hasMotionData => 
      accelerometer != null || gyroscope != null || quaternion != null;
  
  bool get hasAirQualityData => 
      airQuality != null || co2Level != null || gasLevel != null;
  
  bool get isFallDetected => 
      activityInference?.toLowerCase().contains('falling') == true;
  
  Map<String, dynamic> toJson() {
    return {
      'timestamp': timestamp.toIso8601String(),
      'temperature': temperature,
      'humidity': humidity,
      'pressure': pressure,
      'accelerometer': accelerometer,
      'gyroscope': gyroscope,
      'quaternion': quaternion,
      'airQuality': airQuality,
      'co2Level': co2Level,
      'gasLevel': gasLevel,
      'activityInference': activityInference,
    };
  }
  
  factory SensorDataModel.fromJson(Map<String, dynamic> json) {
    return SensorDataModel(
      timestamp: DateTime.parse(json['timestamp']),
      temperature: json['temperature']?.toDouble(),
      humidity: json['humidity']?.toDouble(),
      pressure: json['pressure']?.toDouble(),
      accelerometer: json['accelerometer'] != null 
          ? List<double>.from(json['accelerometer']) : null,
      gyroscope: json['gyroscope'] != null 
          ? List<double>.from(json['gyroscope']) : null,
      quaternion: json['quaternion'] != null 
          ? List<double>.from(json['quaternion']) : null,
      airQuality: json['airQuality']?.toDouble(),
      co2Level: json['co2Level']?.toInt(),
      gasLevel: json['gasLevel']?.toInt(),
      activityInference: json['activityInference'],
    );
  }
  
  SensorDataModel copyWith({
    DateTime? timestamp,
    double? temperature,
    double? humidity,
    double? pressure,
    List<double>? accelerometer,
    List<double>? gyroscope,
    List<double>? quaternion,
    double? airQuality,
    int? co2Level,
    int? gasLevel,
    String? activityInference,
  }) {
    return SensorDataModel(
      timestamp: timestamp ?? this.timestamp,
      temperature: temperature ?? this.temperature,
      humidity: humidity ?? this.humidity,
      pressure: pressure ?? this.pressure,
      accelerometer: accelerometer ?? this.accelerometer,
      gyroscope: gyroscope ?? this.gyroscope,
      quaternion: quaternion ?? this.quaternion,
      airQuality: airQuality ?? this.airQuality,
      co2Level: co2Level ?? this.co2Level,
      gasLevel: gasLevel ?? this.gasLevel,
      activityInference: activityInference ?? this.activityInference,
    );
  }
}
