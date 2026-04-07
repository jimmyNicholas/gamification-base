"use client"

import * as React from "react"

import { BOOK_DRAG_ACTIVITIES } from "@/sections/recog/book-drag-activities"
import type { BookDragActivity } from "@/sections/recog/book-drag-activities"
import { shuffleArray } from "@/sections/demo/shuffle-array"
import {
  demoPrimaryCtaNarrowClassName,
  demoPrimaryCtaNativeFocusClassName,
  demoWideContentClassName,
} from "@/sections/demo/demo-ui"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { RecogLayout } from "@/sections/recog/recog-layout"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"
import { cn } from "@/lib/utils"
import { QuadrantAxesModelV2 } from "@/components/quadrant-axes-model-v2"
import { useMemo } from "react"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { KeyboardKey } from "@/components/keyboard-key"

const ALL_QUADRANTS: QuadrantId[] = ["Q1", "Q2", "Q3", "Q4"]

const FLIP_CARDS: Partial<Record<QuadrantId, { icon: string; label: string; back: React.ReactNode }>> = {
  Q1: { icon: "🏆", label: "Competition", back: <div className="text-left leading-relaxed space-y-4"><div><h3 className="text-lg font-bold">Competition 🏆</h3><p>Games where one player or team wins by outperforming the others.</p></div><div><h3 className="text-md font-bold">Examples:</h3><p>races, quizzes, spelling bees, timed drills, leaderboards, debates, trivia.</p></div></div> },
  Q2: { icon: "🎭", label: "Roleplay", back: <div className="text-left leading-relaxed space-y-4"><div><h3 className="text-lg font-bold">Roleplay 🎭</h3><p>Games where students become someone else.</p></div><div><h3 className="text-md font-bold">Examples:</h3><p>skits, gestures, email response writing, situational acting</p></div></div> },
  Q3: { icon: "🎲", label: "Chance", back: <div className="text-left leading-relaxed space-y-4"><div><h3 className="text-lg font-bold">Chance 🎲</h3><p>Games where the outcome depends on luck rather than skill.</p></div><div><h3 className="text-md font-bold">Examples:</h3><p>dice, cards, spinning wheels, coins, envelopes, raffles</p></div></div> },
  Q4: { icon: "💥", label: "Chaos", back: <div className="text-left leading-relaxed space-y-4"><div><h3 className="text-lg font-bold">Chaos 💥</h3><p>Games where the outcome is unpredictable and random.</p></div><div><h3 className="text-md font-bold">Examples:</h3><p>rapid movement, running, speed, surprise</p></div></div> },
}

export type PostRecognitionPageProps = {
  onContinue?: () => void
}

