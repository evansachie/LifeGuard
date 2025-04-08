import categoryBackgrounds from "../components/WellnessHub/SoundBackgrounds";

const getBackgroundStyle = (sound, activeCategory = 'nature') => {
    const bg = categoryBackgrounds[activeCategory] || categoryBackgrounds.nature;
    return {
        backgroundImage: `${bg.gradient}, url(${bg.image}?auto=format&fit=crop&w=600&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
};

export default getBackgroundStyle;