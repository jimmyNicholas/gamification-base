"use client"

import { useCallback, useMemo, useState } from "react"

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
  demoPrimaryCtaNarrowClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { cn } from "@/lib/utils"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"

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
  onContinue?: () => void
}

/**
 * Recognition — two-column stage: your Match the Four outcomes (shuffled, white tiles) vs grey category tiles.
 * Placed after Chaos, before the quadrants book.
 */
export function RecognitionPage({ outcomes, onContinue }: RecognitionPageProps) {
  const [contentSource] = useState(shuffledMatchRevealContentSource)
  const [selectedOutcomeCell, setSelectedOutcomeCell] = useState<QuadrantId | null>(null)
  const [matchedLeftCells, setMatchedLeftCells] = useState<Set<QuadrantId>>(() => new Set())
  const [matchedRightCells, setMatchedRightCells] = useState<Set<QuadrantId>>(() => new Set())
  /** After all tiles match: first left column is copy + video; Continue swaps to mini-reflection only. */
  const [afterMatchLeft, setAfterMatchLeft] = useState<"copyAndVideo" | "reflection">("copyAndVideo")
  const outcomeCards = useMemo(() => personalizedMatchRevealCards(outcomes), [outcomes])

  /** Per-cell content matches `contentSource` so each tile pairs with the correct right category (same as V1 `matchRevealContentSource`). */
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

  const handleMatchRevealRightClick = useCallback(
    (rightCell: QuadrantId) => {
      if (selectedOutcomeCell == null) return
      if (matchedLeftCells.has(selectedOutcomeCell)) return
      const expectedCategory = contentSource[selectedOutcomeCell]
      if (rightCell !== expectedCategory) return

      setMatchedLeftCells((prev) => new Set(prev).add(selectedOutcomeCell))
      setMatchedRightCells((prev) => new Set(prev).add(rightCell))
      setSelectedOutcomeCell(null)
    },
    [contentSource, matchedLeftCells, selectedOutcomeCell]
  )

  const allMatched = matchedLeftCells.size === 4

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
          <div className="flex w-full min-w-0 justify-center">
            {!allMatched ? (
              <div 
              // className="relative mx-auto aspect-square w-full max-w-[620px]"
              >
                <QuadrantAxesModelV2
                  //className="h-full w-full max-w-[620px]"
                  mode="matchReveal"
                  cards={leftMatchRevealCards}
                  cardState={{
                    Q1: matchedLeftCells.has("Q1") ? "invisible" : "black-white",
                    Q2: matchedLeftCells.has("Q2") ? "invisible" : "black-white",
                    Q3: matchedLeftCells.has("Q3") ? "invisible" : "black-white",
                    Q4: matchedLeftCells.has("Q4") ? "invisible" : "black-white",
                  }}
                  onCardClick={(q) => setSelectedOutcomeCell((prev) => prev === q ? null : q)}
                />
              </div>
            ) : afterMatchLeft === "copyAndVideo" ? (
              <div className="grid h-full min-h-[min(280px,50vh)] min-w-0 w-full grid-cols-1 gap-6 text-black sm:gap-8 lg:min-h-0 lg:grid-cols-2 lg:items-stretch lg:gap-6 xl:gap-8">
                <div className="flex min-w-0 flex-col items-start justify-center gap-8 self-start lg:self-stretch px-20">
                  <h3 className="text-left text-lg font-bold leading-snug sm:text-xl">The Four Categories of Play.</h3>
                  <p className="text-left text-sm leading-relaxed text-black/80 sm:text-base">
                    A French sociologist named Roger Caillois identified them in his book &apos;Man, Play and Games&apos;. You will explore each one properly in the next section. For now, you have already felt them as your student does. Take these feelings with you into the next sections.
                  </p>
                  <p className="text-left text-sm leading-relaxed text-black/80 sm:text-base">
                    Caillois called them agon, alea, mimicry, and ilinx. You do not need to remember those words because Competition, Chance, Roleplay, and Chaos will do just fine.
                  </p>
                  {onContinue ? (
                    <div className="flex w-full max-w-lg flex-col items-center gap-5 self-center px-2 text-center">
                      <button
                        type="button"
                        className={cn(
                          demoPrimaryCtaNarrowClassName,
                          demoPrimaryCtaNativeFocusClassName,
                          "max-w-full"
                        )}
                        onClick={() => setAfterMatchLeft("reflection")}
                      >
                        Continue
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="relative h-full min-h-[min(220px,40vh)] w-full min-w-0 overflow-hidden rounded-xl border border-black/15 bg-black/4 lg:min-h-0">
                  {/* TikTok: set `src` to https://www.tiktok.com/embed/v2/{videoId} or use the official embed snippet */}
                  <iframe
                    title="TikTok video"
                    className="h-full min-h-[200px] w-full border-0 lg:min-h-0"
                    src="https://www.tiktok.com/embed/v2/6954424802610269446"
                    allow="fullscreen"
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full min-w-0 flex-col items-start gap-6 text-black sm:gap-8">
                <h3 className="text-left text-lg font-bold leading-snug sm:text-xl">
                  Before you go deeper. Let&apos;s take a moment to think.
                </h3>
                <p className="text-left text-base font-medium leading-snug text-black sm:text-lg">
                  Which of the four did you recognise most from your own classroom?
                </p>
                <label className="sr-only" htmlFor="recognition-mini-reflection">
                  Reflection (optional)
                </label>
                <textarea
                  id="recognition-mini-reflection"
                  name="recognition-mini-reflection"
                  autoComplete="off"
                  className="min-h-[200px] w-full resize-y rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-relaxed text-black/90 outline-none placeholder:text-black/55 focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[220px] sm:text-base"
                  placeholder="These notes are just for you. Nothing you write here is saved or assessed. We only record whether you used this space, not what you said. You can type here or skip entirely."
                />
                {onContinue ? (
                  <div className="flex w-full flex-col items-stretch pt-1">
                    <button
                      type="button"
                      className={cn(
                        demoPrimaryCtaNarrowClassName,
                        demoPrimaryCtaNativeFocusClassName,
                        "max-w-full"
                      )}
                      onClick={() => onContinue()}
                    >
                      Continue
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        }
        rightContent={
          <div className="flex w-full min-w-0 justify-center">
            <QuadrantAxesModelV2
              // className="h-full w-full max-w-[620px]"
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
