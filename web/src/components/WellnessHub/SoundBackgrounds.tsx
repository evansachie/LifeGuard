interface CategoryBackground {
  image: string;
  gradient: string;
}

interface CategoryBackgrounds {
  [key: string]: CategoryBackground;
}

const categoryBackgrounds: CategoryBackgrounds = {
  nature: {
    image: 'https://images.unsplash.com/photo-1546587348-d12660c30c50', // Serene forest
    gradient: 'linear-gradient(rgba(44, 122, 123, 0.4), rgba(0, 0, 0, 0.6))',
  },
  meditation: {
    image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83', // Zen stones
    gradient: 'linear-gradient(rgba(66, 66, 66, 0.4), rgba(0, 0, 0, 0.6))',
  },
  rain: {
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0', // Rainy window
    gradient: 'linear-gradient(rgba(74, 85, 104, 0.4), rgba(0, 0, 0, 0.6))',
  },
  ocean: {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Calm beach
    gradient: 'linear-gradient(rgba(49, 130, 206, 0.4), rgba(0, 0, 0, 0.6))',
  },
  forest: {
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d', // Misty forest
    gradient: 'linear-gradient(rgba(72, 187, 120, 0.4), rgba(0, 0, 0, 0.6))',
  },
  space: {
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45', // Night sky
    gradient: 'linear-gradient(rgba(90, 103, 216, 0.4), rgba(0, 0, 0, 0.6))',
  },
  bowls: {
    image: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5', // Singing bowls
    gradient: 'linear-gradient(rgba(66, 66, 66, 0.4), rgba(0, 0, 0, 0.6))',
  },
  binaural: {
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', // Music waves
    gradient: 'linear-gradient(rgba(66, 66, 66, 0.4), rgba(0, 0, 0, 0.6))',
  },
  flute: {
    image: 'https://images.unsplash.com/photo-1629726211447-3df75890f372', // Native flute
    gradient: 'linear-gradient(rgba(66, 66, 66, 0.4), rgba(0, 0, 0, 0.6))',
  },
};

export default categoryBackgrounds;
