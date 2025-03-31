import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/memo_provider.dart';

class AddMemoDialog extends StatefulWidget {
  const AddMemoDialog({super.key});

  @override
  State<AddMemoDialog> createState() => _AddMemoDialogState();
}

class _AddMemoDialogState extends State<AddMemoDialog> {
  final _memoController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleAddMemo() async {
    if (_memoController.text.isEmpty) return;

    setState(() => _isLoading = true);
    try {
      await context.read<MemoProvider>().addMemo(_memoController.text);
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Memo created successfully')),
        );
      }
    } catch (e) {
      print('Error in add memo dialog: $e'); // Debug log
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to create memo: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('New Memo'),
      content: TextField(
        controller: _memoController,
        decoration: const InputDecoration(
          hintText: 'Enter your memo...',
        ),
        maxLines: 3,
        autofocus: true,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: _isLoading ? null : _handleAddMemo,
          child: _isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Add'),
        ),
      ],
    );
  }
}
