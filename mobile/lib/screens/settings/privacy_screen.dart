import 'package:flutter/material.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        foregroundColor: isDark ? Colors.white : Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with shield icon
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF4285F4).withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: const Color(0xFF4285F4).withOpacity(0.3),
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4285F4).withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.shield,
                      size: 40,
                      color: Color(0xFF4285F4),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Your Privacy Matters',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'We are committed to protecting your personal information and privacy.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Privacy sections
            _buildPrivacySection(
              context,
              icon: Icons.person_outline,
              title: 'Our Commitment to Privacy',
              content: 'Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our application.',
              isDark: isDark,
            ),
            
            _buildPrivacySection(
              context,
              icon: Icons.storage,
              title: 'Information We Collect',
              content: 'We collect the following types of information:',
              isDark: isDark,
              listItems: [
                'Personal Information: Name, email, profile picture',
                'Health Data: Activity tracking, health metrics',
                'Environmental Data: Air quality readings',
                'Usage Information: App interactions, preferences',
              ],
            ),
            
            _buildPrivacySection(
              context,
              icon: Icons.security,
              title: 'How We Protect Your Information',
              content: 'We implement industry-standard security measures including:',
              isDark: isDark,
              listItems: [
                'End-to-end encryption',
                'Secure data storage',
                'Regular security audits',
                'Access controls',
              ],
            ),
            
            _buildPrivacySection(
              context,
              icon: Icons.share,
              title: 'Information Sharing',
              content: 'We do not sell your personal information. We only share data with:',
              isDark: isDark,
              listItems: [
                'Service providers who assist in delivering our services',
                'Legal authorities when required by law',
              ],
            ),
            
            _buildPrivacySection(
              context,
              icon: Icons.settings,
              title: 'Your Choices',
              content: 'You have the following rights regarding your data:',
              isDark: isDark,
              listItems: [
                'Access and update your information',
                'Request data deletion',
                'Opt-out of communications',
                'Control app permissions',
              ],
            ),
            
            _buildPrivacySection(
              context,
              icon: Icons.update,
              title: 'Policy Updates',
              content: 'We may update this policy periodically. We will notify you of significant changes via email or app notification.',
              isDark: isDark,
            ),
            
            _buildPrivacySection(
              context,
              icon: Icons.email,
              title: 'Contact Us',
              content: 'For privacy-related inquiries, contact us at:',
              isDark: isDark,
              contactEmails: [
                'evansachie0101@gmail.com',
                'michaeladugyamfi76@gmail.com',
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Last updated
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? Colors.grey[800] : Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'Last updated: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}',
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
  
  Widget _buildPrivacySection(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String content,
    required bool isDark,
    List<String>? listItems,
    List<String>? contactEmails,
  }) {
    return Container(
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
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? Colors.grey[300] : Colors.grey[700],
              height: 1.5,
            ),
          ),
          if (listItems != null) ...[
            const SizedBox(height: 8),
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
          if (contactEmails != null) ...[
            const SizedBox(height: 8),
            ...contactEmails.map((email) => Padding(
              padding: const EdgeInsets.only(left: 16, top: 4),
              child: Text(
                email,
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF4285F4),
                  decoration: TextDecoration.underline,
                ),
              ),
            )),
          ],
        ],
      ),
    );
  }
}
