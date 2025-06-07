class ApiConfig {
  static const String baseUrl = 'https://lifeguard-hiij.onrender.com';
  static const String nodeBaseUrl = 'https://lifeguard-node.onrender.com';
  static const String apiVersion = '/api';
  
  // Development URLs (uncomment for local development)
  // static const String baseUrl = 'http://localhost:5000';
  // static const String nodeBaseUrl = 'http://localhost:5001';
  
  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
