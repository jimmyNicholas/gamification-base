// DO NOT USE THIS FILE FOR MATCH THE FOUR ACTIVITY

"use client"

import Image from "next/image"
import { useCallback, useEffect, useState, type ReactNode } from "react"

import { ChanceWheelPreview } from "@/components/chance-wheel"
import { MatchEmojiCard, MatchLabelCard } from "@/sections/demo/competition-activity/match-cards"
import { ANIMAL_MATCH_DEMO } from "@/sections/demo/competition-activity/animal-match-demo"
import { DemoTwoPaneLayout } from "@/sections/demo/demo-layout-primitives"
import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import type { DemoMatchOutcomes } from "./demo-match-outcomes"
import { formatMmSs } from "@/lib/format-mm-ss"
import { cn } from "@/lib/utils"

import {
  MATCH_GRID_LEFT_KEY_TO_INDEX as LEFT_KEY_TO_INDEX,
  MATCH_GRID_LEFT_SLOT_KEYS as LEFT_SLOT_KEYS,
  MATCH_GRID_RIGHT_KEY_TO_INDEX as RIGHT_KEY_TO_INDEX,
  MATCH_GRID_RIGHT_SLOT_KEYS as RIGHT_SLOT_KEYS,
} from "@/sections/demo/match-grid-keys"
import { shuffleArray } from "@/sections/demo/shuffle-array"
import {
  demoPrimaryCtaNarrowClassName,
} from "@/sections/demo/demo-ui"

import { ChaosSkillsMicroArena } from "@/sections/demo/chaos/chaos-skills-micro-arena"
import { MIMICRY_IMAGE_CACHE_BUST } from "@/sections/demo/mimicry/mimicry-scenario"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"

import { QUADRANT_MATCH_REVEAL_CARDS } from "@/sections/demo/match-the-four/quadrant-match-reveal-cards"

export type CategoryId = "competition" | "chance" | "roleplay" | "chaos"

/** Maps Match-the-Four categories to the 2x2 quadrants in the model. */
const CATEGORY_TO_QUADRANT: Record<CategoryId, QuadrantId> = {
  competition: "Q1", // agency + self-intact
  chance: "Q3", // fate + self-intact
  roleplay: "Q2", // agency + self-dissolved
  chaos: "Q4", // fate + self-dissolved
}

const DEFAULT_ROLEPLAY_BERET_SRC = `/assets/mimicry/beret.png?v=${MIMICRY_IMAGE_CACHE_BUST}`

const FALLBACK_COMPETITION_ANIMAL = ANIMAL_MATCH_DEMO.leftItems[0]?.emoji ?? "🐶"

const CATEGORY: Record<
  CategoryId,
  { label: string; frameClassName: string; matchedSurfaceClassName: string; matchedLeftAccentClassName: string }
> = {
  competition: {
    label: "competition",
    frameClassName: "border-black/20 border-l-4 border-l-amber-400 bg-amber-50/55",
    matchedSurfaceClassName: "border-black/20 border-l-4 border-l-amber-500 bg-amber-100/90 text-amber-950",
    matchedLeftAccentClassName: "border-black/20 border-l-4 border-l-amber-500 bg-amber-100/90",
  },
  chance: {
    label: "chance",
    frameClassName: "border-black/20 border-l-4 border-l-emerald-500 bg-emerald-50/55",
    matchedSurfaceClassName: "border-black/20 border-l-4 border-l-emerald-600 bg-emerald-100/90 text-emerald-950",
    matchedLeftAccentClassName: "border-black/20 border-l-4 border-l-emerald-600 bg-emerald-100/90",
  },
  roleplay: {
    label: "roleplay",
    frameClassName: "border-black/20 border-l-[4px] border-l-violet-400 bg-violet-50/60",
    matchedSurfaceClassName: "border-black/20 border-l-[4px] border-l-violet-500 bg-violet-100/90 text-violet-950",
    matchedLeftAccentClassName: "border-black/20 border-l-[4px] border-l-violet-500 bg-violet-100/90",
  },
  chaos: {
    label: "chaos",
    frameClassName: "border-black/20 border-l-4 border-l-pink-500 bg-pink-50/55",
    matchedSurfaceClassName: "border-black/20 border-l-4 border-l-pink-600 bg-pink-100/90 text-pink-950",
    matchedLeftAccentClassName: "border-black/20 border-l-4 border-l-pink-600 bg-pink-100/90",
  },
}

