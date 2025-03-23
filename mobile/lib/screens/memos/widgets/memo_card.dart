import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/memo_provider.dart';
import 'edit_memo_dialog.dart';
import 'package:intl/intl.dart';

class MemoCard extends StatelessWidget {
  final Map<String, dynamic> memo;

  const MemoCard({super.key, required this.memo});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Ensure all fields are strings and have default values
    final id = memo['_id']?.toString() ?? memo['Id']?.toString() ?? '';
    final text = memo['Text']?.toString() ?? memo['memo']?.toString() ?? '';
    final isDone = memo['Done'] ?? memo['done'] ?? false;
    final createdAtStr = memo['CreatedAt']?.toString() ?? memo['createdAt']?.toString() ?? DateTime.now().toIso8601String();
    final DateTime createdAt = createdAtStr != null 
        ? DateTime.parse(createdAtStr)
        : DateTime.now();
    final formattedDate = DateFormat('MMM d, y').format(createdAt);

    return Dismissible(
      key: Key(id),
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      direction: DismissDirection.endToStart,
      confirmDismiss: (direction) => showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Delete Memo'),
          content: const Text('Are you sure you want to delete this memo?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              style: TextButton.styleFrom(
                foregroundColor: Colors.red,
              ),
              child: const Text('Delete'),
            ),
          ],
        ),
      ),
      onDismissed: (direction) async {
        try {
          await context.read<MemoProvider>().deleteMemo(id);
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Memo deleted successfully')),
            );
          }
        } catch (e) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error deleting memo: ${e.toString()}')),
            );
          }
        }
      },
      child: Card(
        elevation: 2,
        margin: const EdgeInsets.only(bottom: 16),
        child: InkWell(
          onTap: () {
            showDialog(
              context: context,
              builder: (context) => EditMemoDialog(memo: memo),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        text,
                        style: TextStyle(
                          fontSize: 16,
                          decoration: isDone ? TextDecoration.lineThrough : null,
                          color: isDone
                              ? (isDark ? Colors.white38 : Colors.grey)
                              : (isDark ? Colors.white : Colors.black87),
                        ),
                      ),
                    ),
                    Checkbox(
                      value: isDone,
                      onChanged: (value) async {
                        try {
                          final memoProvider = context.read<MemoProvider>();
                          await memoProvider.toggleMemo(id, value ?? false);
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(e.toString())),
                            );
                          }
                        }
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  formattedDate,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? Colors.white38 : Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
