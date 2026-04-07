import { type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  TRANSITION_TIMING,
  TRANSITION_TRANSFORMS,
} from '@/lib/transition-config'

interface PageTransitionWrapperProps {
  /** Content to animate */
  children: ReactNode
  /** Whether the content is currently visible */
  isVisible: boolean
  /** Optional className for the wrapper */
  className?: string
  /** Optional data attribute for tracking */
  dataActivity?: string
}

/**
 * Wrapper component that applies enter/exit animations to page content.
 * Handles opacity and vertical slide transitions with proper timing.
 *
 * @example
 * ```tsx
 * <PageTransitionWrapper isVisible={isVisible}>
 *   <SectionContent />
 * </PageTransitionWrapper>
 * ```
 */
export function PageTransitionWrapper({
  children,
  isVisible,
  className,
  dataActivity,
}: PageTransitionWrapperProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check user's motion preferences for accessibility
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // If user prefers reduced motion, show content instantly without transitions
  if (prefersReducedMotion) {
    return (
      <div
        className={cn('opacity-100', !isVisible && 'pointer-events-none', className)}
        data-activity={dataActivity}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        // Base transition configuration
        'transition-all',
        // Visible state
        isVisible && 'translate-y-0 opacity-100',
        // Hidden state (exiting)
        !isVisible && 'opacity-0 pointer-events-none',
        // Custom classes
        className
      )}
      style={{
        // Use inline styles for precise timing control
        transitionDuration: isVisible
          ? `${TRANSITION_TIMING.PAGE_ENTER}ms`
          : `${TRANSITION_TIMING.PAGE_EXIT}ms`,
        transitionTimingFunction: isVisible ? 'ease-out' : 'ease-in',
        // Apply transforms via style for precise control
        transform: isVisible
          ? 'translateY(0)'
          : `translateY(${TRANSITION_TRANSFORMS.EXIT_Y}px)`,
      }}
      data-activity={dataActivity}
    >
      {children}
    </div>
  )
}
