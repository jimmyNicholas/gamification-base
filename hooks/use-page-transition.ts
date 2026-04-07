import { useEffect, useState, useRef } from 'react'
import type { CoursePhase } from '@/components/course-nav-panel'
import {
  TRANSITION_TIMING,
  TRANSITION_EXCLUDED_PHASES,
} from '@/lib/transition-config'

type TransitionState = 'idle' | 'exiting' | 'entering'

interface PageTransitionReturn {
  /** Current transition state */
  transitionState: TransitionState
  /** The phase currently being displayed (may lag behind actual phase during transition) */
  displayPhase: CoursePhase
  /** Whether the content should be visible */
  isVisible: boolean
}

/**
 * Custom hook to handle smooth page transitions between course phases.
 * Manages exit → pause → enter animation sequence.
 *
 * @param targetPhase - The phase the user wants to navigate to
 * @returns Transition state and display phase for rendering
 *
 * @example
 * ```tsx
 * const { transitionState, displayPhase, isVisible } = usePageTransition(phase)
 *
 * <main className={cn(
 *   "transition-all duration-600",
 *   isVisible ? "opacity-100" : "opacity-0"
 * )}>
 *   {renderContent(displayPhase)}
 * </main>
 * ```
 */
export function usePageTransition(targetPhase: CoursePhase): PageTransitionReturn {
  const [transitionState, setTransitionState] = useState<TransitionState>('idle')
  const [displayPhase, setDisplayPhase] = useState<CoursePhase>(targetPhase)
  const isTransitioningRef = useRef(false)

  useEffect(() => {
    // Skip transitions for excluded phases (intro, reflection)
    const shouldAnimate =
      !TRANSITION_EXCLUDED_PHASES.includes(displayPhase as any) &&
      !TRANSITION_EXCLUDED_PHASES.includes(targetPhase as any)

    // No transition needed if phases match or animations are disabled
    if (targetPhase === displayPhase || !shouldAnimate) {
      if (targetPhase !== displayPhase) {
        setDisplayPhase(targetPhase)
      }
      setTransitionState('idle')
      isTransitioningRef.current = false
      return
    }

    // Prevent multiple transitions from running simultaneously
    if (isTransitioningRef.current) {
      return
    }

    isTransitioningRef.current = true

    // Phase 1: Exit current content
    setTransitionState('exiting')

    const exitTimer = setTimeout(() => {
      // Phase 2: Update displayed phase (happens during the "between" pause)
      setDisplayPhase(targetPhase)

      const enterTimer = setTimeout(() => {
        // Phase 3: Enter new content
        setTransitionState('entering')

        const completeTimer = setTimeout(() => {
          // Phase 4: Complete transition
          setTransitionState('idle')
          isTransitioningRef.current = false
        }, TRANSITION_TIMING.PAGE_ENTER)

        return () => clearTimeout(completeTimer)
      }, TRANSITION_TIMING.PAGE_BETWEEN)

      return () => clearTimeout(enterTimer)
    }, TRANSITION_TIMING.PAGE_EXIT)

    return () => {
      clearTimeout(exitTimer)
      isTransitioningRef.current = false
    }
  }, [targetPhase, displayPhase])

  // Determine visibility based on transition state
  const isVisible = transitionState === 'idle' || transitionState === 'entering'

  return {
    transitionState,
    displayPhase,
    isVisible,
  }
}
