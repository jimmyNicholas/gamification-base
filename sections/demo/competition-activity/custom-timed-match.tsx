"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { formatMmSs } from "@/lib/format-mm-ss"
import { DEMO_OUTLINE_BG } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoPanelTitleClassName,
  demoPrimaryCtaConstrainedClassName,
  demoWideContentClassName,
} from "@/sections/demo/demo-ui"
import {
  MATCH_GRID_LEFT_KEY_TO_INDEX as LEFT_KEY_TO_INDEX,
  MATCH_GRID_LEFT_SLOT_KEYS as LEFT_SLOT_KEYS,
  MATCH_GRID_RIGHT_KEY_TO_INDEX as RIGHT_KEY_TO_INDEX,
  MATCH_GRID_RIGHT_SLOT_KEYS as RIGHT_SLOT_KEYS,
} from "@/sections/demo/match-grid-keys"
import { shuffleArray } from "@/sections/demo/shuffle-array"
import { cn } from "@/lib/utils"
import { KeyboardKey } from "@/components/keyboard-key"

import { MatchEmojiCard, MatchLabelCard } from "./match-cards"

export type TimedMatchLeftItem = {
  id: string
  emoji: string
  matchId: string
}

export type TimedMatchRightItem = {
  id: string
  label: string
  matchId: string
}

type CustomTimedMatchProps = {
  /** Main instruction shown above the timer (e.g. "Match the animal with their name"). */
  title: string
  leftItems: TimedMatchLeftItem[]
  rightItems: TimedMatchRightItem[]
  leaderboard: Array<{ name: string; timeMs: number }>
  className?: string
  /** When true, no outer card border/shadow; use on demo-outline full-page (page already provides surface). */
  flatSurface?: boolean
  /** Reserved for later phases when completion unlocks the course shell. */
  unlockSignalId?: string
  /** Called from "Next game" (e.g. advance course phase). `timeMs` is the last completed run when available. */
  onNextGame?: (payload?: { timeMs: number; animalEmoji?: string }) => void
  /** Called when "Play again" is clicked (for tracking replay count). */
  onReplay?: () => void
}

function formatLiveTimer(ms: number) {
  const t = Math.floor(ms / 100)
  const tenth = t % 10
  const sec = Math.floor(t / 10) % 60
  const min = Math.floor(t / 600)
  return `${min}:${String(sec).padStart(2, "0")}.${tenth}`
}

const LEADERBOARD_VISIBLE_ROWS = 5

function pickAnimalEmojiForOutcomes(left: TimedMatchLeftItem[]): string | undefined {
  if (left.length === 0) return undefined
  return left[Math.floor(Math.random() * left.length)]?.emoji
}

