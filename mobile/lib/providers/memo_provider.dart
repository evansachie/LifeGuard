import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/memo_service.dart';

class MemoProvider extends ChangeNotifier {
  final MemoService _memoService = MemoService();
  List<Map<String, dynamic>> _memos = [];
  bool _isLoading = false;
  String _filter = 'all';
  String _sortBy = 'newest';
  String _searchQuery = '';

  List<Map<String, dynamic>> get memos => _getFilteredAndSortedMemos();
  bool get isLoading => _isLoading;
  String get filter => _filter;
  String get sortBy => _sortBy;

  Future<void> fetchMemos() async {
    try {
      _isLoading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      _memos = await _memoService.getMemos(token);
      notifyListeners();
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addMemo(String memo) async {
    if (memo.trim().isEmpty) {
      throw Exception('Memo content is required');
    }

    try {
      _isLoading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      final newMemo = await _memoService.createMemo(token, memo.trim());

      // Ensure the memo is properly formatted before adding to list
      final formattedMemo = {
        '_id': newMemo['_id']?.toString() ?? '',
        'Text': newMemo['Text']?.toString() ?? memo.trim(),
        'Done': newMemo['Done'] ?? false,
        'CreatedAt': newMemo['CreatedAt']?.toString() ??
            DateTime.now().toIso8601String(),
      };

      _memos.insert(0, formattedMemo);
      notifyListeners();
    } catch (e) {
      print('Add memo error: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteMemo(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      await _memoService.deleteMemo(token, id);
      _memos.removeWhere((memo) =>
          memo['Id']?.toString() == id || memo['_id']?.toString() == id);
      notifyListeners();
    } catch (e) {
      print('Delete memo error: $e');
      rethrow;
    }
  }

  Future<void> updateMemo(String id, String text) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      final success = await _memoService.updateMemo(token, id, text);
      if (success) {
        final index = _memos.indexWhere((memo) => memo['_id'] == id);
        if (index != -1) {
          _memos[index] = {
            ..._memos[index],
            'Text': text,
          };
          notifyListeners();
        }
      }
    } catch (e) {
      print('Update memo error: $e');
      rethrow;
    }
  }

  Future<void> toggleMemo(String id, bool isDone) async {
    try {
      // Update local state immediately for better UX
      final index = _memos.indexWhere((memo) => memo['_id'] == id);
      if (index != -1) {
        _memos[index] = {..._memos[index], 'Done': isDone};
        notifyListeners();
      }

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) throw Exception('No authentication token');

      // Call API in background
      final success = await _memoService.toggleMemo(token, id, isDone);

      // Revert on failure
      if (!success && index != -1) {
        _memos[index] = {..._memos[index], 'Done': !isDone};
        notifyListeners();
      }
    } catch (e) {
      // Revert on error
      final index = _memos.indexWhere((memo) => memo['_id'] == id);
      if (index != -1) {
        _memos[index] = {..._memos[index], 'Done': !isDone};
        notifyListeners();
      }
      rethrow;
    }
  }

  void setFilter(String filter) {
    _filter = filter;
    notifyListeners();
  }

  void setSortBy(String sortBy) {
    _sortBy = sortBy;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  List<Map<String, dynamic>> _getFilteredAndSortedMemos() {
    var filteredMemos = [..._memos];

    // Apply filter
    if (_filter != 'all') {
      filteredMemos = filteredMemos.where((memo) {
        return _filter == 'completed' ? memo['Done'] : !memo['Done'];
      }).toList();
    }

    // Apply search
    if (_searchQuery.isNotEmpty) {
      filteredMemos = filteredMemos.where((memo) {
        final text = memo['Text']?.toString() ?? '';
        return text.toLowerCase().contains(_searchQuery.toLowerCase());
      }).toList();
    }

    // Apply sorting with null safety
    switch (_sortBy) {
      case 'oldest':
        filteredMemos.sort((a, b) {
          final aDate = a['CreatedAt']?.toString() ?? '';
          final bDate = b['CreatedAt']?.toString() ?? '';
          return aDate.compareTo(bDate);
        });
        break;
      case 'alphabetical':
        filteredMemos.sort((a, b) {
          final aText = a['Text']?.toString() ?? '';
          final bText = b['Text']?.toString() ?? '';
          return aText.compareTo(bText);
        });
        break;
      case 'newest':
      default:
        filteredMemos.sort((a, b) {
          final aDate = a['CreatedAt']?.toString() ?? '';
          final bDate = b['CreatedAt']?.toString() ?? '';
          return bDate.compareTo(aDate);
        });
    }

    return filteredMemos;
  }
}
