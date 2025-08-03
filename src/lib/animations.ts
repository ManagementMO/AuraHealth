// Animation system for AuraHealth healthcare platform
import { Variants } from "framer-motion";

// Duration guidelines
export const duration = {
  micro: 0.15, // 150ms
  fast: 0.2, // 200ms
  normal: 0.3, // 300ms
  slow: 0.5, // 500ms
  loading: 0.8, // 800ms
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.fast,
    },
  },
};

// Staggered list animations
export const listVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

// Button interaction variants
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: duration.micro,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: duration.micro,
    },
  },
};

// Form field animations
export const formFieldVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.fast,
    },
  },
  focus: {
    scale: 1.02,
    transition: {
      duration: duration.micro,
    },
  },
};

// Modal animations
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: duration.fast,
    },
  },
};

// Video call specific animations
export const videoCallVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slow,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: duration.fast,
    },
  },
};

// Connection status animations
export const connectionPulseVariants: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// Loading spinner variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Success/Error state animations
export const successVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: duration.fast,
    },
  },
};

export const errorShakeVariants: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Progress bar animations
export const progressVariants: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: duration.slow,
    },
  }),
};

// Notification animations
export const notificationVariants: Variants = {
  initial: { opacity: 0, x: 300 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
    },
  },
  exit: {
    opacity: 0,
    x: 300,
    transition: {
      duration: duration.fast,
    },
  },
};

// Medical-themed loading animation
export const medicalLoadingVariants: Variants = {
  animate: {
    rotate: [0, 360],
    scale: [1, 1.1, 1],
    transition: {
      rotate: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
      scale: {
        duration: 1,
        repeat: Infinity,
      },
    },
  },
};

// Utility functions for common animations
export const createStaggeredAnimation = (delay: number = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
});

export const createFadeInUp = (delay: number = 0): Variants => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.fast,
      delay,
    },
  },
});

export const createSlideIn = (direction: "left" | "right" | "up" | "down" = "up"): Variants => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration.normal,
      },
    },
  };
};

// CSS classes for reduced motion support
export const reducedMotionStyles = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`; 