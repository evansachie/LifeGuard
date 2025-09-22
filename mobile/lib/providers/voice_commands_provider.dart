import 'package:flutter/foundation.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/emergency_contact_service.dart';

class VoiceCommand {
  final String id;
  final List<String> keywords;
  final String description;
  final String category;
  final VoidCallback action;

  VoiceCommand({
    required this.id,
    required this.keywords,
    required this.description,
    required this.category,
    required this.action,
  });
}

class VoiceCommandsProvider extends ChangeNotifier {
  final SpeechToText _speechToText = SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  final EmergencyContactService _emergencyService = EmergencyContactService();

  bool _isListening = false;
  bool _isSupported = false;
  bool _isInitialized = false;
  String _lastCommand = '';
  String _lastError = '';
  List<VoiceCommand> _commands = [];
  Timer? _errorTimer;
  
  // Navigation callback - will be set from the UI
  Function(String)? _navigationCallback;

  bool get isListening => _isListening;
  bool get isSupported => _isSupported;
  bool get isInitialized => _isInitialized;
  String get lastCommand => _lastCommand;
  String get lastError => _lastError;
  List<VoiceCommand> get commands => _commands;

  void _setError(String error) {
    _lastError = error;
    notifyListeners();
    
    // Clear error after 3 seconds
    _errorTimer?.cancel();
    _errorTimer = Timer(const Duration(seconds: 3), () {
      _lastError = '';
      notifyListeners();
    });
  }

  void clearError() {
    _errorTimer?.cancel();
    _lastError = '';
    notifyListeners();
  }

  void setNavigationCallback(Function(String) callback) {
    _navigationCallback = callback;
  }

  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // Initialize speech to text
      _isSupported = await _speechToText.initialize(
        onError: (error) {
          _setError('Speech recognition error: ${error.errorMsg}');
          _isListening = false;
        },
        onStatus: (status) {
          if (status == 'done' || status == 'notListening') {
            _isListening = false;
            notifyListeners();
          }
        },
      );

      // Initialize text to speech
      await _flutterTts.setLanguage('en-US');
      await _flutterTts.setSpeechRate(0.5);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(1.0);

      // Request microphone permission
      await Permission.microphone.request();

      // Initialize default commands
      _initializeDefaultCommands();

