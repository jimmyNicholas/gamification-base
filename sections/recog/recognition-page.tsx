"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { QuadrantAxesModelV2, type CardContent } from "@/components/quadrant-axes-model-v2"
import { QUADRANT_MATCH_REVEAL_CARDS } from "@/sections/demo/match-the-four/quadrant-match-reveal-cards"
import { buildLeftCard } from "@/sections/demo/match-the-four/build-left-card"
import type { DemoMatchOutcomes } from "@/sections/demo/match-the-four/demo-match-outcomes"
import { shuffleArray } from "@/sections/demo/shuffle-array"
import { RecogLayout } from "@/sections/recog/recog-layout"
import {
  demoActivityCopyBlockClassName,
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
} from "@/sections/demo/demo-ui"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"
import {
  MATCH_GRID_LEFT_KEY_TO_INDEX,
  MATCH_GRID_RIGHT_KEY_TO_INDEX,
} from "@/sections/demo/match-grid-keys"

/** Same iteration order as `quadrantsInOrder` in `QuadrantAxesModel` (grid placement). */
const MATCH_REVEAL_CELL_ORDER: readonly QuadrantId[] = ["Q1", "Q3", "Q2", "Q4"]

function personalizedMatchRevealCards(outcomes: DemoMatchOutcomes): Record<QuadrantId, CardContent> {
  const d = "compact" as const
  return {
    Q1: { fullTile: buildLeftCard(outcomes, "competition", d).content },
    Q2: { fullTile: buildLeftCard(outcomes, "roleplay", d).content },
    Q3: { fullTile: buildLeftCard(outcomes, "chance", d).content },
    Q4: { fullTile: buildLeftCard(outcomes, "chaos", d).content },
  }
}

/** Randomly assigns each cell’s content to one of the four outcome quadrants (same shuffle pattern as Match the Four left grid). */
function shuffledMatchRevealContentSource(): Record<QuadrantId, QuadrantId> {
  const shuffled = shuffleArray<QuadrantId>(["Q1", "Q2", "Q3", "Q4"])
  const map = {} as Record<QuadrantId, QuadrantId>
  MATCH_REVEAL_CELL_ORDER.forEach((cell, i) => {
    map[cell] = shuffled[i]!
  })
  return map
}

export type RecognitionPageProps = {
  outcomes: DemoMatchOutcomes
  /** Called once when all four pairs are matched (next phase: Four Categories). */
  onComplete?: () => void
  onMatchMistake?: () => void
}

/**
 * Match the Four — two-column stage: your demo outcomes (shuffled, white tiles) vs grey category tiles.
 * Placed after Chaos; followed by `recognitionCategories` then `recognitionMiniReflection`.
 */
