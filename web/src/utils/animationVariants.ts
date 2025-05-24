interface TransitionProps {
  duration?: number;
  ease?: string;
  staggerChildren?: number;
}

interface VariantState {
  opacity?: number;
  y?: number;
  transition?: TransitionProps;
}

interface AnimationVariants {
  hidden: VariantState;
  visible: VariantState;
}

export const containerVariants: AnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants: AnimationVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};
