import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Quote {
  final String text;
  final String author;

  Quote({required this.text, required this.author});
}

class QuoteProvider with ChangeNotifier {
  Quote? _quote;
  bool _isLoading = true;
  String? _error;

  Quote? get quote => _quote;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchQuote() async {
    try {
      final response = await http.get(
        Uri.parse(
            'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random'),
      );

      if (response.statusCode == 200) {
        final List data = json.decode(response.body);
        final quoteData = data[0];
        _quote = Quote(
          text: quoteData['q'],
          author: quoteData['a'],
        );
        _error = null;
      } else {
        _error = 'Failed to load quote';
      }
    } catch (e) {
      _error = 'Failed to load quote';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