export function RecognitionPage({ outcomes, onComplete, onMatchMistake }: RecognitionPageProps) {
  const [contentSource] = useState(shuffledMatchRevealContentSource)
  const [selectedOutcomeCell, setSelectedOutcomeCell] = useState<QuadrantId | null>(null)
  const [matchedLeftCells, setMatchedLeftCells] = useState<Set<QuadrantId>>(() => new Set())
  const [matchedRightCells, setMatchedRightCells] = useState<Set<QuadrantId>>(() => new Set())
  const advanceOnceRef = useRef(false)
  const outcomeCards = useMemo(() => personalizedMatchRevealCards(outcomes), [outcomes])

  const leftMatchRevealCards = useMemo((): Record<QuadrantId, CardContent> => {
    return {
      Q1: outcomeCards[contentSource.Q1]!,
      Q2: outcomeCards[contentSource.Q2]!,
      Q3: outcomeCards[contentSource.Q3]!,
      Q4: outcomeCards[contentSource.Q4]!,
    }
  }, [contentSource, outcomeCards])

  const categoryCards: Record<QuadrantId, CardContent> = useMemo(
    () => ({
      Q1: QUADRANT_MATCH_REVEAL_CARDS.Q1,
      Q2: QUADRANT_MATCH_REVEAL_CARDS.Q2,
      Q3: QUADRANT_MATCH_REVEAL_CARDS.Q3,
      Q4: QUADRANT_MATCH_REVEAL_CARDS.Q4,
    }),
    []
  )

  /** Visual grid order matches keys 1–4 / 5–8 (see `MATCH_REVEAL_CELL_ORDER`). */
  const leftKeyCornerBadges = useMemo((): Partial<Record<QuadrantId, ReactNode>> => {
    const className =
      "pointer-events-none absolute right-2 top-2 z-10 select-none text-xs font-medium tabular-nums text-neutral-400 sm:text-sm"
    return {
      Q1: <span className={className} aria-hidden>1</span>,
      Q3: <span className={className} aria-hidden>2</span>,
      Q2: <span className={className} aria-hidden>3</span>,
      Q4: <span className={className} aria-hidden>4</span>,
    }
  }, [])

  const rightKeyCornerBadges = useMemo((): Partial<Record<QuadrantId, ReactNode>> | undefined => {
    if (selectedOutcomeCell == null) return undefined
    const className =
      "pointer-events-none absolute right-2 top-2 z-10 select-none text-xs font-medium tabular-nums text-black sm:text-sm"
    return {
      Q1: <span className={className} aria-hidden>5</span>,
      Q3: <span className={className} aria-hidden>6</span>,
      Q2: <span className={className} aria-hidden>7</span>,
      Q4: <span className={className} aria-hidden>8</span>,
    }
  }, [selectedOutcomeCell])

  const handleMatchRevealRightClick = useCallback(
    (rightCell: QuadrantId) => {
      if (selectedOutcomeCell == null) return
      if (matchedLeftCells.has(selectedOutcomeCell)) return
      const expectedCategory = contentSource[selectedOutcomeCell]
      if (rightCell !== expectedCategory) {
        onMatchMistake?.()
        return
      }

      setMatchedLeftCells((prev) => new Set(prev).add(selectedOutcomeCell))
      setMatchedRightCells((prev) => new Set(prev).add(rightCell))
      setSelectedOutcomeCell(null)
    },
    [contentSource, matchedLeftCells, selectedOutcomeCell, onMatchMistake]
  )

  const allMatched = matchedLeftCells.size === 4

  useEffect(() => {
    if (!allMatched || advanceOnceRef.current) return
    advanceOnceRef.current = true
    queueMicrotask(() => onComplete?.())
  }, [allMatched, onComplete])

  useEffect(() => {
    if (allMatched) return

    const slotKeyFromEvent = (e: KeyboardEvent): string | null => {
      const k = e.key
      if (k.length === 1 && k >= "1" && k <= "8") return k
      const c = e.code
      if (c.startsWith("Numpad") && c.length === 7) {
        const d = c.slice(6)
        if (d >= "1" && d <= "8") return d
      }
      return null
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const active = document.activeElement
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        return
      }

      const slotKey = slotKeyFromEvent(e)
      if (!slotKey) return

      const leftIdx = MATCH_GRID_LEFT_KEY_TO_INDEX[slotKey]
      if (leftIdx !== undefined) {
        const q = MATCH_REVEAL_CELL_ORDER[leftIdx]!
        if (matchedLeftCells.has(q)) return
        e.preventDefault()
        setSelectedOutcomeCell((prev) => (prev === q ? null : q))
        return
      }

      const rightIdx = MATCH_GRID_RIGHT_KEY_TO_INDEX[slotKey]
      if (rightIdx !== undefined) {
        if (selectedOutcomeCell == null) return
        e.preventDefault()
        handleMatchRevealRightClick(MATCH_REVEAL_CELL_ORDER[rightIdx]!)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [allMatched, matchedLeftCells, selectedOutcomeCell, handleMatchRevealRightClick])

  return (
    <RecogLayout>
      <TwoColumnActivityStageLayout
        topTitle={
          <div className={demoActivityCopyBlockClassName} aria-hidden={allMatched}>
            <h2 className={demoActivityHeadingClassName}>You just played four different games.</h2>
            <h2 className={demoActivityInstructionClassName}>Match the game to the category</h2>
          </div>
        }
        topTitleVisible={!allMatched}
        leftContent={
          <div className="w-full max-w-[min(100%,400px)] md:max-w-full mx-auto">
            <QuadrantAxesModelV2
              mode="matchReveal"
              className="p-8 md:p-16 lg:p-18"
              cards={leftMatchRevealCards}
              cardCornerBadge={leftKeyCornerBadges}
              cardState={{
                Q1: matchedLeftCells.has("Q1") ? "invisible" : "black-white",
                Q2: matchedLeftCells.has("Q2") ? "invisible" : "black-white",
                Q3: matchedLeftCells.has("Q3") ? "invisible" : "black-white",
                Q4: matchedLeftCells.has("Q4") ? "invisible" : "black-white",
              }}
              onCardClick={(q) => setSelectedOutcomeCell((prev) => (prev === q ? null : q))}
            />
          </div>
        }
        rightContent={
          <div className="w-full max-w-[min(100%,400px)] md:max-w-full mx-auto">
            <QuadrantAxesModelV2
              mode="matchReveal"
              horizontalAxis={{
                state: "invisible",
                clickable: false,
              }}
              verticalAxis={{
                state: "invisible",
                clickable: false,
              }}
              cards={categoryCards}
              cardCornerBadge={rightKeyCornerBadges}
              cardState={{
                Q1: matchedRightCells.has("Q1") ? "activeColor" : selectedOutcomeCell != null ? "grey" : "transparent",
                Q2: matchedRightCells.has("Q2") ? "activeColor" : selectedOutcomeCell != null ? "grey" : "transparent",
                Q3: matchedRightCells.has("Q3") ? "activeColor" : selectedOutcomeCell != null ? "grey" : "transparent",
                Q4: matchedRightCells.has("Q4") ? "activeColor" : selectedOutcomeCell != null ? "grey" : "transparent",
              }}
              onCardClick={handleMatchRevealRightClick}
            />
          </div>
        }
      />
    </RecogLayout>
  )
}
