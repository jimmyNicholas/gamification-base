"use client"

import * as React from "react"

import { ChanceCardBack } from "@/components/chance-card-back"
import { ChanceQuadrantPattern } from "@/components/chance-quadrant-pattern"
import { ChanceWheel, getQuadrantColor, type ChanceQuadrant } from "@/components/chance-wheel"
import { buildChanceDeck, type PlayingCard } from "@/sections/demo/chance/chance-deck"
import { resolveCandidateQuestions, type ChanceQuestion } from "@/sections/demo/chance/chance-questions"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
  demoWideContentClassName,
} from "@/sections/demo/demo-ui"
import { Tooltip } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { KeyboardKey } from "@/components/keyboard-key"

type Phase = "picking" | "spinQuestion" | "questionReveal" | "spinAnswer" | "result"

export type CustomChanceEngineProps = {
  className?: string
  unlockSignalId?: string
  /** @deprecated Ignored; the game uses a fixed 16-card playing deck. */
  cards?: { id: string; label: string }[]
  /** When set, the result-screen Continue button calls this instead of reloading the page. */
  onContinueAfterResult?: (payload?: { answer: string; questionNumber: number }) => void
}

const SLOT_ORDER: ChanceQuadrant[] = [1, 2, 3, 4]

/** Prompt treatment shared by question reveal, spin-for-answer, and result. */
const chanceQuestionPromptClass =
  "max-w-3xl text-balance font-sans font-bold leading-[1.12] tracking-tight text-black antialiased text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem]"

const chanceContinueButtonClass = cn(
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName
)

/** Pool backs; ~1.2× prior baseline so the 4×4 reads larger next to the selection grid. */
const poolCardClass =
  "aspect-[5/7] w-[4.08rem] min-w-0 sm:w-[4.35rem] md:w-[4.9rem] lg:w-[4.9rem]"

/** Width breakpoints + portrait aspect; height is derived (not a fixed px). */
const slotShellClass =
  "relative aspect-[5/7] w-[6.5rem] shrink-0 sm:w-[7rem] md:w-[7.75rem] shadow-md"

const slotNumberClass = "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"

const POOL_COLS = 4
const POOL_ROWS = 4
const POOL_SIZE = POOL_COLS * POOL_ROWS

function poolNavigate(index: number, key: string): number {
  const row = Math.floor(index / POOL_COLS)
  const col = index % POOL_COLS
  let nr = row
  let nc = col
  if (key === "ArrowUp" || key === "w" || key === "W") nr = row - 1
  else if (key === "ArrowDown" || key === "s" || key === "S") nr = row + 1
  else if (key === "ArrowLeft" || key === "a" || key === "A") nc = col - 1
  else if (key === "ArrowRight" || key === "d" || key === "D") nc = col + 1
  else return index
  if (nr < 0 || nr >= POOL_ROWS || nc < 0 || nc >= POOL_COLS) return index
  return nr * POOL_COLS + nc
}

function findNextAvailablePoolIndex(start: number, picked: Set<string>, cards: PlayingCard[]): number {
  for (let k = 0; k < POOL_SIZE; k++) {
    const j = (start + k) % POOL_SIZE
    if (!picked.has(cards[j]!.id)) return j
  }
  return start
}

