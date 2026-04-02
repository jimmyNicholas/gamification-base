"use client"

import Image from "next/image"
import { useCallback, useEffect, useState, type ReactNode } from "react"

import { ChanceWheelPreview } from "@/components/chance-wheel"
import { MatchEmojiCard, MatchLabelCard } from "@/sections/demo/competition-activity/match-cards"
import { ANIMAL_MATCH_DEMO } from "@/sections/demo/competition-activity/animal-match-demo"
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

type CategoryId = "competition" | "chance" | "roleplay" | "chaos"

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
    <span className="text-[2.75rem] leading-none sm:text-[3.25rem]" aria-hidden>
      {emoji}
    </span>
  )
}

function buildLeftCard(outcomes: DemoMatchOutcomes, matchId: CategoryId): { content: ReactNode; ariaLabel: string } {
  switch (matchId) {
    case "competition": {
      const emoji = outcomes.competitionAnimalEmoji ?? FALLBACK_COMPETITION_ANIMAL
      const line = outcomes.competitionTimeMs != null ? formatMmSs(outcomes.competitionTimeMs) : "0.0"
      return {
        content: (
          <div className="flex min-h-0 w-full flex-col items-center justify-center gap-1">
            <span className="text-[2.5rem] leading-none sm:text-[3rem]" aria-hidden>
              {emoji}
            </span>
            <span className="tabular-nums text-base font-semibold text-black sm:text-lg">{line}</span>
          </div>
        ),
        ariaLabel: `Competition, your time ${line}`,
      }
    }
    case "chance": {
      const line = outcomes.chanceAnswer ?? "Tokyo"
      return {
        content: (
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
          <div className="flex h-full min-h-0 w-full items-center justify-center p-0.5">
            <Image
              src={src}
              alt=""
              width={120}
              height={120}
              className="max-h-[min(100%,7.5rem)] max-w-[min(100%,7.5rem)] rounded-lg object-cover sm:max-h-[min(100%,8rem)] sm:max-w-[min(100%,8rem)]"
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
          content: (
            <span className="text-balance text-[0.65rem] leading-snug text-black sm:text-xs">{line}</span>
          ),
          ariaLabel: `Chaos, skills selected: ${line}`,
        }
      }
      return {
        content: (
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
      <div className="mx-auto flex w-full max-w-4xl flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
        <div className="grid min-w-0 w-full flex-1 grid-cols-2 gap-3 sm:gap-4 lg:justify-items-center">
          {shuffledLeft.map((item, slot) => {
            const slotKey = LEFT_SLOT_KEYS[slot] ?? "?"
            const matched = matchedIds.has(item.matchId)
            const { content: leftContent, ariaLabel } = buildLeftCard(outcomes, item.matchId)
            return (
              <div key={item.id} className="flex flex-col items-center">
                <MatchEmojiCard
                  content={leftContent}
                  ariaLabel={ariaLabel}
                  matched={matched}
                  selected={!matched && selectedLeftId === item.id}
                  onClick={matched ? undefined : () => toggleLeft(item.id)}
                  keyHint={slotKey}
                />
              </div>
            )
          })}
        </div>

        <div className="grid min-w-0 w-full flex-1 grid-cols-2 gap-3 sm:gap-4 lg:justify-items-center">
          {orderedRight.map((item, slot) => {
            const matched = matchedIds.has(item.matchId)
            const cat = CATEGORY[item.matchId]
            const slotKey = RIGHT_SLOT_KEYS[slot] ?? "?"
            const illustration = <CategoryIllustration matchId={item.matchId} />
            return (
              <div key={item.id} className="flex flex-col items-center">
                <MatchLabelCard
                  label={item.label}
                  frameClassName={cat.frameClassName}
                  unmatchedLeading={illustration}
                  matched={matched}
                  matchedSurfaceClassName={cat.matchedSurfaceClassName}
                  matchedLeading={matched ? illustration : undefined}
                  selected={selectedRightId === item.id}
                  onClick={matched ? undefined : () => toggleRight(item.id)}
                  keyHint={slotKey}
                />
              </div>
            )
          })}
        </div>
      </div>

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
      ) : null}
    </div>
  )
}
