import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  String _searchQuery = '';
  final List<FAQItem> _faqItems = [
    FAQItem(
      question: 'How do I set up emergency contacts?',
      answer: 'Go to Emergency Contacts section and tap the "+" button to add contacts. You can add multiple contacts with their name, phone number, and relationship.',
      category: 'Emergency',
    ),
    FAQItem(
      question: 'How do I track my health metrics?',
      answer: 'Use the Health Metrics section to manually enter or sync data from connected devices. You can track heart rate, blood pressure, steps, and more.',
      category: 'Health',
    ),
    FAQItem(
      question: 'How do I create memos/reminders?',
      answer: 'Navigate to the Memos section and tap the "+" button. You can create text reminders, set priorities, and mark them as complete.',
      category: 'Memos',
    ),
    FAQItem(
      question: 'How do I use the exercise routines?',
      answer: 'Browse available workouts in the Exercise Routines section. Select a routine and follow the guided instructions with timers and demonstrations.',
      category: 'Exercise',
    ),
    FAQItem(
      question: 'What is the Wellness Hub?',
      answer: 'The Wellness Hub provides relaxing sounds, meditation guides, and stress relief content to help improve your mental wellbeing.',
      category: 'Wellness',
    ),
    FAQItem(
      question: 'How do I update my profile?',
      answer: 'Go to your Profile, tap the Edit button, update your information, and save the changes. You can also upload a profile picture.',
      category: 'Profile',
    ),
    FAQItem(
      question: 'How do I change the app theme?',
      answer: 'Go to Settings > Appearance and choose between Light, Dark, or System theme options.',
      category: 'Settings',
    ),
    FAQItem(
      question: 'Why am I not receiving notifications?',
      answer: 'Check your device notification settings and ensure LifeGuard has permission to send notifications. Also verify notification preferences in app settings.',
      category: 'Notifications',
    ),
  ];

  List<FAQItem> get _filteredFAQs {
    if (_searchQuery.isEmpty) return _faqItems;
    return _faqItems.where((faq) =>
      faq.question.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().contains(_searchQuery.toLowerCase())
    ).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search box
            Container(
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: isDark 
                        ? Colors.black.withOpacity(0.3) 
                        : Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: TextField(
                onChanged: (value) => setState(() => _searchQuery = value),
                decoration: InputDecoration(
                  hintText: 'Search for help...',
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF4285F4)),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                  contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                ),
              ),
            ),
            
            // Quick Actions
            Text(
              'Quick Actions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            
            Row(
              children: [
                Expanded(
                  child: _buildActionCard(
                    context,
                    icon: Icons.email,
                    title: 'Contact Us',
                    subtitle: 'Send us an email',
                    onTap: () => _launchEmail(),
                    isDark: isDark,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionCard(
                    context,
                    icon: Icons.bug_report,
                    title: 'Report Issue',
                    subtitle: 'Report a bug',
                    onTap: () => _showReportDialog(context),
                    isDark: isDark,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // FAQ Section
            Text(
              'Frequently Asked Questions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
            ),
            const SizedBox(height: 16),
            
            if (_filteredFAQs.isEmpty)
              Container(
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    Icon(
                      Icons.search_off,
                      size: 64,
                      color: isDark ? Colors.grey[600] : Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No FAQs found',
                      style: TextStyle(
                        fontSize: 18,
                        color: isDark ? Colors.grey[400] : Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Try searching with different keywords',
                      style: TextStyle(
                        fontSize: 14,
                        color: isDark ? Colors.grey[500] : Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _filteredFAQs.length,
                itemBuilder: (context, index) {
                  return _buildFAQItem(_filteredFAQs[index], isDark);
                },
              ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: isDark 
                  ? Colors.black.withOpacity(0.3) 
                  : Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF4285F4).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: const Color(0xFF4285F4),
                size: 24,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: isDark ? Colors.grey[400] : Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildFAQItem(FAQItem faq, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: isDark 
                ? Colors.black.withOpacity(0.3) 
                : Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ExpansionTile(
        title: Text(
          faq.question,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        subtitle: Container(
          margin: const EdgeInsets.only(top: 4),
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: const Color(0xFF4285F4).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            faq.category,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF4285F4),
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              faq.answer,
              style: TextStyle(
                fontSize: 14,
                color: isDark ? Colors.grey[300] : Colors.grey[700],
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  void _launchEmail() async {
    const email = 'evansachie0101@gmail.com';
    
    try {
      final Uri emailUri = Uri(
        scheme: 'mailto',
        path: email,
        queryParameters: {
          'subject': 'LifeGuard App Support',
        },
      );
      
      bool launched = false;
      
      try {
        launched = await launchUrl(
          emailUri,
          mode: LaunchMode.externalApplication,
        );
      } catch (e) {
        launched = false;
      }
      
      if (!launched) {
        try {
          launched = await launchUrl(
            emailUri,
            mode: LaunchMode.platformDefault,
          );
        } catch (e) {
          launched = false;
        }
      }
      
      if (!launched && mounted) {
        _showManualEmailDialog(email);
      }
    } catch (e) {
      if (mounted) {
        _showManualEmailDialog(email);
      }
    }
  }
  
  void _showManualEmailDialog(String email) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        title: Text(
          'Contact Support',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Please send your support request to:',
              style: TextStyle(
                color: isDark ? Colors.grey[300] : Colors.grey[700],
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? Colors.grey[800] : Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      email,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF4285F4),
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Email copied to clipboard: $email'),
                          backgroundColor: const Color(0xFF4285F4),
                        ),
                      );
                    },
                    icon: const Icon(Icons.copy),
                    tooltip: 'Copy email',
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
  
  void _showReportDialog(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        title: Text(
          'Report an Issue',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        content: Text(
          'Please email us at evansachie0101@gmail.com with:\n\n• Description of the issue\n• Steps to reproduce\n• Your device information\n\nWe\'ll get back to you as soon as possible!',
          style: TextStyle(
            color: isDark ? Colors.grey[300] : Colors.grey[700],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _launchEmail();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4285F4),
              foregroundColor: Colors.white,
            ),
            child: const Text('Send Email'),
          ),
        ],
      ),
    );
  }
}

class FAQItem {
  final String question;
  final String answer;
  final String category;
  
  FAQItem({
    required this.question,
    required this.answer,
    required this.category,
  });
}