function QuadrantSlotGrid({
  phase,
  pickedCount,
  cardsInSlots,
}: {
  phase: Phase
  pickedCount: number
  cardsInSlots: (PlayingCard | undefined)[]
}) {
  return (
    <div
      className="grid w-max max-w-full grid-cols-2 gap-2 sm:gap-3 md:gap-4"
      aria-label="Selection slots"
    >
      {SLOT_ORDER.map((q, i) => {
        const card = cardsInSlots[i]
        const isFilledPicking = phase === "picking" && i < pickedCount && card
        const isNext = phase === "picking" && i === pickedCount && pickedCount < 4
        const isFuture = phase === "picking" && i > pickedCount
        const showBack = card && (isFilledPicking || (phase !== "picking" && phase !== "questionReveal"))

        return (
          <div
            key={q}
            className={cn(
              "flex min-h-0 flex-col items-center justify-center rounded-lg p-1.5",
              isFuture && "border border-dashed border-black/20 bg-white/60"
            )}
          >
            {showBack ? (
              <div className={cn(slotShellClass, "pointer-events-none")}>
                {phase === "spinQuestion" ? (
                  <ChanceQuadrantPattern quadrant={q} className="size-full min-h-0" />
                ) : (
                  <ChanceCardBack className="size-full min-h-0" />
                )}
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]",
                    slotNumberClass,
                    isFilledPicking ? "text-white" : "text-white/95"
                  )}
                >
                  {q}
                </span>
              </div>
            ) : null}
            {isNext ? (
              <div
                className={cn(
                  slotShellClass,
                  "flex flex-col items-center justify-center rounded-md border border-black/25 bg-white shadow-none"
                )}
              >
                <span className={cn(slotNumberClass, "text-black/60")}>{q}</span>
              </div>
            ) : null}
            {isFuture ? (
              <div className={cn(slotShellClass, "flex items-center justify-center shadow-none")}>
                <span className={cn(slotNumberClass, "text-black/20")}>{q}</span>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function CustomChanceEngine({ className, unlockSignalId, onContinueAfterResult }: CustomChanceEngineProps) {
  const deck = React.useMemo(() => buildChanceDeck(), [])
  const deckById = React.useMemo(() => new Map(deck.map((c) => [c.id, c])), [deck])

  const [phase, setPhase] = React.useState<Phase>("picking")
  const [pickedIds, setPickedIds] = React.useState<string[]>([])
  const [candidates, setCandidates] = React.useState<ChanceQuestion[] | null>(null)
  const [questionQ, setQuestionQ] = React.useState<ChanceQuadrant | null>(null)
  const [answerQ, setAnswerQ] = React.useState<ChanceQuadrant | null>(null)

  const poolInstructionsId = React.useId()
  const rawPoolId = React.useId()
  const poolDomId = `chance-pool-${rawPoolId.replace(/:/g, "")}`
  const poolGridRef = React.useRef<HTMLDivElement>(null)
  const [focusedPoolIndex, setFocusedPoolIndex] = React.useState(0)
  const focusedPoolIndexRef = React.useRef(0)
  const [poolHasFocus, setPoolHasFocus] = React.useState(false)

  React.useEffect(() => {
    focusedPoolIndexRef.current = focusedPoolIndex
  }, [focusedPoolIndex])

  const didAutoFocusPool = React.useRef(false)
  React.useEffect(() => {
    if (phase !== "picking" || didAutoFocusPool.current) return
    didAutoFocusPool.current = true
    setFocusedPoolIndex(0)
    focusedPoolIndexRef.current = 0
    const id = requestAnimationFrame(() => {
      poolGridRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [phase])

  const pickedSet = React.useMemo(() => new Set(pickedIds), [pickedIds])

  const cardsInSlots: (PlayingCard | undefined)[] = SLOT_ORDER.map((_, i) => {
    const id = pickedIds[i]
    return id ? deckById.get(id) : undefined
  })

  const complete = phase === "result" && answerQ !== null

  React.useEffect(() => {
    if (!complete || !unlockSignalId) return
    window.dispatchEvent(new Event(`course-shell:unlock:${unlockSignalId}`))
  }, [complete, unlockSignalId])

  React.useEffect(() => {
    if (phase !== "questionReveal") return
    const t = window.setTimeout(() => setPhase("spinAnswer"), 2000)
    return () => window.clearTimeout(t)
  }, [phase])

  const pickCard = React.useCallback(
    (id: string) => {
      if (phase !== "picking" || pickedIds.length >= 4 || pickedSet.has(id)) return
      const next = [...pickedIds, id]
      const nextSet = new Set(next)
      setPickedIds(next)
      const pickedIdx = deck.findIndex((c) => c.id === id)
      if (pickedIdx >= 0) {
        setFocusedPoolIndex(findNextAvailablePoolIndex(pickedIdx + 1, nextSet, deck))
      }
      if (next.length === 4) {
        const c = resolveCandidateQuestions(next as [string, string, string, string])
        setCandidates(c)
        setPhase("spinQuestion")
      }
    },
    [phase, pickedIds, pickedSet, deck]
  )

  const onPoolKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (phase !== "picking") return
      const navKeys = new Set([
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "W",
        "s",
        "S",
        "a",
        "A",
        "d",
        "D",
      ])
      if (navKeys.has(e.key)) {
        e.preventDefault()
        setFocusedPoolIndex((prev) => poolNavigate(prev, e.key))
        return
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const idx = focusedPoolIndexRef.current
        const card = deck[idx]
        if (card && !pickedSet.has(card.id) && pickedIds.length < 4) {
          pickCard(card.id)
        }
      }
    },
    [phase, deck, pickedSet, pickedIds.length, pickCard]
  )

  const onQuestionSpin = React.useCallback((q: ChanceQuadrant) => {
    setQuestionQ(q)
    setPhase("questionReveal")
  }, [])

  const onAnswerSpin = React.useCallback((a: ChanceQuadrant) => {
    setAnswerQ(a)
    setPhase("result")
  }, [])

  const activeQuestion =
    candidates && questionQ !== null ? candidates[questionQ - 1] ?? null : null
  const choiceIndex = answerQ !== null ? answerQ - 1 : null
  const selectedChoice =
    activeQuestion !== null && choiceIndex !== null && choiceIndex >= 0 && choiceIndex < 4
      ? activeQuestion.choices[choiceIndex]
      : null

  const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"]

  let title = "Choose four cards"
  let showSpinInstructions = false
  if (phase === "spinQuestion") {
    title = "Spin for your question"
    showSpinInstructions = true
  } else if (phase === "questionReveal") {
    title = "Your question"
  } else if (phase === "spinAnswer") {
    title = "Spin for your answer"
    showSpinInstructions = true
  } else if (phase === "result") {
    title = ""
  }

  const handleContinue = React.useCallback(() => {
    if (phase !== "result") return
    onContinueAfterResult
      ? onContinueAfterResult(selectedChoice && questionQ ? { answer: selectedChoice, questionNumber: questionQ } : undefined)
      : window.location.reload()
  }, [phase, onContinueAfterResult, selectedChoice, questionQ])

  // Enable Enter/Spacebar for Continue button in result phase
  useKeyboardNavigation({
    onSubmit: phase === "result" ? handleContinue : undefined,
  })

  return (
    <section className={cn(demoWideContentClassName, "text-slate-900", className)}>
      <div className="mb-8 flex flex-col items-center gap-2">
        <h2
          className={cn(
            "text-center font-semibold tracking-tight text-black",
            phase === "result" ? "mb-10 text-2xl sm:mb-12 sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          {title}
        </h2>
        {showSpinInstructions && (
          <p className="text-sm text-black/70 text-center">
            Press Space or Enter to spin
          </p>
        )}
      </div>

      {phase === "picking" ? (
        <div className="flex flex-col items-center justify-center gap-10 pb-2 sm:flex-row lg:items-stretch lg:justify-center lg:gap-16">
          {/* 4×4 row-major — matches deck[] order; no rotation / transform */}
          <div className="flex min-h-[20rem] min-w-0 shrink-0 flex-col items-center justify-center gap-3 self-stretch sm:min-h-[22rem] lg:min-h-0">
            <p id={poolInstructionsId} className="text-sm text-black/70 text-center mt-2">
              Use arrow keys or W A S D to move. Press Enter or Space to select a card.
            </p>
            <div
              ref={poolGridRef}
              id={poolDomId}
              role="grid"
              aria-label="Card pool"
              aria-describedby={poolInstructionsId}
              aria-activedescendant={
                poolHasFocus ? `${poolDomId}-cell-${focusedPoolIndex}` : undefined
              }
              tabIndex={0}
              className="rounded-md outline-none"
              onKeyDown={onPoolKeyDown}
              onFocus={() => setPoolHasFocus(true)}
              onBlur={(ev) => {
                if (!ev.currentTarget.contains(ev.relatedTarget as Node)) setPoolHasFocus(false)
              }}
            >
              <div className="grid grid-cols-4 gap-2">
                {deck.map((card, i) => {
                  const taken = pickedSet.has(card.id)
                  const isActive = poolHasFocus && focusedPoolIndex === i
                  return (
                    <button
                      key={card.id}
                      id={`${poolDomId}-cell-${i}`}
                      type="button"
                      role="gridcell"
                      tabIndex={-1}
                      aria-disabled={taken || pickedIds.length >= 4}
                      disabled={taken || pickedIds.length >= 4}
                      onMouseDown={(ev) => {
                        ev.preventDefault()
                      }}
                      onClick={() => {
                        poolGridRef.current?.focus()
                        setFocusedPoolIndex(i)
                        pickCard(card.id)
                      }}
                      className={cn(
                        poolCardClass,
                        "min-w-0 overflow-hidden transition-transform",
                        !taken && pickedIds.length < 4 && "cursor-pointer hover:z-10 hover:scale-[1.02] active:scale-100",
                        pickedIds.length >= 4 && !taken && "opacity-35",
                        isActive && "z-10 ring-2 ring-blue-600 ring-offset-2 ring-offset-[#EEF8F3]"
                      )}
                    >
                      {!taken ? (
                        <ChanceCardBack className="size-full min-h-0" />
                      ) : (
                        <span className="flex size-full min-h-0 items-center justify-center rounded-md border-2 border-black/20 bg-white">
                          <span className="sr-only">Removed</span>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center self-stretch opacity-90 lg:pl-4">
            <QuadrantSlotGrid phase={phase} pickedCount={pickedIds.length} cardsInSlots={cardsInSlots} />
          </div>
        </div>
      ) : null}

      {phase === "spinQuestion" ? (
        <div
          className={cn(
            "grid w-full min-h-0 grid-cols-1 items-center justify-center gap-10 pb-2",
            "lg:min-h-88 xl:min-h-104 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:items-stretch lg:gap-8 xl:gap-10"
          )}
        >
          <div className="flex min-h-0 w-full flex-col items-center justify-center self-stretch opacity-90">
            <QuadrantSlotGrid phase={phase} pickedCount={4} cardsInSlots={cardsInSlots} />
          </div>
          <div className="flex h-full min-h-64 w-full min-w-0 flex-col items-center justify-center gap-2 self-stretch lg:min-h-0">
            <ChanceWheel
              key="spin-q"
              disabled={false}
              onComplete={onQuestionSpin}
              ariaLabel="Spin for your question"
              labelType="numbers"
            />
          </div>
        </div>
      ) : null}

      {phase === "questionReveal" && activeQuestion ? (
        <div className="flex min-h-[18rem] flex-col items-center justify-center px-4 pb-8 text-center sm:min-h-[22rem]">
          <p className={cn(chanceQuestionPromptClass, "mx-auto drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]")}>
            {activeQuestion.prompt}
          </p>
        </div>
      ) : null}

      {phase === "spinAnswer" && activeQuestion ? (
        <div className="flex w-full flex-col gap-8 lg:gap-10">
          <p className={cn(chanceQuestionPromptClass, "w-full text-center lg:max-w-none")}>
            {activeQuestion.prompt}
          </p>
          <div className="grid min-h-0 w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:items-stretch lg:gap-8 xl:gap-10 lg:h-80 xl:h-96">
            <ol
              className="mx-auto grid min-h-[17.5rem] w-full max-w-md list-none grid-cols-2 grid-rows-2 gap-3 sm:min-h-[19rem] sm:gap-4 lg:mx-0 lg:h-full lg:min-h-0 lg:max-w-none"
              aria-label="Answer choices"
            >
              {activeQuestion.choices.map((text, idx) => {
                const qn = (idx + 1) as ChanceQuadrant
                return (
                  <li
                    key={idx}
                    className="flex h-full min-h-[6.5rem] items-center justify-center rounded-xl border-2 border-black/80 px-3 py-3 text-center shadow-md sm:min-h-[7.25rem] lg:min-h-0"
                    style={{ backgroundColor: getQuadrantColor(qn) }}
                  >
                    <span className="text-balance text-base font-semibold leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] sm:text-lg md:text-xl">
                      <span className="tabular-nums">{letters[idx]}.</span> {text}
                    </span>
                  </li>
                )
              })}
            </ol>
            <div className="flex min-h-0 w-full min-w-0 flex-col items-center justify-center gap-2">
              <ChanceWheel
                key="spin-a"
                className="min-h-0 w-full max-w-[19rem] lg:max-w-full"
                disabled={false}
                onComplete={onAnswerSpin}
                ariaLabel="Spin for your answer"
                labelType="letters"
              />
            </div>
          </div>
        </div>
      ) : null}

      {phase === "result" && activeQuestion ? (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 px-4 text-center sm:gap-10 md:gap-12">
          <p className={cn(chanceQuestionPromptClass, "mx-auto")}>{activeQuestion.prompt}</p>
          {selectedChoice ? (
            <div className="w-full max-w-xl px-4 py-6 sm:px-10 sm:py-4 md:py-8">
              <p className="text-balance text-xl font-semibold leading-snug text-black sm:text-2xl md:text-3xl">
                {selectedChoice}
              </p>
            </div>
          ) : null}
          <Tooltip.Provider delay={250}>
            <Tooltip.Root>
              <Tooltip.Trigger
                className={chanceContinueButtonClass}
                onClick={handleContinue}
              >
                Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner side="bottom" sideOffset={10}>
                  <Tooltip.Popup className="max-w-xs rounded-lg border border-black/20 bg-zinc-900 px-3 py-2 text-left text-sm leading-snug text-white shadow-lg">
                    I promise this will all make sense soon!
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      ) : null}
    </section>
  )
}
