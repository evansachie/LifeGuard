import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactCard extends StatelessWidget {
  final Map<String, dynamic> contact;

  const ContactCard({super.key, required this.contact});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Convert Priority to string representation
    String getPriorityText(dynamic priority) {
      if (priority is int) {
        switch (priority) {
          case 1: return 'HIGH';
          case 2: return 'MEDIUM';
          case 3: return 'LOW';
          default: return 'MEDIUM';
        }
      }
      return ((priority ?? 'medium') as String).toUpperCase();
    }

    final priorityText = getPriorityText(contact['Priority'] ?? contact['priority']);

    // Debug print to see what data we're receiving
    print('Contact data: $contact');

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.red.shade100,
                  child: const Icon(Icons.person_outline, color: Colors.red),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        contact['Name'] ?? contact['name'] ?? 'No Name',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        contact['Relationship'] ?? contact['relationship'] ?? 'No Relationship',
                        style: TextStyle(
                          color: isDark ? Colors.white70 : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getPriorityColor(priorityText),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    priorityText,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildInfoRow(Icons.phone, contact['Phone'] ?? contact['phone'] ?? 'No Phone'),
            _buildInfoRow(Icons.email, contact['Email'] ?? contact['email'] ?? 'No Email'),
            _buildInfoRow(Icons.work, contact['Role'] ?? contact['role'] ?? 'No Role'),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: const Icon(Icons.phone, color: Colors.green),
                  onPressed: () async {
                    final url = Uri.parse('tel:${contact['phone']}');
                    if (await canLaunchUrl(url)) {
                      await launchUrl(url);
                    }
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.sms, color: Colors.blue),
                  onPressed: () async {
                    final url = Uri.parse('sms:${contact['phone']}');
                    if (await canLaunchUrl(url)) {
                      await launchUrl(url);
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey),
          const SizedBox(width: 8),
          Text(text),
        ],
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
