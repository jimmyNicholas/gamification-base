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

  const bookFrontExtra = React.useMemo(() => {
    const byQuadrant: Record<QuadrantId, string[]> = { Q1: [], Q2: [], Q3: [], Q4: [] }
    for (const act of BOOK_DRAG_ACTIVITIES) {
      if (placedActivityById[act.id] === act.quadrant) {
        byQuadrant[act.quadrant].push(act.label)
      }
    }
    const out: Partial<Record<QuadrantId, React.ReactNode>> = {}
    for (const q of ALL_QUADRANTS) {
      const labels = byQuadrant[q]
      if (labels.length === 0) continue
      out[q] = (
        <ul className="list-none space-y-0.5 pl-0">
          {labels.map((label) => (
            <li key={label} className="align-middle border-b border-black/10 pb-0.5 text-center last:border-0">
              {label}
            </li>
          ))}
        </ul>
      )
    }
    return out
  }, [placedActivityById])

  const remainingActivities = React.useMemo(() => {
    const ordered = dragActivityOrder ?? BOOK_DRAG_ACTIVITIES
    return ordered.filter((a) => placedActivityById[a.id] == null)
  }, [placedActivityById, dragActivityOrder])

  return (
    <RecogLayout dataActivity="postRecognition">
      <TwoColumnActivityStageLayout
        reserveTopTitleSpace={true}
        leftVerticalAlign="start"
        contentClassName={cn(demoWideContentClassName, "relative px-0 py-2 sm:py-3 md:py-4 gap-10 xl:gap-12")}
        leftContent={
          <div className="flex min-h-[min(52vh,420px)] w-full min-w-0 flex-col gap-4 self-stretch sm:gap-5 lg:min-h-0 lg:h-full px-10">
            <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
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
                  {remainingActivities.map((a) => {
                    const isSelected = selectedActivityId === a.id
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
                        className={cn(
                          "cursor-grab rounded-xl border border-black/30 bg-white/70 px-3 py-2 text-sm font-medium shadow-sm active:cursor-grabbing",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                          isSelected && "ring-2 ring-blue-600 ring-offset-2"
                        )}
                      >
                        {a.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {onContinue && remainingActivities.length === 0 ? (
              <div className="mt-auto flex w-full flex-col items-center pt-2 sm:pt-4">
                <button
                  type="button"
                  className={cn(demoPrimaryCtaNarrowClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
                  onClick={() => onContinue()}
                >
                  Continue
                </button>
              </div>
            ) : null}
          </div>
        }
        rightContent={
          <div className="flex w-full min-w-0 justify-center">
            <QuadrantAxesModelV2
              mode="flipCard"
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
