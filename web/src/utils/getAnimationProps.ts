type AnimationPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale?: number;
}

interface AnimationParams {
  phase: AnimationPhase;
  pattern: BreathingPattern;
}

interface AnimationProps {
  scale: number | number[];
  duration: number;
  backgroundColor: string | string[];
}

export const getAnimationProps = ({ phase, pattern }: AnimationParams): AnimationProps => {
  switch (phase) {
    case 'inhale':
      return {
        scale: [1, 2.5],
        duration: pattern.inhale,
        backgroundColor: ['#4CAF50', '#81C784'],
      };
    case 'hold':
      return {
        scale: 2.5,
        duration: pattern.hold,
        backgroundColor: '#81C784',
      };
    case 'exhale':
      return {
        scale: [2.5, 1],
        duration: pattern.exhale,
        backgroundColor: ['#81C784', '#4CAF50'],
      };
    case 'holdAfterExhale':
      return {
        scale: 1,
        duration: pattern.holdAfterExhale || 0,
        backgroundColor: '#4CAF50',
      };
    default:
      return {
        scale: 1,
        duration: 0,
        backgroundColor: '#4CAF50',
      };
  }
};
