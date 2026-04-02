"use client"

import { useMemo, useState } from "react"

import type { MatchRevealCard } from "@/components/quadrant-axes-model"
import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import { QUADRANT_MATCH_REVEAL_CARDS } from "@/sections/demo/match-the-four/quadrant-match-reveal-cards"
import { buildLeftCard } from "@/sections/demo/match-the-four/match-the-four-activity"
import type { DemoMatchOutcomes } from "@/sections/demo/match-the-four/demo-match-outcomes"
import { shuffleArray } from "@/sections/demo/shuffle-array"
import { RecogLayout } from "@/sections/recog/recog-layout"
import {
  demoActivityCopyBlockClassName,
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
  demoPrimaryCtaNarrowClassName,
  demoWideContentClassName,
} from "@/sections/demo/demo-ui"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { cn } from "@/lib/utils"

const ALL_QUADRANTS_REVEALED: ReadonlySet<QuadrantId> = new Set(["Q1", "Q2", "Q3", "Q4"])

/** Same iteration order as `quadrantsInOrder` in `QuadrantAxesModel` (grid placement). */
const MATCH_REVEAL_CELL_ORDER: readonly QuadrantId[] = ["Q1", "Q3", "Q2", "Q4"]

function personalizedMatchRevealCards(outcomes: DemoMatchOutcomes): Record<QuadrantId, MatchRevealCard> {
  const d = "quadrant" as const
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
  onContinue?: () => void
}

/**
 * Recognition — two-column stage: your Match the Four outcomes (shuffled, white tiles) vs grey category tiles.
 * Placed after Match the Four, before video grounding.
 */
export function RecognitionPage({ outcomes, onContinue }: RecognitionPageProps) {
  const [contentSource] = useState(shuffledMatchRevealContentSource)
  const [selectedOutcomeCell, setSelectedOutcomeCell] = useState<QuadrantId | null>(null)
  const outcomeCards = useMemo(() => personalizedMatchRevealCards(outcomes), [outcomes])

  const categoryCards: Record<QuadrantId, MatchRevealCard> = useMemo(
    () => ({
      Q1: QUADRANT_MATCH_REVEAL_CARDS.Q1,
      Q2: QUADRANT_MATCH_REVEAL_CARDS.Q2,
      Q3: QUADRANT_MATCH_REVEAL_CARDS.Q3,
      Q4: QUADRANT_MATCH_REVEAL_CARDS.Q4,
    }),
    []
  )

  return (
    <RecogLayout>
      <div className="flex w-full flex-col gap-6">
        <div className={demoActivityCopyBlockClassName}>
          <h2 className={demoActivityHeadingClassName}>You just played four different games.</h2>
          <h2 className={demoActivityInstructionClassName}>Recognition — same model, both columns</h2>
        </div>

        <div className={cn(demoWideContentClassName, "relative px-0 py-2 sm:py-3 md:py-4")}>
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-8 xl:gap-12">
            <div className="flex w-full min-w-0 justify-center">
              <QuadrantAxesModel
                className="max-w-[620px] w-full"
                mode="matchReveal"
                revealedQuadrants={ALL_QUADRANTS_REVEALED}
                matchRevealCards={outcomeCards}
                matchRevealContentSource={contentSource}
                matchRevealTilePalette="plainWhite"
                matchRevealSelection={{
                  selected: selectedOutcomeCell,
                  onSelect: (cell) => setSelectedOutcomeCell((prev) => (prev === cell ? null : cell)),
                }}
              />
            </div>
            <div className="flex w-full min-w-0 justify-center">
              <QuadrantAxesModel
                className="max-w-[620px] w-full"
                mode="matchReveal"
                revealedQuadrants={ALL_QUADRANTS_REVEALED}
                matchRevealCards={categoryCards}
                matchRevealTilePalette="neutralGrey"
                matchRevealCategoryBorders={selectedOutcomeCell != null}
              />
            </div>
          </div>
        </div>

        {onContinue ? (
          <div className="flex w-full max-w-lg flex-col items-center gap-5 self-center px-2 text-center">
            <button type="button" className={cn(demoPrimaryCtaNarrowClassName, "max-w-full")} onClick={() => onContinue()}>
              Continue
            </button>
          </div>
        ) : null}
      </div>
    </RecogLayout>
  )
}
