import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voice_commands_provider.dart';

class VoiceCommandsWidget extends StatefulWidget {
  final bool isDarkMode;
  final VoidCallback? onCommandExecuted;

  const VoiceCommandsWidget({
    super.key,
    required this.isDarkMode,
    this.onCommandExecuted,
  });

  @override
  State<VoiceCommandsWidget> createState() => _VoiceCommandsWidgetState();
}

class _VoiceCommandsWidgetState extends State<VoiceCommandsWidget>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _rotationController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();

    _pulseController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );

    _rotationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _rotationController,
      curve: Curves.linear,
    ));
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<VoiceCommandsProvider>(
      builder: (context, voiceProvider, child) {
        // Update animations based on listening state
        if (voiceProvider.isListening) {
          _pulseController.repeat(reverse: true);
          _rotationController.repeat();
        } else {
          _pulseController.stop();
          _rotationController.stop();
        }

        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Voice command feedback
            if (voiceProvider.lastCommand.isNotEmpty)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color:
                      widget.isDarkMode ? Colors.grey[800] : Colors.grey[200],
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '"${voiceProvider.lastCommand}"',
                  style: TextStyle(
                    color: widget.isDarkMode ? Colors.white : Colors.black87,
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),

            // Main voice button
            GestureDetector(
              onTap: () => _handleVoiceButtonTap(voiceProvider),
              onLongPress: () => _showCommandsHelp(context, voiceProvider),
              child: AnimatedBuilder(
                animation: _pulseAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale:
                        voiceProvider.isListening ? _pulseAnimation.value : 1.0,
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: voiceProvider.isListening
                              ? [Colors.red[400]!, Colors.red[600]!]
                              : [Colors.blue[400]!, Colors.blue[600]!],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: (voiceProvider.isListening
                                    ? Colors.red
                                    : Colors.blue)
                                .withOpacity(0.3),
                            blurRadius: voiceProvider.isListening ? 15 : 8,
                            spreadRadius: voiceProvider.isListening ? 2 : 1,
                          ),
                        ],
                      ),
                      child: AnimatedBuilder(
                        animation: _rotationAnimation,
                        builder: (context, child) {
                          return Transform.rotate(
                            angle: voiceProvider.isListening
                                ? _rotationAnimation.value * 2 * 3.14159
                                : 0,
                            child: Icon(
                              voiceProvider.isListening
                                  ? Icons.mic
                                  : Icons.mic_none,
                              color: Colors.white,
                              size: 28,
                            ),
                          );
                        },
                      ),
                    ),
                  );
                },
              ),
            ),

            // Error message
            if (voiceProvider.lastError.isNotEmpty)
              GestureDetector(
                onTap: () => voiceProvider.clearError(),
                child: Container(
                  margin: const EdgeInsets.only(top: 8),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.red[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red[300]!),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          voiceProvider.lastError,
                          style: TextStyle(
                            color: Colors.red[700],
                            fontSize: 11,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.close,
                        size: 14,
                        color: Colors.red[600],
                      ),
                    ],
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  void _handleVoiceButtonTap(VoiceCommandsProvider voiceProvider) {
    if (voiceProvider.isListening) {
      voiceProvider.stopListening();
    } else {
      voiceProvider.startListening();
    }
  }

  void _showCommandsHelp(
      BuildContext context, VoiceCommandsProvider voiceProvider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        decoration: BoxDecoration(
          color: widget.isDarkMode ? Colors.grey[900] : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: widget.isDarkMode ? Colors.grey[600] : Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Header
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Icon(
                    Icons.record_voice_over,
                    color: widget.isDarkMode ? Colors.white : Colors.black87,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Voice Commands',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: widget.isDarkMode ? Colors.white : Colors.black87,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(
                      Icons.close,
                      color: widget.isDarkMode ? Colors.white : Colors.black87,
                    ),
                  ),
                ],
              ),
            ),

            // Commands list
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: voiceProvider.commands.length,
                itemBuilder: (context, index) {
                  final command = voiceProvider.commands[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    color:
                        widget.isDarkMode ? Colors.grey[800] : Colors.grey[50],
                    child: ListTile(
                      leading: _getCategoryIcon(command.category),
                      title: Text(
                        command.description,
                        style: TextStyle(
                          color:
                              widget.isDarkMode ? Colors.white : Colors.black87,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      subtitle: Text(
                        'Say: ${command.keywords.join(', ')}',
                        style: TextStyle(
                          color: widget.isDarkMode
                              ? Colors.white70
                              : Colors.black54,
                          fontSize: 12,
                        ),
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getCategoryColor(command.category),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          command.category.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Icon _getCategoryIcon(String category) {
    switch (category) {
      case 'emergency':
        return const Icon(Icons.warning, color: Colors.red);
      case 'health':
        return const Icon(Icons.favorite, color: Colors.pink);
      case 'device':
        return const Icon(Icons.bluetooth, color: Colors.blue);
      case 'navigation':
        return const Icon(Icons.navigation, color: Colors.green);
      default:
        return const Icon(Icons.voice_over_off, color: Colors.grey);
    }
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'emergency':
        return Colors.red;
      case 'health':
        return Colors.pink;
      case 'device':
        return Colors.blue;
      case 'navigation':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