type LeftDef = { id: string; matchId: CategoryId }
type RightItem = { id: string; matchId: CategoryId; label: string }

const LEFT_DEFS: LeftDef[] = [
  { id: "chaos-l-competition", matchId: "competition" },
  { id: "chaos-l-chance", matchId: "chance" },
  { id: "chaos-l-roleplay", matchId: "roleplay" },
  { id: "chaos-l-chaos", matchId: "chaos" },
]

/** Max tile size matches quadrant cells at 620px frame; width is fluid below that (see `layout="fluid"`). */
const MATCH_FOUR_CARD_MAX_CLASS = "w-full max-w-[15.625rem]"

/** Visual parity with `QuadrantAxesModel` inner grid: padding, gap, and frame height vs `max-w-[620px]`. */
const MATCH_FOUR_MODEL_FRAME_CLASS =
  "box-border flex w-full min-w-0 flex-col gap-5 p-[50px] lg:min-h-[620px] lg:h-full lg:flex-row lg:items-center lg:justify-center"

function defaultRightItems(): RightItem[] {
  return LEFT_DEFS.map((l) => ({
    id: `chaos-r-${l.matchId}`,
    matchId: l.matchId,
    label: CATEGORY[l.matchId].label,
  }))
}

function CategoryIllustration({ matchId }: { matchId: CategoryId }) {
  const emoji =
    matchId === "competition" ? "🏆" : matchId === "chance" ? "🎲" : matchId === "roleplay" ? "🎭" : "💥"
  return (
    <span className="text-[clamp(1.75rem,22cqw,3.25rem)] leading-none" aria-hidden>
      {emoji}
    </span>
  )
}

/** `compact` — Match the Four grid cards. `quadrant` — Recognition 2×2 tiles (centered, capped size). */
export type BuildLeftCardDensity = "compact" | "quadrant"

