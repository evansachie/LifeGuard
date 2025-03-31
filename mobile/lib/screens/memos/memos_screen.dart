import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/memo_provider.dart';
import 'widgets/memo_card.dart';
import 'widgets/add_memo_dialog.dart';
import 'widgets/memo_filters.dart';

class MemosScreen extends StatefulWidget {
  const MemosScreen({super.key});

  @override
  State<MemosScreen> createState() => _MemosScreenState();
}

class _MemosScreenState extends State<MemosScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<MemoProvider>().fetchMemos());
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final memoProvider = context.watch<MemoProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sticky Notes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: MemoSearchDelegate(memoProvider),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          MemoFilters(),
          Expanded(
            child: memoProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : memoProvider.memos.isEmpty
                    ? Center(
                        child: Text(
                          'No memos yet\nTap + to add a new memo',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: isDark ? Colors.white70 : Colors.grey[600],
                          ),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: memoProvider.memos.length,
                        itemBuilder: (context, index) {
                          final memo = memoProvider.memos[index];
                          return MemoCard(memo: memo);
                        },
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) => const AddMemoDialog(),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class MemoSearchDelegate extends SearchDelegate {
  final MemoProvider memoProvider;

  MemoSearchDelegate(this.memoProvider);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        close(context, null);
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    memoProvider.setSearchQuery(query);
    return _buildSearchResults();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    memoProvider.setSearchQuery(query);
    return _buildSearchResults();
  }

  Widget _buildSearchResults() {
    final filteredMemos = memoProvider.memos;
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredMemos.length,
      itemBuilder: (context, index) {
        final memo = filteredMemos[index];
        return MemoCard(memo: memo);
      },
    );
  }
}
