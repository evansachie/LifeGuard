import categoryBackgrounds from '../components/WellnessHub/SoundBackgrounds';

interface BackgroundStyle {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
}

export type CategoryType = 'meditation' | 'nature' | 'focus' | 'sleep';

const getBackgroundStyle = (sound: any, category: CategoryType = 'nature'): BackgroundStyle => {
  const bg = categoryBackgrounds[category] || categoryBackgrounds.nature;
  return {
    backgroundImage: `${bg.gradient}, url(${bg.image}?auto=format&fit=crop&w=600&q=80)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
};

export default getBackgroundStyle;