export function buildLeftCard(
  outcomes: DemoMatchOutcomes,
  matchId: CategoryId,
  density: BuildLeftCardDensity = "compact"
): { content: ReactNode; ariaLabel: string } {
  switch (matchId) {
    case "competition": {
      const emoji = outcomes.competitionAnimalEmoji ?? FALLBACK_COMPETITION_ANIMAL
      const line = outcomes.competitionTimeMs != null ? formatMmSs(outcomes.competitionTimeMs) : "0.0"
      return {
        content: (
          <div
            className={
              density === "quadrant"
                ? "flex min-h-0 w-full flex-col items-center justify-center gap-2 px-1"
                : "flex min-h-0 w-full flex-col items-center justify-center gap-1"
            }
          >
            <span
              className={
                density === "quadrant"
                  ? "text-[clamp(4.25rem,13vw,9.5rem)] leading-none"
                  : "text-[2.5rem] leading-none sm:text-[3rem]"
              }
              aria-hidden
            >
              {emoji}
            </span>
            <span
              className={
                density === "quadrant"
                  ? "tabular-nums text-2xl font-bold text-black sm:text-3xl"
                  : "tabular-nums text-base font-semibold text-black sm:text-lg"
              }
            >
              {line}
            </span>
          </div>
        ),
        ariaLabel: `Competition, your time ${line}`,
      }
    }
    case "chance": {
      const line = outcomes.chanceAnswer ?? "Tokyo"
      return {
        content:
          density === "quadrant" ? (
            <div className="flex w-full max-w-48 flex-col items-center justify-center gap-2">
              <div className="aspect-square w-full max-w-44 shrink-0">
                <ChanceWheelPreview className="h-full w-full max-w-none" />
              </div>
              <span className="text-balance text-center text-sm font-medium leading-snug text-black sm:text-base">{line}</span>
            </div>
          ) : (
            <div className="flex min-h-0 w-full flex-col items-center justify-center gap-1.5">
              <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                <ChanceWheelPreview className="h-full w-full max-w-none" />
              </div>
              <span className="text-balance text-center text-xs leading-snug text-black sm:text-sm">{line}</span>
            </div>
          ),
        ariaLabel: `Chance, your answer: ${line}`,
      }
    }
    case "roleplay": {
      const label = outcomes.roleplayHatLabel ?? "Beret"
      const src = outcomes.roleplayHatImageSrc ?? DEFAULT_ROLEPLAY_BERET_SRC
      return {
        content: (
          <div
            className={
              density === "quadrant"
                ? "flex min-h-0 w-full items-center justify-center p-1"
                : "flex min-h-0 w-full items-center justify-center p-0.5"
            }
          >
            <Image
              src={src}
              alt=""
              width={density === "quadrant" ? 256 : 120}
              height={density === "quadrant" ? 256 : 120}
              className={
                density === "quadrant"
                  ? "aspect-square w-full max-w-[min(100%,16rem)] rounded-xl object-cover sm:max-w-[min(100%,17.5rem)]"
                  : "max-h-[min(100%,7.5rem)] max-w-[min(100%,7.5rem)] rounded-lg object-cover sm:max-h-[min(100%,8rem)] sm:max-w-[min(100%,8rem)]"
              }
            />
          </div>
        ),
        ariaLabel: `Roleplay, hat chosen: ${label}`,
      }
    }
    case "chaos": {
      const skills = outcomes.chaosQ2Skills
      if (skills.length === 0) {
        const line = "Grammar"
        return {
          content:
            density === "quadrant" ? (
              <span className="rounded-full border-2 border-black/25 bg-black/4 px-4 py-2 text-center text-sm font-semibold text-black sm:text-base">
                {line}
              </span>
            ) : (
              <span className="text-balance text-[0.65rem] leading-snug text-black sm:text-xs">{line}</span>
            ),
          ariaLabel: `Chaos, skills selected: ${line}`,
        }
      }
      return {
        content:
          density === "quadrant" ? (
            <div className="flex h-[min(100%,10rem)] w-full min-h-0 max-w-56 items-center justify-center">
              <ChaosSkillsMicroArena skills={skills} className="h-full w-full min-h-0" />
            </div>
          ) : (
            <div className="flex h-full min-h-36 w-full min-w-0 flex-col sm:min-h-42">
              <ChaosSkillsMicroArena skills={skills} className="h-full min-h-0 w-full flex-1" />
            </div>
          ),
        ariaLabel: `Chaos, skills selected: ${skills.join(", ")}`,
      }
    }
  }
}

export type MatchTheFourActivityProps = {
  outcomes: DemoMatchOutcomes
  onContinue?: () => void
  className?: string
}

