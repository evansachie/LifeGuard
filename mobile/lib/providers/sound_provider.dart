import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/freesound_service.dart';

class SoundProvider extends ChangeNotifier {
  final FreesoundService _service = FreesoundService();
  final List<Map<String, dynamic>> _sounds = [];
  bool _isLoading = false;
  String _category = 'all';
  String _searchQuery = '';
  int _currentPage = 1;
  bool _hasMore = true;

  List<Map<String, dynamic>> get sounds => _sounds;
  bool get isLoading => _isLoading;
  String get category => _category;
  bool get hasMore => _hasMore;

  Future<void> searchSounds({bool refresh = false}) async {
    if (_isLoading) return;

    try {
      _isLoading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      if (refresh) {
        _currentPage = 1;
        _sounds.clear(); // Use clear() instead of reassignment
        notifyListeners();
      }

      final results = await _service.searchSounds(
        token,
        query: _searchQuery,
        category: _category,
        page: _currentPage,
      );

      if (results.isEmpty) {
        _hasMore = false;
      } else {
        _sounds.addAll(results);
        _currentPage++;
      }

    } catch (e) {
      _hasMore = false;
      print('Error searching sounds: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setCategory(String category) {
    if (_category == category) return;
    _category = category;
    _sounds.clear();
    _currentPage = 1;
    _hasMore = true;
    searchSounds(refresh: true);
  }

  void setSearchQuery(String query) {
    if (_searchQuery == query) return;
    _searchQuery = query;
    _sounds.clear();
    _currentPage = 1;
    _hasMore = true;
    searchSounds(refresh: true);
  }

  Future<String> getAudioUrl(String soundId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception('No authentication token');
    return _service.getAudioUrl(token, soundId);
  }
}
