class Sound {
  final String id;
  final String title;
  final String location;
  final String category;
  final String audioURL;
  final String imageName;
  final String? waveform;
  final double? duration;
  final bool isFavorite;

  Sound({
    required this.id,
    required this.title,
    required this.location,
    required this.category,
    required this.audioURL,
    required this.imageName,
    this.waveform,
    this.duration,
    this.isFavorite = false,
  });

  Sound copyWith({
    String? id,
    String? title,
    String? location,
    String? category,
    String? audioURL,
    String? imageName,
    String? waveform,
    double? duration,
    bool? isFavorite,
  }) {
    return Sound(
      id: id ?? this.id,
      title: title ?? this.title,
      location: location ?? this.location,
      category: category ?? this.category,
      audioURL: audioURL ?? this.audioURL,
      imageName: imageName ?? this.imageName,
      waveform: waveform ?? this.waveform,
      duration: duration ?? this.duration,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

enum SoundCategory {
  nature,
  ambient,
  meditation,
  binaural,
  all
}
