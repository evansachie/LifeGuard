import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/medication.dart';
import '../services/storage_service.dart';
import '../config/constants.dart';
import 'auth_provider.dart';

class MedicationProvider with ChangeNotifier {
  List<Medication> _medications = [];
  bool _isLoading = false;
  String? _error;
  double _complianceRate = 0.0;
  final Map<String, dynamic> _stats = {};
  AuthProvider? _authProvider;

  List<Medication> get medications => _medications;
  bool get isLoading => _isLoading;
  String? get error => _error;
  double get complianceRate => _complianceRate;
  Map<String, dynamic> get stats => _stats;

  // Set auth provider dependency
  void setAuthProvider(AuthProvider authProvider) {
    _authProvider = authProvider;
  }

  void _calculateComplianceFromMedications() {
    if (_medications.isEmpty) {
      _complianceRate = 0.0;
      return;
    }

    double totalTaken = 0;
    double totalDoses = 0;

    for (final medication in _medications) {
      final dosesTaken = double.tryParse(medication.dosesTaken?.toString() ?? '0') ?? 0;
      final totalMedDoses = double.tryParse(medication.totalDoses?.toString() ?? '0') ?? 0;
      
      totalTaken += dosesTaken;
      totalDoses += totalMedDoses;
      
    }

    if (totalDoses > 0) {
      _complianceRate = totalTaken / totalDoses;
    } else {
      _complianceRate = 0.0;
    }

  }

  Future<void> loadMedications() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // First try to get auth data from AuthProvider
      String? token = _authProvider?.currentToken;
      String? userId = _authProvider?.currentUserId;
      
      // Fallback to storage service
      if (token == null || userId == null) {
        token = await StorageService.getToken();
        userId = await StorageService.getUserId();
      }
      
      if (token == null || userId == null) {
        throw Exception('Authentication required. Please log in again.');
      }

