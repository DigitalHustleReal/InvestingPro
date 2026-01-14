/**
 * Animation Constants - Centralized animation values for consistency
 * UI/UX Phase 3 - Animation Consistency
 */

export const ANIMATION_DURATIONS = {
  /** Fast animations (hover states, tooltips) - 150ms */
  fast: 150,
  /** Normal animations (most interactions) - 250ms */
  normal: 250,
  /** Slow animations (page transitions, modals) - 400ms */
  slow: 400,
  /** Very slow animations (complex sequences) - 600ms */
  verySlow: 600,
} as const;

export const ANIMATION_EASINGS = {
  /** Standard ease-out for entering elements */
  easeOut: [0, 0, 0.2, 1] as const,
  /** Standard ease-in for exiting elements */
  easeIn: [0.4, 0, 1, 1] as const,
  /** Standard ease-in-out for morphing */
  easeInOut: [0.4, 0, 0.2, 1] as const,
  /** Spring animation for bouncy effects */
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  /** Gentle spring for subtle effects */
  gentleSpring: { type: "spring" as const, stiffness: 200, damping: 25 },
  /** Bouncy spring for playful effects */
  bouncySpring: { type: "spring" as const, stiffness: 400, damping: 20 },
} as const;

/** Framer Motion transition presets */
export const TRANSITIONS = {
  /** Quick fade for tooltips, badges */
  quickFade: {
    duration: ANIMATION_DURATIONS.fast / 1000,
    ease: ANIMATION_EASINGS.easeOut,
  },
  /** Standard fade for most elements */
  fade: {
    duration: ANIMATION_DURATIONS.normal / 1000,
    ease: ANIMATION_EASINGS.easeOut,
  },
  /** Slow fade for page transitions */
  slowFade: {
    duration: ANIMATION_DURATIONS.slow / 1000,
    ease: ANIMATION_EASINGS.easeInOut,
  },
  /** Spring transition for interactive elements */
  spring: ANIMATION_EASINGS.spring,
  /** Gentle spring for subtle movements */
  gentleSpring: ANIMATION_EASINGS.gentleSpring,
} as const;

/** Common animation variants for Framer Motion */
export const VARIANTS = {
  /** Fade in from below */
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  /** Fade in from above */
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  /** Fade in from left */
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  /** Fade in from right */
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  /** Scale in from center */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  /** Simple fade */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  /** Stagger children - use with container */
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  /** Stagger children fast */
  staggerContainerFast: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
} as const;

/** CSS transition classes for Tailwind */
export const CSS_TRANSITIONS = {
  /** Fast transition for hover states */
  fast: 'transition-all duration-150 ease-out',
  /** Normal transition for interactions */
  normal: 'transition-all duration-250 ease-out',
  /** Slow transition for modals */
  slow: 'transition-all duration-400 ease-in-out',
  /** Color only transition */
  colors: 'transition-colors duration-200',
  /** Transform only transition */
  transform: 'transition-transform duration-200',
  /** Opacity only transition */
  opacity: 'transition-opacity duration-200',
} as const;

/** Delay values for staggered animations */
export const STAGGER_DELAYS = {
  fast: 50,
  normal: 100,
  slow: 150,
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type AnimationEasing = keyof typeof ANIMATION_EASINGS;
export type TransitionPreset = keyof typeof TRANSITIONS;
export type VariantName = keyof typeof VARIANTS;