/** Yellow recognition surface — placeholder copy left, quadrants book model right. After mini-reflection, before Quadrants Book. */
export function PostRecognitionPage({ onContinue }: PostRecognitionPageProps) {
  const [cardFlipped, setCardFlipped] = React.useState<Partial<Record<QuadrantId, boolean>>>({})
  const [everSeenBack, setEverSeenBack] = React.useState<Partial<Record<QuadrantId, boolean>>>({})
  const [placedActivityById, setPlacedActivityById] = React.useState<Partial<Record<string, QuadrantId>>>({})
  const [selectedActivityId, setSelectedActivityId] = React.useState<string | null>(null)
  const [dragActivityOrder, setDragActivityOrder] = React.useState<BookDragActivity[] | null>(null)
  const continueButtonRef = React.useRef<HTMLButtonElement | null>(null)

  const onBookFlipToggle = React.useCallback((q: QuadrantId) => {
    setCardFlipped((prev) => {
      const willShowBack = !prev[q]
      if (willShowBack) {
        setEverSeenBack((e) => ({ ...e, [q]: true }))
      }
      return { ...prev, [q]: willShowBack }
    })
  }, [])

  const allCardsSeenBackOnce = ALL_QUADRANTS.every((q) => everSeenBack[q])

  React.useEffect(() => {
    if (!allCardsSeenBackOnce) return
    setDragActivityOrder((prev) => prev ?? shuffleArray([...BOOK_DRAG_ACTIVITIES]))
  }, [allCardsSeenBackOnce])

  const handleBookTileActivityDrop = React.useCallback((q: QuadrantId, activityId: string) => {
    const act = BOOK_DRAG_ACTIVITIES.find((a) => a.id === activityId)
    if (!act) return

    setPlacedActivityById((prev) => {
      if (prev[activityId] || act.quadrant !== q) return prev
      // Flip to front in the same update as a successful place (don’t rely on a flag read after `setPlacedActivityById`).
      setCardFlipped((cf) => ({ ...cf, [q]: false }))
      return { ...prev, [activityId]: q }
    })
    setSelectedActivityId((sel) => (sel === activityId && act.quadrant === q ? null : sel))
  }, [])

  const cardFrontExtra = useMemo(() => {
    const result: Partial<Record<QuadrantId, React.ReactNode>> = {}
    for (const [activityId, q] of Object.entries(placedActivityById)) {
      const act = BOOK_DRAG_ACTIVITIES.find((a) => a.id === activityId)
      if (!act || !q) continue
      const existing = result[q as QuadrantId]
      result[q as QuadrantId] = (
        <div className="flex flex-wrap gap-1 justify-center">
          {existing}
          <span className={cn(
            "rounded-full border px-2 py-0.5 text-[0.65rem] font-medium",
            //QUADRANT_PILL_COLOR[q as QuadrantId]
          )}>
            {act.label}
          </span>
        </div>
      )
    }
    return result
  }, [placedActivityById])

  const remainingActivities = React.useMemo(() => {
    const ordered = dragActivityOrder ?? BOOK_DRAG_ACTIVITIES
    return ordered.filter((a) => placedActivityById[a.id] == null)
  }, [placedActivityById, dragActivityOrder])

  // Enable Enter/Spacebar to continue (only when all activities are placed)
  useKeyboardNavigation({
    onSubmit: remainingActivities.length === 0 && onContinue ? onContinue : undefined,
  })

  React.useEffect(() => {
    if (!onContinue || remainingActivities.length !== 0) return
    continueButtonRef.current?.focus()
  }, [onContinue, remainingActivities.length])

  // Keyboard controls for cards (1, 2, 3, 4)
  // 1 = Q1 (Competition), 2 = Q3 (Chance), 3 = Q2 (Roleplay), 4 = Q4 (Chaos)
  // If an activity is selected, place it on the card. Otherwise, flip the card.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return

      const key = event.key
      let quadrant: QuadrantId | null = null

      if (key === '1') quadrant = 'Q1'
      else if (key === '2') quadrant = 'Q3'
      else if (key === '3') quadrant = 'Q2'
      else if (key === '4') quadrant = 'Q4'

      if (quadrant) {
        event.preventDefault()

        // If an activity is selected and drag/drop is active, place it on the card
        if (allCardsSeenBackOnce && selectedActivityId && handleBookTileActivityDrop) {
          handleBookTileActivityDrop(quadrant, selectedActivityId)
        } else {
          // Otherwise, flip the card
          onBookFlipToggle(quadrant)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onBookFlipToggle, allCardsSeenBackOnce, selectedActivityId, handleBookTileActivityDrop])

  // Keyboard controls for activity selection (Q, W, E, R, T, Y, U, I)
  // Maps to activities in the order they appear (after shuffle)
  React.useEffect(() => {
    if (!allCardsSeenBackOnce) return

    const activityKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i']

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return

      const key = event.key.toLowerCase()
      const keyIndex = activityKeys.indexOf(key)

      if (keyIndex !== -1 && remainingActivities[keyIndex]) {
        event.preventDefault()
        const activity = remainingActivities[keyIndex]!
        setSelectedActivityId((prev) => (prev === activity.id ? null : activity.id))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [allCardsSeenBackOnce, remainingActivities])

  return (
    <RecogLayout dataActivity="postRecognition">
      <TwoColumnActivityStageLayout
        reserveTopTitleSpace={true}
        leftVerticalAlign="start"
        contentClassName={cn(demoWideContentClassName, "relative px-0 py-2 sm:py-3 md:py-4 gap-10 xl:gap-12 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2")}
        leftContent={
          <div className="flex mx-auto w-full max-w-[min(100%,400px)] items-center justify-center min-w-0 flex-col gap-4 self-stretch sm:gap-5 lg:min-h-0 lg:h-full">
            <div className="flex min-w-0 flex-col items-center gap-4 sm:gap-5">
              <h2 className="text-left text-xl font-bold leading-snug sm:text-2xl">
                Let&apos;s look at some definitions and examples
              </h2>
              <h3 className="text-left text-base leading-relaxed text-black/80 sm:text-lg">
                Some activities may have a combination of these elements. The key is where the emphasis and intent lies, but more on that a little later.
              </h3>
            </div>

            {allCardsSeenBackOnce ? (
              <div className="flex w-full max-w-lg flex-col gap-3 text-black pt-4">
                <h3 className="text-left text-lg font-bold leading-snug sm:text-xl">
                  These are activities you may already use.
                </h3>
                <p className="text-left text-base leading-relaxed text-black/80 sm:text-lg">
                  Which category does each one belong to?
                </p>
                <div
                  className="grid grid-cols-2 gap-2 text-center items-center justify-center"
                  aria-label="Activities — drag onto a category or select one, then click a category card"
                >
                  {remainingActivities.map((a, idx) => {
                    const isSelected = selectedActivityId === a.id
                    const keyLabel = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I'][idx]
                    return (
                      <button
                        key={a.id}
                        type="button"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", a.id)
                          e.dataTransfer.effectAllowed = "move"
                        }}
                        onClick={() => setSelectedActivityId((prev) => (prev === a.id ? null : a.id))}
                        aria-pressed={isSelected}
                        aria-label={`${a.label} - Press ${keyLabel}`}
                        className={cn(
                          "relative cursor-grab rounded-xl border border-black/30 bg-white/70 px-3 py-2 text-sm font-medium shadow-sm active:cursor-grabbing",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                          isSelected && "ring-2 ring-blue-600 ring-offset-2"
                        )}
                      >
                        {keyLabel && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded bg-gray-500/80 text-xs font-semibold text-white">
                            {keyLabel}
                          </span>
                        )}
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {onContinue && remainingActivities.length === 0 ? (
              <>
              <div>
                <h3 className="text-left text-lg p-2 leading-snug sm:text-xl border border-black pb-2 bg-white/70 rounded-xl">
                All activities are placed. You can revisit the game categories anytime to reread definitions, or continue to the next section.
                </h3>
              </div>
              <div className="mt-4 flex w-full flex-col items-center pt-2 sm:pt-4">
                <button
                  ref={continueButtonRef}
                  type="button"
                  className={cn(demoPrimaryCtaNarrowClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
                  onClick={() => onContinue()}
                >
                  Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
                </button>
              </div>
              </>
            ) : null}
          </div>
        }
        rightContent={
          <div className="flex w-full min-w-0 justify-center">
            <QuadrantAxesModelV2
              mode="flipCard"
              className="scale-100 md:scale-90 md:pt-0"
              cards={FLIP_CARDS}
              cardFlipped={Object.fromEntries(Object.entries(cardFlipped).map(([q, flipped]) => [q, flipped ?? false])) as Partial<Record<QuadrantId, boolean>>}
              onCardFlip={onBookFlipToggle}
              cardFrontExtra={cardFrontExtra}
              onActivityDrop={allCardsSeenBackOnce ? handleBookTileActivityDrop : undefined}
              selectedActivityId={allCardsSeenBackOnce ? selectedActivityId : null}
              />
          </div>
        }
      />
    </RecogLayout>
  )
}
