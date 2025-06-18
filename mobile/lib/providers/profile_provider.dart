import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/profile_model.dart';
import '../services/profile_service.dart';

class ProfileProvider with ChangeNotifier {
  ProfileData? _profileData;
  List<EmergencyContact> _emergencyContacts = [];
  bool _isLoading = false;
  bool _isUpdating = false;
  bool _contactsLoading = false;
  String? _error;

  ProfileData? get profileData => _profileData;
  List<EmergencyContact> get emergencyContacts => _emergencyContacts;
  bool get isLoading => _isLoading;
  bool get isUpdating => _isUpdating;
  bool get contactsLoading => _contactsLoading;
  String? get error => _error;

  Future<void> loadProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _profileData = await ProfileService.fetchUserProfile();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadEmergencyContacts() async {
    _contactsLoading = true;
    notifyListeners();

    try {
      _emergencyContacts = await ProfileService.fetchEmergencyContacts();
    } finally {
      _contactsLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateProfile(ProfileData updatedData) async {
    _isUpdating = true;
    _error = null;
    notifyListeners();

    try {
      await ProfileService.updateProfile(updatedData);
      _profileData = updatedData;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<bool> uploadPhoto(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(
        source: source,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        _isUpdating = true;
        notifyListeners();

        final imageFile = File(pickedFile.path);
        final photoUrl = await ProfileService.uploadProfilePhoto(imageFile);

        if (photoUrl != null && _profileData != null) {
          _profileData = _profileData!.copyWith(profileImage: photoUrl);
          notifyListeners();
        }

        _isUpdating = false;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = e.toString();
      _isUpdating = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deletePhoto() async {
    _isUpdating = true;
    notifyListeners();

    try {
      await ProfileService.deleteProfilePhoto();
      if (_profileData != null) {
        _profileData = _profileData!.copyWith(profileImage: null);
      }
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  Future<bool> deleteAccount() async {
    _isUpdating = true;
    _error = null;
    notifyListeners();

    try {
      await ProfileService.deleteAccount();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isUpdating = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void updateProfileData(ProfileData newData) {
    _profileData = newData;
    notifyListeners();
  }
}