export function MatchTheFourActivity({ outcomes, onContinue, className }: MatchTheFourActivityProps) {
  const totalPairs = 4

  const [shuffledBoard] = useState(() => ({
    left: shuffleArray(LEFT_DEFS),
    right: defaultRightItems(),
  }))

  const shuffledLeft = shuffledBoard.left
  const orderedRight = shuffledBoard.right

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null)
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<Set<CategoryId>>(() => new Set())
  const [revealedQuadrants, setRevealedQuadrants] = useState<Set<QuadrantId>>(() => new Set())

  const allMatched = matchedIds.size >= totalPairs

  useEffect(() => {
    if (!selectedLeftId || !selectedRightId) return

    const left = shuffledLeft.find((l) => l.id === selectedLeftId)
    const right = orderedRight.find((r) => r.id === selectedRightId)
    if (!left || !right) {
      setSelectedLeftId(null)
      setSelectedRightId(null)
      return
    }

    if (left.matchId === right.matchId) {
      const quadrant = CATEGORY_TO_QUADRANT[left.matchId]!
      setRevealedQuadrants((prev) => {
        const next = new Set(prev)
        next.add(quadrant)
        return next
      })
      setMatchedIds((prev) => {
        const next = new Set(prev)
        next.add(left.matchId)
        return next
      })
      setSelectedLeftId(null)
      setSelectedRightId(null)
      return
    }

    const t = window.setTimeout(() => {
      setSelectedLeftId(null)
      setSelectedRightId(null)
    }, 320)
    return () => window.clearTimeout(t)
  }, [selectedLeftId, selectedRightId, shuffledLeft, orderedRight])

  const toggleLeft = useCallback((id: string) => {
    setSelectedLeftId((prev) => (prev === id ? null : id))
  }, [])

  const toggleRight = useCallback((id: string) => {
    setSelectedRightId((prev) => (prev === id ? null : id))
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (allMatched) return
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, [contenteditable=true]")) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const leftIdx = LEFT_KEY_TO_INDEX[key]
      if (leftIdx !== undefined) {
        const item = shuffledLeft[leftIdx]
        if (!item || matchedIds.has(item.matchId)) return
        event.preventDefault()
        toggleLeft(item.id)
        return
      }
      const rightIdx = RIGHT_KEY_TO_INDEX[key]
      if (rightIdx !== undefined) {
        const item = orderedRight[rightIdx]
        if (!item || matchedIds.has(item.matchId)) return
        event.preventDefault()
        toggleRight(item.id)
        return
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [allMatched, shuffledLeft, orderedRight, matchedIds, toggleLeft, toggleRight])

  return (
    <div className={cn("flex w-full flex-col items-center gap-8", className)}>
      {/* <DemoTwoPaneLayout
        content={
          <div className={MATCH_FOUR_MODEL_FRAME_CLASS}>
            <div className="grid min-w-0 w-full flex-1 grid-cols-2 grid-rows-2 gap-5 justify-items-center">
              {shuffledLeft.map((item, slot) => {
                const slotKey = LEFT_SLOT_KEYS[slot] ?? "?"
                const matched = matchedIds.has(item.matchId)
                const { content: leftContent, ariaLabel } = buildLeftCard(outcomes, item.matchId)
                return (
                  <div key={item.id} className="flex min-w-0 w-full flex-col items-center justify-center">
                    <MatchEmojiCard
                      layout="fluid"
                      content={leftContent}
                      ariaLabel={ariaLabel}
                      matched={matched}
                      selected={!matched && selectedLeftId === item.id}
                      className={MATCH_FOUR_CARD_MAX_CLASS}
                      onClick={matched ? undefined : () => toggleLeft(item.id)}
                      keyHint={slotKey}
                    />
                  </div>
                )
              })}
            </div>

            <div className="grid min-w-0 w-full flex-1 grid-cols-2 grid-rows-2 gap-5 justify-items-center">
              {orderedRight.map((item, slot) => {
                const matched = matchedIds.has(item.matchId)
                const cat = CATEGORY[item.matchId]
                const slotKey = RIGHT_SLOT_KEYS[slot] ?? "?"
                const illustration = <CategoryIllustration matchId={item.matchId} />
                return (
                  <div key={item.id} className="flex min-w-0 w-full flex-col items-center justify-center">
                    <MatchLabelCard
                      layout="fluid"
                      label={item.label}
                      frameClassName={cat.frameClassName}
                      unmatchedLeading={illustration}
                      matched={matched}
                      matchedSurfaceClassName={cat.matchedSurfaceClassName}
                      matchedLeading={undefined}
                      selected={selectedRightId === item.id}
                      className={cn(MATCH_FOUR_CARD_MAX_CLASS, matched ? "invisible pointer-events-none" : undefined)}
                      onClick={matched ? undefined : () => toggleRight(item.id)}
                      keyHint={slotKey}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        }
        model={
          <QuadrantAxesModel
            className="max-w-[620px]"
            mode={revealedQuadrants.size === 0 ? "placeholderHidden" : "matchReveal"}
            revealedQuadrants={revealedQuadrants}
            matchRevealCards={QUADRANT_MATCH_REVEAL_CARDS}
          />
        }
      />

      {allMatched ? (
        <div className="flex w-full max-w-lg flex-col items-center gap-5 px-2 text-center">
          {onContinue ? (
            <button
              type="button"
              className={cn(demoPrimaryCtaNarrowClassName, "max-w-full")}
              onClick={() => onContinue()}
            >
              Continue
            </button>
          ) : null}
        </div>
      ) : null} */}
    </div>
  )
}
