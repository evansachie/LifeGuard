import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

class PlayerControls extends StatelessWidget {
  final AudioPlayer player;
  final String currentSoundTitle;
  final double volume;
  final Function(double) onVolumeChanged;
  final VoidCallback onClose;

  const PlayerControls({
    super.key,
    required this.player,
    required this.currentSoundTitle,
    required this.volume,
    required this.onVolumeChanged,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey[900] : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              const Icon(Icons.music_note),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  currentSoundTitle,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: onClose,
              ),
            ],
          ),
          Row(
            children: [
              const Icon(Icons.volume_down),
              Expanded(
                child: Slider(
                  value: volume,
                  onChanged: onVolumeChanged,
                  min: 0.0,
                  max: 1.0,
                ),
              ),
              const Icon(Icons.volume_up),
            ],
          ),
          StreamBuilder<PlayerState>(
            stream: player.playerStateStream,
            builder: (context, snapshot) {
              final playing = snapshot.data?.playing ?? false;
              return IconButton.filled(
                onPressed: () {
                  if (playing) {
                    player.pause();
                  } else {
                    player.play();
                  }
                },
                icon: Icon(playing ? Icons.pause : Icons.play_arrow),
              );
            },
          ),
        ],
      ),
    );
  }
}
