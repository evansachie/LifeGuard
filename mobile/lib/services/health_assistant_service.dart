import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class HealthAssistantService {
  static const String _ragBaseUrl = 'https://lifeguard-rag.onrender.com';

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> _getHeaders(
      {bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await _getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  static Future<String> askQuestion(String question) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');
      
      if (userId == null) {
        return 'Please login to use the health assistant.';
      }

      final headers = await _getHeaders(includeAuth: false);

      final response = await http.post(
        Uri.parse('$_ragBaseUrl/api/ask'),
        headers: headers,
        body: json.encode({
          'user_id': userId,
          'question': question,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['answer'] ??
            'Sorry, I could not process your question.';
      } else if (response.statusCode == 404) {
        return 'No relevant document chunks found. Please upload a PDF document first to get personalized health insights.';
      } else {
        print('Error response: ${response.statusCode} - ${response.body}');
        return 'Sorry, I encountered an error while processing your question.';
      }
    } catch (e) {
      print('Error in askQuestion: $e');
      return 'Sorry, I could not connect to the health assistant service.';
    }
  }

  static Future<bool> uploadDocument(
      List<int> pdfBytes, String fileName) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');
      
      if (userId == null) return false;

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$_ragBaseUrl/api/upload'),
      );

      // Add the user_id as a field in the form data
      request.fields['user_id'] = userId;
      
      // Add the PDF file
      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          pdfBytes,
          filename: fileName,
        ),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        print('Upload successful: ${response.body}');
        return true;
      } else {
        print('Upload failed: ${response.statusCode} - ${response.body}');
        return false;
      }
    } catch (e) {
      print('Error in uploadDocument: $e');
      return false;
    }
  }

  static List<String> getExampleQuestions() {
    return [
      'What are the symptoms of high blood pressure?',
      'How can I improve my sleep quality?',
      'What exercises are good for heart health?',
      'How often should I check my blood pressure?',
      'What foods should I avoid with diabetes?',
      'How can I reduce stress naturally?',
      'What are the warning signs of a heart attack?',
      'How much water should I drink daily?',
    ];
  }
}
