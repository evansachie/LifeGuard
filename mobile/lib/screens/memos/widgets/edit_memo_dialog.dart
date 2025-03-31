import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/memo_provider.dart';

class EditMemoDialog extends StatefulWidget {
  final Map<String, dynamic> memo;

  const EditMemoDialog({super.key, required this.memo});

  @override
  State<EditMemoDialog> createState() => _EditMemoDialogState();
}

class _EditMemoDialogState extends State<EditMemoDialog> {
  late TextEditingController _memoController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _memoController = TextEditingController(text: widget.memo['Text']);
  }

  @override
  void dispose() {
    _memoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AlertDialog(
      title: const Text('Edit Memo'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _memoController,
            decoration: const InputDecoration(
              hintText: 'Enter your memo...',
            ),
            maxLines: 3,
            autofocus: true,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(
                Icons.info_outline,
                size: 16,
                color: isDark ? Colors.white60 : Colors.grey[600],
              ),
              const SizedBox(width: 8),
              Text(
                'Press and hold to delete',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? Colors.white60 : Colors.grey[600],
                ),
              ),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () async {
            // Show delete confirmation
            final shouldDelete = await showDialog<bool>(
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
            );

            if (shouldDelete == true) {
              setState(() => _isLoading = true);
              try {
                await context.read<MemoProvider>().deleteMemo(widget.memo['_id']);
                if (mounted) {
                  Navigator.of(context).pop(); // Close edit dialog
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Memo deleted successfully')),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error deleting memo: ${e.toString()}')),
                  );
                }
              } finally {
                if (mounted) setState(() => _isLoading = false);
              }
            }
          },
          style: TextButton.styleFrom(
            foregroundColor: Colors.red,
          ),
          child: const Text('Delete'),
        ),
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: _isLoading
              ? null
              : () async {
                  if (_memoController.text.isEmpty) return;

                  setState(() => _isLoading = true);
                  try {
                    await context.read<MemoProvider>().updateMemo(
                      widget.memo['_id'],
                      _memoController.text,
                    );
                    if (mounted) Navigator.pop(context);
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(e.toString())),
                      );
                    }
                  } finally {
                    if (mounted) setState(() => _isLoading = false);
                  }
                },
          child: _isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Save'),
        ),
      ],
    );
  }
}
