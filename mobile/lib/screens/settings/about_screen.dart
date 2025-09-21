import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> {
  final String _version = '1.0.0';
  final String _buildNumber = '1';
  
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('About'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // App Logo and Info
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
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
                    width: 80,
                    height: 80,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4285F4), Color(0xFF34A853)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF4285F4).withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: SvgPicture.asset(
                      'assets/images/lifeguard-logo.svg',
                      width: 56,
                      height: 56,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // App Name
                  Text(
                    'LifeGuard',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                  ),
                  const SizedBox(height: 8),
                  
                  // Version - Static version info
                  Text(
                    'Version $_version ($_buildNumber)',
                    style: TextStyle(
                      fontSize: 16,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Tagline
                  const Text(
                    'Your Personal Health & Safety Companion',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF4285F4),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // About Description
            _buildInfoSection(
              context,
              icon: Icons.info_outline,
              title: 'About LifeGuard',
              content: 'LifeGuard is a comprehensive health monitoring and emergency response application designed to keep you safe and healthy. Track your health metrics, manage emergency contacts, and access wellness resources all in one place.',
              isDark: isDark,
            ),
            
            // Features
            _buildInfoSection(
              context,
              icon: Icons.star_outline,
              title: 'Key Features',
              isDark: isDark,
              listItems: [
                'Health metrics tracking',
                'Emergency contact management',
                'Wellness hub with relaxation sounds',
                'Exercise routines and fitness tracking',
                'Environmental monitoring',
                'Personal memos and reminders',
                'Privacy-focused data protection',
              ],
            ),
            
            // Contact Information
            _buildInfoSection(
              context,
              icon: Icons.contact_support,
              title: 'Contact & Support',
              content: 'For support, feedback, or inquiries:',
              isDark: isDark,
              actionButtons: [
                _buildActionButton(
                  context,
                  icon: Icons.email,
                  label: 'Email Support',
                  onTap: () => _launchEmail('evansachie0101@gmail.com'),
                  isDark: isDark,
                ),
                _buildActionButton(
                  context,
                  icon: Icons.bug_report,
                  label: 'Report Bug',
                  onTap: () => _launchEmail('michaeladugyamfi76@gmail.com'),
                  isDark: isDark,
                ),
              ],
            ),
            
            // Legal
            _buildInfoSection(
              context,
              icon: Icons.gavel,
              title: 'Legal',
              isDark: isDark,
              actionButtons: [
                _buildActionButton(
                  context,
                  icon: Icons.privacy_tip,
                  label: 'Privacy Policy',
                  onTap: () => Navigator.pushNamed(context, '/privacy'),
                  isDark: isDark,
                ),
                _buildActionButton(
                  context,
                  icon: Icons.description,
                  label: 'Terms of Service',
                  onTap: () => _showTermsDialog(context),
                  isDark: isDark,
                ),
              ],
            ),
            
            // Development Team
            _buildInfoSection(
              context,
              icon: Icons.group,
              title: 'Development Team',
              content: 'Developed with ❤️ by passionate developers committed to improving health and safety through technology.',
              isDark: isDark,
            ),
            
            const SizedBox(height: 24),
            
            // Copyright
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? Colors.grey[800] : Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '© ${DateTime.now().year} LifeGuard. All rights reserved.',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildInfoSection(
    BuildContext context, {
    required IconData icon,
    required String title,
    String? content,
    required bool isDark,
    List<String>? listItems,
    List<Widget>? actionButtons,
  }) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF4285F4).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  icon,
                  color: const Color(0xFF4285F4),
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
              ),
            ],
          ),
          if (content != null) ...[
            const SizedBox(height: 12),
            Text(
              content,
              style: TextStyle(
                fontSize: 14,
                color: isDark ? Colors.grey[300] : Colors.grey[700],
                height: 1.5,
              ),
            ),
          ],
          if (listItems != null) ...[
            const SizedBox(height: 12),
            ...listItems.map((item) => Padding(
              padding: const EdgeInsets.only(left: 16, top: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 4,
                    height: 4,
                    margin: const EdgeInsets.only(top: 8, right: 8),
                    decoration: const BoxDecoration(
                      color: Color(0xFF4285F4),
                      shape: BoxShape.circle,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      item,
                      style: TextStyle(
                        fontSize: 14,
                        color: isDark ? Colors.grey[300] : Colors.grey[700],
                        height: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            )),
          ],
          if (actionButtons != null) ...[
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: actionButtons,
            ),
          ],
        ],
      ),
    );
  }
  
  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool isDark,
  }) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 16),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF4285F4),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
  
  void _launchEmail(String email) async {
    try {
      final Uri emailUri = Uri(
        scheme: 'mailto',
        path: email,
        queryParameters: {
          'subject': 'LifeGuard App Inquiry',
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
          'Contact Us',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Please send your inquiry to:',
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
                      Clipboard.setData(ClipboardData(text: email));
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
  
  void _showTermsDialog(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        title: Text(
          'Terms of Service',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
        content: SingleChildScrollView(
          child: Text(
            'By using LifeGuard, you agree to:\n\n• Use the app responsibly and in accordance with applicable laws\n• Provide accurate information when creating your profile\n• Not misuse emergency features\n• Respect the privacy of others\n• Understand that this app is not a replacement for professional medical advice\n\nThe developers are not liable for any medical decisions made based on app data. Always consult healthcare professionals for medical concerns.',
            style: TextStyle(
              color: isDark ? Colors.grey[300] : Colors.grey[700],
              height: 1.5,
            ),
          ),
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
}
