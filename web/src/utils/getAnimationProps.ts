type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface AnimationProps {
  scale: number;
  duration: number;
  backgroundColor: string;
}

export const getAnimationProps = (phase: BreathPhase): AnimationProps => {
  switch (phase) {
    case 'inhale':
      return {
        scale: 1.5,
        duration: 4,
        backgroundColor: 'rgba(66, 153, 225, 0.6)', // blue
      };
    case 'hold':
      return {
        scale: 1.5,
        duration: 7,
        backgroundColor: 'rgba(72, 187, 120, 0.6)', // green
      };
    case 'exhale':
      return {
        scale: 1.0,
        duration: 8,
        backgroundColor: 'rgba(237, 137, 54, 0.6)', // orange
      };
    case 'rest':
      return {
        scale: 1.0,
        duration: 3,
        backgroundColor: 'rgba(113, 128, 150, 0.6)', // gray
      };
    default:
      return {
        scale: 1.0,
        duration: 4,
        backgroundColor: 'rgba(66, 153, 225, 0.6)', // blue
      };
  }
};