      final response = await http.get(
        Uri.parse('${Constants.nodeApiUrl}/api/medications?userId=$userId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw Exception('Request timed out. Please try again.');
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Handle different response formats
        List<dynamic> medicationsJson = [];
        
        if (data is List) {
          // Direct array response
          medicationsJson = data;
        } else if (data is Map<String, dynamic>) {
          // Check for various possible response structures
          if (data.containsKey('medications') && data['medications'] is List) {
            medicationsJson = data['medications'];
          } else if (data.containsKey('data') && data['data'] is List) {
            medicationsJson = data['data'];
          } else if (data.containsKey('success') && data['success'] == true) {
            // Check if medications are directly in the response
            medicationsJson = data['medications'] ?? [];
          } else {
            // If the response is a map but doesn't contain medications array,
            // treat it as empty result
            medicationsJson = [];
          }
        }
        
        _medications = medicationsJson
            .map((json) => Medication.fromJson(json))
            .toList();
        
        _calculateComplianceFromMedications();
        
      } else if (response.statusCode == 401) {
        // Clear invalid auth data
        await StorageService.clearAuthData();
        throw Exception('Session expired. Please log in again.');
      } else if (response.statusCode == 404) {
        // No medications found - this is valid, just empty list
        _medications = [];
        _complianceRate = 0.0;
      } else {
        throw Exception('Failed to load medications: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      _error = e.toString();

      if (e.toString().contains('Authentication required') || 
          e.toString().contains('Session expired')) {
        Future.delayed(const Duration(seconds: 3), () {
          _error = null;
          notifyListeners();
        });
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addMedication(Medication medication) async {
    try {
      String? token = _authProvider?.currentToken ?? await StorageService.getToken();
      String? userId = _authProvider?.currentUserId ?? await StorageService.getUserId();
      
      if (token == null || userId == null) {
        throw Exception('Authentication required. Please log in again.');
      }

      final requestBody = {
        'userId': userId,
        'name': medication.name,
        'dosage': medication.dosage,
        'frequency': medication.frequency,
        'times': medication.times,
        'startDate': medication.startDate,
        'endDate': medication.endDate,
        'notes': medication.notes,
        'active': medication.active,
      };

      final response = await http.post(
        Uri.parse('${Constants.nodeApiUrl}/api/medications'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode(requestBody),
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200 || response.statusCode == 201) {
        await loadMedications(); // Refresh list
        return true;
      } else if (response.statusCode == 401) {
        await StorageService.clearAuthData();
        throw Exception('Session expired. Please log in again.');
      } else {
        throw Exception('Failed to add medication: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateMedication(Medication medication) async {
    try {
      String? token = _authProvider?.currentToken ?? await StorageService.getToken();
      String? userId = _authProvider?.currentUserId ?? await StorageService.getUserId();
      
      if (token == null || userId == null) {
        throw Exception('Authentication required. Please log in again.');
      }

      // Match the web implementation request structure for updates
      final requestBody = {
        'Id': medication.id,
        'userId': userId,
        'name': medication.name,
        'dosage': medication.dosage,
        'frequency': medication.frequency,
        'times': medication.times,
        'startDate': medication.startDate,
        'endDate': medication.endDate,
        'notes': medication.notes,
        'active': medication.active,
      };

      final response = await http.put(
        Uri.parse('${Constants.nodeApiUrl}/api/medications/${medication.id}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode(requestBody),
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        await loadMedications();
        return true;
      } else if (response.statusCode == 401) {
        await StorageService.clearAuthData();
        throw Exception('Session expired. Please log in again.');
      } else {
        throw Exception('Failed to update medication: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteMedication(String medicationId) async {
    try {
      String? token = _authProvider?.currentToken ?? await StorageService.getToken();
      
      if (token == null) {
        throw Exception('Authentication required. Please log in again.');
      }

      final response = await http.delete(
        Uri.parse('${Constants.nodeApiUrl}/api/medications/$medicationId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        await loadMedications();
        return true;
      } else if (response.statusCode == 401) {
        await StorageService.clearAuthData();
        throw Exception('Session expired. Please log in again.');
      } else {
        throw Exception('Failed to delete medication: ${response.statusCode}');
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> trackDose(String medicationId, bool taken) async {
    try {
      final authProvider = _authProvider;
      if (authProvider == null || !authProvider.isAuthenticated) {
        throw Exception('User not authenticated');
      }

      final token = authProvider.currentToken;
      if (token == null) {
        throw Exception('No authentication token available');
      }

      // Match the web implementation's data structure
      final requestBody = {
        'medicationId': medicationId,
        'taken': taken,
        'scheduledTime': DateTime.now().toIso8601String().split('T')[1].split('.')[0], // Format: HH:MM:SS
      };

      final response = await http.post(
        Uri.parse('${Constants.nodeApiUrl}/api/medications/track'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        // Reload medications to get updated data with new dose counts
        await loadMedications();
        notifyListeners();
        return true;
      } else {
        throw Exception('Failed to track dose: ${response.statusCode}');
      }
    } catch (e) {
      _error = 'Failed to track dose: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  Future<void> loadCompliance() async {
    // This method is now redundant since we calculate compliance from medication data
    // But keep it for backward compatibility
    try {
      String? token = _authProvider?.currentToken ?? await StorageService.getToken();
      String? userId = _authProvider?.currentUserId ?? await StorageService.getUserId();
      
      if (token == null || userId == null) return;

      final response = await http.get(
        Uri.parse('${Constants.nodeApiUrl}/api/medications/compliance?userId=$userId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final serverComplianceRate = (data['complianceRate'] ?? 0.0).toDouble();
        
        // Use server compliance rate if available, otherwise use calculated one
        if (serverComplianceRate > 0) {
          _complianceRate = serverComplianceRate;
          notifyListeners();
        }
      }
    } catch (e) {
      // Don't update _complianceRate on error, keep the calculated one
    }
  }

  bool get isAuthenticated => 
      (_authProvider?.isAuthenticated ?? false) || 
      // ignore: unnecessary_null_comparison
      (StorageService.getUserId() != null);

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Map<String, dynamic> get mockStats => {
    'activeMedications': 0,
    'todaysDoses': 0,
    'complianceRate': 0.0,
  };
}
