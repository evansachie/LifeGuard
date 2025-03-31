import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/emergency_contact_provider.dart';
import 'widgets/contact_card.dart';
import 'widgets/add_contact_dialog.dart';

class EmergencyContactsScreen extends StatefulWidget {
  const EmergencyContactsScreen({super.key});

  @override
  State<EmergencyContactsScreen> createState() => _EmergencyContactsScreenState();
}

class _EmergencyContactsScreenState extends State<EmergencyContactsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<EmergencyContactProvider>().fetchContacts());
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final provider = context.watch<EmergencyContactProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Contacts'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
        actions: [
          ElevatedButton.icon(
            onPressed: () => _showEmergencyAlertConfirmation(context),
            icon: const Icon(Icons.warning_amber_rounded),
            label: const Text('EMERGENCY'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red[700],
              foregroundColor: Colors.white,
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: provider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : provider.contacts.isEmpty
              ? Center(
                  child: Text(
                    'No emergency contacts added yet\nTap + to add a contact',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: isDark ? Colors.white70 : Colors.grey[600],
                    ),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: provider.contacts.length,
                  itemBuilder: (context, index) {
                    final contact = provider.contacts[index];
                    return ContactCard(contact: contact);
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) => const AddContactDialog(),
          );
        },
        backgroundColor: Colors.red,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Future<void> _showEmergencyAlertConfirmation(BuildContext context) {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Send Emergency Alert'),
        content: const Text(
          'This will send an EMERGENCY alert to ALL your contacts.\n\n'
          'Are you sure you want to proceed?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => _sendEmergencyAlert(context),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Send Emergency Alert'),
          ),
        ],
      ),
    );
  }

  Future<void> _sendEmergencyAlert(BuildContext context) async {
    try {
      Navigator.pop(context); // Close the confirmation dialog
      await context.read<EmergencyContactProvider>().sendEmergencyAlert(isTest: false);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Emergency alert sent to all contacts'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send emergency alert: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}