      _isInitialized = true;
      notifyListeners();
    } catch (e) {
      _setError('Failed to initialize voice commands: $e');
    }
  }

  void _initializeDefaultCommands() {
    _commands = [
      VoiceCommand(
        id: 'emergency',
        keywords: ['emergency', 'help', 'urgent', 'alert', 'sos'],
        description: 'Trigger emergency alert',
        category: 'emergency',
        action: _handleEmergencyCommand,
      ),
      VoiceCommand(
        id: 'health_status',
        keywords: ['health status', 'vitals', 'health data', 'show health'],
        description: 'Show health status',
        category: 'health',
        action: _handleHealthStatusCommand,
      ),
      VoiceCommand(
        id: 'location',
        keywords: ['location', 'where am i', 'my location', 'current location'],
        description: 'Get current location',
        category: 'general',
        action: _handleLocationCommand,
      ),
      VoiceCommand(
        id: 'connect_device',
        keywords: ['connect device', 'connect bluetooth', 'pair device'],
        description: 'Connect BLE device',
        category: 'device',
        action: _handleConnectDeviceCommand,
      ),
      VoiceCommand(
        id: 'disconnect_device',
        keywords: ['disconnect device', 'disconnect bluetooth'],
        description: 'Disconnect BLE device',
        category: 'device',
        action: _handleDisconnectDeviceCommand,
      ),
      VoiceCommand(
        id: 'medications',
        keywords: ['medications', 'pills', 'medicine', 'show medications'],
        description: 'Go to medications',
        category: 'navigation',
        action: _handleMedicationsCommand,
      ),
      VoiceCommand(
        id: 'emergency_contacts',
        keywords: ['emergency contacts', 'contacts', 'emergency list'],
        description: 'Go to emergency contacts',
        category: 'navigation',
        action: _handleEmergencyContactsCommand,
      ),
      VoiceCommand(
        id: 'wellness_hub',
        keywords: ['wellness hub', 'wellness', 'meditation', 'relaxation'],
        description: 'Go to wellness hub',
        category: 'navigation',
        action: _handleWellnessHubCommand,
      ),
    ];
  }

  Future<void> startListening() async {
    if (!_isSupported || _isListening) return;

    try {
      await _speechToText.listen(
        onResult: (result) {
          _lastCommand = result.recognizedWords.toLowerCase();
          if (result.finalResult) {
            _processVoiceCommand(_lastCommand);
          }
          notifyListeners();
        },
        listenFor: const Duration(seconds: 30),
        pauseFor: const Duration(seconds: 3),
        partialResults: true,
        localeId: 'en_US',
        onSoundLevelChange: (level) {
          // Could be used for visual feedback
        },
      );
      _isListening = true;
      notifyListeners();
    } catch (e) {
      _setError('Failed to start listening: $e');
    }
  }

  Future<void> stopListening() async {
    if (!_isListening) return;

    await _speechToText.stop();
    _isListening = false;
    notifyListeners();
  }

  void _processVoiceCommand(String transcript) async {
    // First try local command matching for immediate actions
    for (final command in _commands) {
      for (final keyword in command.keywords) {
        if (transcript.contains(keyword.toLowerCase())) {
          _speakResponse('Executing ${command.description}');
          command.action();
          return;
        }
      }
    }

    // If no local match, send to backend for NLP processing
    try {
      final result = await _processCommandWithBackend(transcript);
      if (result['success'] == true) {
        _speakResponse('Command processed: ${result['intent']}');
        await _executeBackendActions(result['actions']);
      } else {
        _handleLocalFallback(transcript);
      }
    } catch (e) {
      debugPrint('Error processing command with backend: $e');
      _handleLocalFallback(transcript);
    }
  }

  Future<Map<String, dynamic>> _processCommandWithBackend(
      String command) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      final response = await http.post(
        Uri.parse(
            '${EmergencyContactService.baseUrl}/api/voice-commands/process'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'command': command,
          'context': {
            'platform': 'mobile',
            'timestamp': DateTime.now().toIso8601String(),
          }
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to process command: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Backend processing failed: $e');
    }
  }

  Future<void> _executeBackendActions(List<dynamic> actions) async {
    for (final action in actions) {
      try {
        switch (action['type']) {
          case 'send_alert':
            _handleEmergencyCommand();
            break;
          case 'get_sensor_data':
            // Trigger BLE data refresh
            debugPrint('Requesting sensor data from BLE device');
            break;
          case 'connect_device':
            _handleConnectDeviceCommand();
            break;
          case 'disconnect_device':
            _handleDisconnectDeviceCommand();
            break;
          case 'navigate_to':
            // This would need to be implemented with navigation
            debugPrint('Navigate to: ${action['target']}');
            break;
          default:
            debugPrint('Unknown action type: ${action['type']}');
        }
      } catch (e) {
        debugPrint('Error executing action: $e');
      }
    }
  }

  void _handleLocalFallback(String transcript) {
    if (transcript.contains('emergency') ||
        transcript.contains('help') ||
        transcript.contains('urgent')) {
      _handleEmergencyCommand();
    } else {
      _speakResponse(
          'Command not recognized. Say help for available commands.');
    }
  }

  Future<void> _speakResponse(String text) async {
    try {
      await _flutterTts.speak(text);
    } catch (e) {
      debugPrint('Error speaking: $e');
    }
  }

  // Command handlers
  void _handleEmergencyCommand() {
    _speakResponse('Triggering emergency alert');
    // This would trigger the emergency alert system
    // Implementation depends on your emergency contact system
  }

  void _handleHealthStatusCommand() {
    _speakResponse('Showing health status');
    _navigationCallback?.call('/health_report');
  }

  void _handleLocationCommand() async {
    try {
      _speakResponse('Getting your location');
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      final location =
          'Your location is ${position.latitude.toStringAsFixed(6)}, ${position.longitude.toStringAsFixed(6)}';
      _speakResponse(location);
    } catch (e) {
      _speakResponse('Unable to get location');
    }
  }

  void _handleConnectDeviceCommand() {
    _speakResponse('Opening device connection');
    // This would need to be implemented with actual BLE connection logic
  }

  void _handleDisconnectDeviceCommand() {
    _speakResponse('Disconnecting device');
    // This would need to be implemented with actual BLE disconnection logic
  }

  void _handleMedicationsCommand() {
    _speakResponse('Opening medications');
    _navigationCallback?.call('/medications');
  }

  void _handleEmergencyContactsCommand() {
    _speakResponse('Opening emergency contacts');
    _navigationCallback?.call('/emergency_contacts');
  }

  void _handleWellnessHubCommand() {
    _speakResponse('Opening wellness hub');
    _navigationCallback?.call('/wellness_hub');
  }

  void addCommand(VoiceCommand command) {
    _commands.add(command);
    notifyListeners();
  }

  void removeCommand(String commandId) {
    _commands.removeWhere((command) => command.id == commandId);
    notifyListeners();
  }

  List<VoiceCommand> getCommandsByCategory(String category) {
    return _commands.where((command) => command.category == category).toList();
  }

  @override
  void dispose() {
    _speechToText.cancel();
    _flutterTts.stop();
    _errorTimer?.cancel();
    super.dispose();
  }
}
