enum SoundCategory { nature, meditation, ambient, gaming, spiritual }

class Sound {
  final String title;
  final String location;
  final String imageName;
  final String audioURL;
  final SoundCategory category;

  Sound({
    required this.title,
    required this.location,
    required this.imageName,
    required this.audioURL,
    required this.category,
  });
}

final List<Sound> soundData = [
  // Nature Sounds
  Sound(
    title: 'Summit Song',
    location: 'Mountains',
    imageName: 'mountain-amb',
    audioURL:
        'https://zensounds.blob.core.windows.net/zen/Mountain-Ambience.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Blackbird Melody',
    location: 'Spring Forest',
    imageName: 'Blackbird',
    audioURL:
        'https://zensounds.blob.core.windows.net/zen/Blackbird%20Melody.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'River Serenity',
    location: 'Riverside',
    imageName: 'Riverside',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/River Serenity.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Winter Whispers',
    location: 'Bulgaria',
    imageName: 'Bulgaria',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Winter Whispers.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Campfire',
    location: 'Mountain Retreat',
    imageName: 'campfire',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Campfire.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Night Waves',
    location: 'Tropical Beach',
    imageName: 'night-beach',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Night Waves.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Snow Fall',
    location: 'Manali, India',
    imageName: 'manali',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Snow Fall.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Pacific Waves',
    location: 'Enderts Beach, CA',
    imageName: 'beach',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Pacific Waves.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Ocean Waves',
    location: 'Hawaii',
    imageName: 'ocean-waves',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Ocean Waves.mp3',
    category: SoundCategory.nature,
  ),
  Sound(
    title: 'Sunrise',
    location: 'Wadi Shab, Oman',
    imageName: 'sunrise',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Sunrise.mp3',
    category: SoundCategory.nature,
  ),

  // Ambient Sounds
  Sound(
    title: 'The Library',
    location: 'Greycott',
    imageName: 'library',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/The Library.mp3',
    category: SoundCategory.ambient,
  ),
  Sound(
    title: 'Cozy Fireplace',
    location: 'Snow Day',
    imageName: 'fireplace',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Snow-Fire.mp3',
    category: SoundCategory.ambient,
  ),
  Sound(
    title: 'Cafe Study Session',
    location: 'Cafe',
    imageName: 'cafe',
    audioURL:
        'https://zensounds.blob.core.windows.net/zen/Cafe Study Session.mp3',
    category: SoundCategory.ambient,
  ),

  // Gaming Atmosphere
  Sound(
    title: 'Wild West',
    location: 'Red Dead Redemption 2',
    imageName: 'wild-west',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Wild West.mp3',
    category: SoundCategory.gaming,
  ),
  Sound(
    title: 'Midgard Serenity',
    location: 'God of War',
    imageName: 'gow',
    audioURL:
        'https://zensounds.blob.core.windows.net/zen/Midgard Serenity.mp3',
    category: SoundCategory.gaming,
  ),
  Sound(
    title: 'Post Apocalypse',
    location: 'The Last of Us',
    imageName: 'last-of-us',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/Post Apocalypse.mp3',
    category: SoundCategory.gaming,
  ),

  // Spiritual & Meditation
  Sound(
    title: 'ॐ',
    location: 'om',
    imageName: 'shiva',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/om.mp3',
    category: SoundCategory.spiritual,
  ),
  Sound(
    title: 'Vishnu\'s Sanctuary',
    location: 'The Temple of Vishnu',
    imageName: 'vishnu',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/vishnu.mp3',
    category: SoundCategory.spiritual,
  ),
  Sound(
    title: 'Flute of Love',
    location: 'Krishna\'s Lullaby',
    imageName: 'krishna',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/krishna.mp3',
    category: SoundCategory.spiritual,
  ),
  Sound(
    title: 'Meditative Escape',
    location: 'Tiny Lotus',
    imageName: 'tibet',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/tibet.mp3',
    category: SoundCategory.spiritual,
  ),
  Sound(
    title: 'WBDS Radio',
    location: 'Mafia',
    imageName: 'mafia',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/WBDS Radio.mp3',
    category: SoundCategory.ambient,
  ),
  Sound(
    title: 'Empire Central Radio',
    location: 'Mafia II',
    imageName: 'mafia-radio-central',
    audioURL:
        'https://zensounds.blob.core.windows.net/zen/Empire Central Radio.mp3',
    category: SoundCategory.ambient,
  ),
  Sound(
    title: 'Empire Classic Radio',
    location: 'Mafia II',
    imageName: 'mafia-radia-classic',
    audioURL:
        'https://zensounds.blob.core.windows.net/zen/Empire Classic Radio.mp3',
    category: SoundCategory.ambient,
  ),
  Sound(
    title: 'WVCE 1150',
    location: 'Mafia III',
    imageName: 'WVCE',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/WVCE-1150.mp3',
    category: SoundCategory.gaming,
  ),
  Sound(
    title: 'WBYU 620',
    location: 'Mafia III',
    imageName: 'WBYU',
    audioURL: 'https://zensounds.blob.core.windows.net/zen/WBYU-620.mp3',
    category: SoundCategory.gaming,
  ),
];