export function CustomTimedMatch({
  title,
  leftItems,
  rightItems,
  leaderboard,
  className,
  flatSurface = false,
  unlockSignalId: _unlockSignalId,
  onNextGame,
  onReplay,
}: CustomTimedMatchProps) {
  void _unlockSignalId
  const totalPairs = useMemo(
    () => new Set(leftItems.map((i) => i.matchId)).size,
    [leftItems]
  )

  const [shuffledBoard, setShuffledBoard] = useState(() => ({
    left: shuffleArray(leftItems),
    right: shuffleArray(rightItems),
  }))

  const shuffledLeft = shuffledBoard.left
  const shuffledRight = shuffledBoard.right

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null)
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null)
  const [matchedMatchIds, setMatchedMatchIds] = useState<Set<string>>(() => new Set())

  const timerStartRef = useRef<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [finalTimeMs, setFinalTimeMs] = useState<number | null>(null)
  const lastCompletedTimeMsRef = useRef<number | null>(null)
  /** Stays true after the first full clear so “Next game” stays available after Play again. */
  const [hasEverCompleted, setHasEverCompleted] = useState(false)

  useEffect(() => {
    if (gameComplete) {
      setTimeout(() => {
        setHasEverCompleted(true)
      }, 0)
    }
  }, [gameComplete])

  useEffect(() => {
    if (gameComplete) return
    if (timerStartRef.current !== null) return
    if (!selectedLeftId && !selectedRightId) return
    timerStartRef.current = performance.now()
    setTimeout(() => {
      setTimerRunning(true)
    }, 0)
  }, [selectedLeftId, selectedRightId, gameComplete])

  useEffect(() => {
    if (!timerRunning || gameComplete) return
    let id = 0
    const tick = () => {
      const start = timerStartRef.current
      if (start != null) setElapsedMs(performance.now() - start)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [timerRunning, gameComplete])

  useEffect(() => {
    if (gameComplete) return
    if (matchedMatchIds.size < totalPairs) return
    const start = timerStartRef.current
    const ms = start != null ? performance.now() - start : 0
    setTimeout(() => {
      setFinalTimeMs(ms)
    }, 0)
    lastCompletedTimeMsRef.current = ms
    setTimeout(() => {
      setGameComplete(true)
    }, 0)
    setTimeout(() => {
      setTimerRunning(false)
    }, 0)
    setTimeout(() => {
      setElapsedMs(ms)
    }, 0)
  }, [matchedMatchIds, totalPairs, gameComplete])

  useEffect(() => {
    if (!selectedLeftId || !selectedRightId) return

    const left = leftItems.find((l) => l.id === selectedLeftId)
    const right = rightItems.find((r) => r.id === selectedRightId)
    if (!left || !right) {
      setTimeout(() => {
        setSelectedLeftId(null)
      }, 0)
      setTimeout(() => {
        setSelectedRightId(null)
      }, 0)
      return
    }

    if (left.matchId === right.matchId) {
      setTimeout(() => {
        setMatchedMatchIds((prev) => {
        const next = new Set(prev)
        next.add(left.matchId)
        return next
      })
      }, 0)
      setTimeout(() => {
        setSelectedLeftId(null)
      }, 0)
      setTimeout(() => {
        setSelectedRightId(null)
      }, 0)
      return
    }

    const t = window.setTimeout(() => {
      setTimeout(() => {
        setSelectedLeftId(null)
      }, 0)
      setTimeout(() => {
        setSelectedRightId(null)
      }, 0)
    }, 350)
    return () => window.clearTimeout(t)
  }, [selectedLeftId, selectedRightId, leftItems, rightItems])

  const toggleLeft = useCallback((id: string) => {
    setSelectedLeftId((prev) => (prev === id ? null : id))
  }, [])

  const toggleRight = useCallback((id: string) => {
    setSelectedRightId((prev) => (prev === id ? null : id))
  }, [])

  const playAgain = useCallback(() => {
    onReplay?.()
    setSelectedLeftId(null)
    setSelectedRightId(null)
    setMatchedMatchIds(new Set())
    timerStartRef.current = null
    setTimerRunning(false)
    setElapsedMs(0)
    setGameComplete(false)
    setFinalTimeMs(null)
    /* lastCompletedTimeMsRef kept so mid-run “Next game” can still report last finish time */
    setShuffledBoard({
      left: shuffleArray(leftItems),
      right: shuffleArray(rightItems),
    })
  }, [leftItems, rightItems, onReplay])

  const displayRows = useMemo(() => {
    if (!gameComplete || finalTimeMs == null) return []
    const merged = [...leaderboard, { name: "You", timeMs: finalTimeMs }]
    return merged.sort((a, b) => a.timeMs - b.timeMs).slice(0, LEADERBOARD_VISIBLE_ROWS)
  }, [leaderboard, gameComplete, finalTimeMs])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, [contenteditable=true]")) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      // P key for "Play again" when game is complete
      if (gameComplete && key === 'p') {
        event.preventDefault()
        playAgain()
        return
      }

      // Game keys only work when game is not complete
      if (gameComplete) return

      const leftIdx = LEFT_KEY_TO_INDEX[key]
      if (leftIdx !== undefined) {
        const item = shuffledLeft[leftIdx]
        if (!item || matchedMatchIds.has(item.matchId)) return
        event.preventDefault()
        toggleLeft(item.id)
        return
      }
      const rightIdx = RIGHT_KEY_TO_INDEX[key]
      if (rightIdx !== undefined) {
        const item = shuffledRight[rightIdx]
        if (!item || matchedMatchIds.has(item.matchId)) return
        event.preventDefault()
        toggleRight(item.id)
        return
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [gameComplete, shuffledLeft, shuffledRight, matchedMatchIds, toggleLeft, toggleRight, playAgain])

  const timerText =
    gameComplete && finalTimeMs != null
      ? formatMmSs(finalTimeMs)
      : formatLiveTimer(elapsedMs)

  return (
    <section
      className={cn(
        demoWideContentClassName,
        "text-black",
        flatSurface
          ? "p-0"
          : "rounded-xl border border-black/10 p-4 shadow-sm sm:p-6",
        className
      )}
      style={flatSurface ? undefined : { backgroundColor: DEMO_OUTLINE_BG }}
    >
      {!gameComplete ? (
        <div className="mx-auto flex w-full max-w-4xl flex-row justify-between items-center gap-2 text-center">
          <h2 className={demoActivityHeadingClassName}>{title}</h2>
          <p className="rounded-2xl border border-black bg-white px-5 py-2.5 text-lg font-medium tabular-nums sm:text-xl">
            Timer: {timerText}
          </p>
        </div>
      ) : null}

      {!gameComplete ? (
        <>
          <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-stretch gap-10 sm:max-w-sm md:max-w-sm lg:max-w-4xl xl:max-w-4xl lg:mt-10 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10 xl:gap-14">
            <div className="grid min-w-0 w-full flex-1 grid-cols-2 gap-3 sm:gap-4">
              {shuffledLeft.map((item, slot) => {
                const matched = matchedMatchIds.has(item.matchId)
                const slotKey = LEFT_SLOT_KEYS[slot] ?? "?"
                return (
                  <div key={item.id} className="min-w-0 w-full">
                    <MatchEmojiCard
                      layout="fluid"
                      emoji={item.emoji}
                      matched={matched}
                      selected={selectedLeftId === item.id}
                      onClick={matched ? undefined : () => toggleLeft(item.id)}
                      keyHint={matched ? undefined : slotKey}
                    />
                  </div>
                )
              })}
            </div>

            <div className="grid min-w-0 w-full flex-1 grid-cols-2 gap-3 sm:gap-4">
              {shuffledRight.map((item, slot) => {
                const matched = matchedMatchIds.has(item.matchId)
                const matchedEmoji = leftItems.find((l) => l.matchId === item.matchId)?.emoji
                const slotKey = RIGHT_SLOT_KEYS[slot] ?? "?"
                return (
                  <div key={item.id} className="min-w-0 w-full">
                    <MatchLabelCard
                      layout="fluid"
                      label={item.label}
                      matched={matched}
                      matchedEmoji={matchedEmoji}
                      selected={selectedRightId === item.id}
                      onClick={matched ? undefined : () => toggleRight(item.id)}
                      keyHint={slotKey}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {onNextGame && hasEverCompleted ? (
            <div className="mx-auto mt-10 flex w-full justify-center sm:mt-12">
              <Button
                type="button"
                size="lg"
                className={demoPrimaryCtaConstrainedClassName}
                onClick={() => {
                  const t = finalTimeMs ?? lastCompletedTimeMsRef.current
                  const animalEmoji = pickAnimalEmojiForOutcomes(leftItems)
                  onNextGame?.(t != null ? { timeMs: t, animalEmoji } : undefined)
                }}
              >
                Next game
              </Button>
            </div>
          ) : null}
        </>
      ) : null}

      {gameComplete && finalTimeMs != null ? (
        <div className="mx-auto mt-4 flex w-full max-w-4xl flex-col items-stretch gap-6 px-3 sm:mt-6 sm:gap-8 sm:px-4">
          <div className="flex w-full flex-col items-center justify-center gap-4 text-center sm:flex-row sm:flex-wrap sm:gap-5">
            <h2 className={demoActivityHeadingClassName}>
              Your time is {formatMmSs(finalTimeMs)}. Can you beat it?
            </h2>
            <div className="shrink-0 max-w-[200px]">
            <button type="button" onClick={playAgain} className={cn(demoPrimaryCtaConstrainedClassName, "shrink-0")}>
              Play again <KeyboardKey keyLabel="P" className="ml-2" />
            </button>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
            <div className="flex w-full shrink-0 flex-col border border-black/25 bg-white/60 p-3 text-sm sm:p-4 lg:max-w-[min(100%,22rem)]">
              <p className={demoPanelTitleClassName}>Leaderboard</p>
              <table className="w-full border-collapse text-center text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/20">
                    <th className="py-1.5 pr-2 font-medium">Name</th>
                    <th className="py-1.5 pl-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: LEADERBOARD_VISIBLE_ROWS }, (_, i) => {
                    const row = displayRows[i]
                    if (!row) {
                      return (
                        <tr key={i} className="border-b border-black/10 last:border-0">
                          <td className="py-2 pr-2 text-black/55">—</td>
                          <td className="py-2 pl-2 text-black/55">—</td>
                        </tr>
                      )
                    }
                    const isYou = row.name === "You"
                    return (
                      <tr
                        key={`${row.name}-${row.timeMs}-${i}`}
                        className={cn(
                          "border-b border-black/10 last:border-0",
                          isYou && "bg-amber-50/80 font-semibold"
                        )}
                      >
                        <td className="py-2 pr-2">{row.name}</td>
                        <td className="py-2 pl-2 tabular-nums">{formatMmSs(row.timeMs)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div
              className="mx-auto grid min-h-0 w-full min-w-0 max-w-[min(100%,28rem)] grid-cols-2 justify-items-center gap-3 sm:gap-4"
              aria-label="Completed matches"
            >
              {shuffledRight.map((item) => {
                const matchedEmoji = leftItems.find((l) => l.matchId === item.matchId)?.emoji
                return (
                  <div key={item.id} className="flex w-full justify-center">
                    <MatchLabelCard label={item.label} matched matchedEmoji={matchedEmoji} />
                  </div>
                )
              })}
            </div>
          </div>

          {onNextGame ? (
            <div className="flex w-full justify-center">
              <Button
                type="button"
                size="lg"
                className={demoPrimaryCtaConstrainedClassName}
                onClick={() => {
                  const t = finalTimeMs ?? lastCompletedTimeMsRef.current
                  const animalEmoji = pickAnimalEmojiForOutcomes(leftItems)
                  onNextGame?.(t != null ? { timeMs: t, animalEmoji } : undefined)
                }}
              >
                Next game <KeyboardKey keyLabel="ENTER" className="ml-2" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
