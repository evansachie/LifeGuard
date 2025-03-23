import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/emergency_contact_service.dart';

class EmergencyContactProvider extends ChangeNotifier {
  final EmergencyContactService _service = EmergencyContactService();
  List<Map<String, dynamic>> _contacts = [];
  bool _isLoading = false;

  List<Map<String, dynamic>> get contacts => _contacts;
  bool get isLoading => _isLoading;

  Future<void> fetchContacts() async {
    try {
      _isLoading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      _contacts = await _service.getContacts(token);
      notifyListeners();
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> sendEmergencyAlert() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      await _service.sendEmergencyAlert(token);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> createContact(Map<String, dynamic> contact) async {
    try {
      _isLoading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      final newContact = await _service.createContact(token, contact);
      _contacts.add(newContact);
      notifyListeners();
    } catch (e) {
      print('Error creating contact: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
