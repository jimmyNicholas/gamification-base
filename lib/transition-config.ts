/**
 * Centralized configuration for page transition animations
 * Used across section transitions to create consistent reveal effects
 */

/**
 * Timing constants (in milliseconds)
 */
export const TRANSITION_TIMING = {
  /** Duration for section exit animation (fade out) */
  PAGE_EXIT: 350,

  /** Brief pause between exit and enter */
  PAGE_BETWEEN: 150,

  /** Duration for section enter animation (fade in + slide) */
  PAGE_ENTER: 600,

  /** Delay before first content element appears */
  CONTENT_FIRST: 200,

  /** Delay between sequential content elements */
  CONTENT_STAGGER: 150,

  /** Delay before continue button appears */
  BUTTON_APPEAR: 400,
} as const

/**
 * CSS easing functions for different animation phases
 */
export const TRANSITION_EASING = {
  /** Smooth deceleration for entering elements */
  ENTER: 'ease-out',

  /** Smooth acceleration for exiting elements */
  EXIT: 'ease-in',

  /** Balanced easing for general transitions */
  DEFAULT: 'ease-in-out',
} as const

/**
 * Phases that should NOT have transition animations
 * (intro and final reflection as per requirements)
 */
export const TRANSITION_EXCLUDED_PHASES = ['intro', 'reflection'] as const

/**
 * Transform values for enter/exit states
 */
export const TRANSITION_TRANSFORMS = {
  /** Vertical offset for entering elements */
  ENTER_Y: 20,

  /** Vertical offset for exiting elements */
  EXIT_Y: 12,
} as const
