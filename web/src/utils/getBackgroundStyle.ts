import categoryBackgrounds from '../components/WellnessHub/SoundBackgrounds';

interface BackgroundStyle {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
}

type CategoryType = 'nature' | 'meditation' | 'rain' | 'ocean' | 'forest' | 'space' | 'bowls' | 'binaural' | 'flute';

const getBackgroundStyle = (_sound: any, activeCategory: CategoryType = 'nature'): BackgroundStyle => {
  const bg = categoryBackgrounds[activeCategory] || categoryBackgrounds.nature;
  return {
    backgroundImage: `${bg.gradient}, url(${bg.image}?auto=format&fit=crop&w=600&q=80)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
};

export default getBackgroundStyle;
