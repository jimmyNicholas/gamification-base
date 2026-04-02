"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Axis = "horizontal" | "vertical"
type Zone = "left" | "right" | "top" | "bottom"

export type HotspotAxisSituation = {
  id: string
  text: string
  correctZone: Zone
  feedbackCorrect: string
  feedbackIncorrect: string
}

type HotspotAxisQuizProps = {
  axis: Axis
  situations: HotspotAxisSituation[]
  onComplete?: () => void
  unlockSignalId?: string
  className?: string
}

type SituationResult = {
  answered: boolean
  selectedZone?: Zone
  isCorrect?: boolean
  feedback?: string
}

const SESSION_KEY_PREFIX = "hotspot-axis-order:"

function isAxisZoneCompatible(axis: Axis, zone: Zone): boolean {
  if (axis === "horizontal") {
    return zone === "left" || zone === "right"
  }
  return zone === "top" || zone === "bottom"
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function getRandomizedSituationOrder(axis: Axis, situations: HotspotAxisSituation[]) {
  const sessionStorageKey = `${SESSION_KEY_PREFIX}${axis}:${situations.map((s) => s.id).join("|")}`

  if (typeof window === "undefined") {
    return situations
  }

  try {
    const existing = window.sessionStorage.getItem(sessionStorageKey)
    if (existing) {
      const storedIds = JSON.parse(existing) as string[]
      const byId = new Map(situations.map((s) => [s.id, s]))
      const ordered = storedIds.map((id) => byId.get(id)).filter((s): s is HotspotAxisSituation => Boolean(s))

      if (ordered.length === situations.length) {
        return ordered
      }
    }
  } catch {
    // If session storage fails, continue with in-memory randomization.
  }

  const randomized = shuffle(situations)
  try {
    window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(randomized.map((s) => s.id)))
  } catch {
    // Non-blocking: still allow quiz without persisted session order.
  }
  return randomized
}

export function HotspotAxisQuiz({
  axis,
  situations,
  onComplete,
  unlockSignalId,
  className,
}: HotspotAxisQuizProps) {
  const [orderedSituations, setOrderedSituations] = React.useState<HotspotAxisSituation[]>(situations)

  const [resultsById, setResultsById] = React.useState<Record<string, SituationResult>>({})
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const answeredCount = React.useMemo(
    () => orderedSituations.filter((s) => resultsById[s.id]?.answered).length,
    [orderedSituations, resultsById]
  )

  const allAnswered = orderedSituations.length > 0 && answeredCount === orderedSituations.length
  React.useEffect(() => {
    if (!allAnswered || !unlockSignalId) return
    window.dispatchEvent(new Event(`course-shell:unlock:${unlockSignalId}`))
  }, [allAnswered, unlockSignalId])

  const currentSituation = orderedSituations[currentIndex]
  const currentResult = currentSituation ? resultsById[currentSituation.id] : undefined

  React.useEffect(() => {
    setOrderedSituations(getRandomizedSituationOrder(axis, situations))
  }, [axis, situations])

  React.useEffect(() => {
    setResultsById({})
    setCurrentIndex(0)
  }, [axis, orderedSituations, situations])

  const moveToNextUnanswered = React.useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = orderedSituations.findIndex((s, index) => index > prev && !resultsById[s.id]?.answered)
      if (nextIndex !== -1) {
        return nextIndex
      }
      const firstUnanswered = orderedSituations.findIndex((s) => !resultsById[s.id]?.answered)
      return firstUnanswered === -1 ? prev : firstUnanswered
    })
  }, [orderedSituations, resultsById])

  const handleZoneSelect = React.useCallback(
    (zone: Zone) => {
      if (!currentSituation || currentResult?.answered) return
      if (!isAxisZoneCompatible(axis, zone)) return

      const isCorrect = zone === currentSituation.correctZone

      setResultsById((prev) => ({
        ...prev,
        [currentSituation.id]: {
          answered: isCorrect,
          selectedZone: zone,
          isCorrect,
          feedback: isCorrect ? currentSituation.feedbackCorrect : currentSituation.feedbackIncorrect,
        },
      }))

      if (isCorrect) {
        window.setTimeout(moveToNextUnanswered, 350)
      }
    },
    [axis, currentSituation, currentResult?.answered, moveToNextUnanswered]
  )

  const statusText = allAnswered
    ? "All situations answered."
    : `Answered ${answeredCount} of ${orderedSituations.length}.`

  return (
    <section className={cn("rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm", className)}>
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.14em] uppercase text-muted-foreground">Hotspot Axis Quiz</p>
        <p className="mt-1 text-sm text-muted-foreground">{statusText}</p>
      </header>

      {currentSituation ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm leading-relaxed">
            {currentSituation.text}
          </p>

          <div className="relative mx-auto aspect-square w-full max-w-md rounded-xl border border-border bg-background">
            <div className="grid h-full grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-border/70" />
              <div className="border-b border-border/70" />
              <div className="border-r border-border/70" />
              <div />
            </div>

            <div
              className={cn(
                "pointer-events-none absolute left-1/2 top-3 bottom-3 w-1 -translate-x-1/2 rounded-full transition-colors",
                axis === "vertical" ? "bg-[#7b4a12]" : "bg-muted"
              )}
              aria-hidden
            />
            <div
              className={cn(
                "pointer-events-none absolute top-1/2 left-3 right-3 h-1 -translate-y-1/2 rounded-full transition-colors",
                axis === "horizontal" ? "bg-[#5b2dd6]" : "bg-muted"
              )}
              aria-hidden
            />

            <p className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              Self-intact
            </p>
            <p className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              Self-dissolved
            </p>
            <p className="pointer-events-none absolute top-1/2 -left-10 -translate-y-1/2 text-xs text-muted-foreground">
              Agency
            </p>
            <p className="pointer-events-none absolute top-1/2 -right-6 -translate-y-1/2 text-xs text-muted-foreground">
              Fate
            </p>

            {axis === "horizontal" ? (
              <>
                <button
                  type="button"
                  onClick={() => handleZoneSelect("left")}
                  disabled={Boolean(currentResult?.answered)}
                  className={cn(
                    "absolute left-0 right-1/2 top-0 bottom-0 rounded-l-xl border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentResult?.selectedZone === "left" && currentResult?.isCorrect
                      ? "border-emerald-500 bg-emerald-500/15"
                      : "hover:bg-primary/10"
                  )}
                  aria-label="Select Agency side"
                />
                <button
                  type="button"
                  onClick={() => handleZoneSelect("right")}
                  disabled={Boolean(currentResult?.answered)}
                  className={cn(
                    "absolute left-1/2 right-0 top-0 bottom-0 rounded-r-xl border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentResult?.selectedZone === "right" && currentResult?.isCorrect
                      ? "border-emerald-500 bg-emerald-500/15"
                      : "hover:bg-primary/10"
                  )}
                  aria-label="Select Fate side"
                />
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleZoneSelect("top")}
                  disabled={Boolean(currentResult?.answered)}
                  className={cn(
                    "absolute left-0 right-0 top-0 bottom-1/2 rounded-t-xl border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentResult?.selectedZone === "top" && currentResult?.isCorrect
                      ? "border-emerald-500 bg-emerald-500/15"
                      : "hover:bg-primary/10"
                  )}
                  aria-label="Select Self-intact side"
                />
                <button
                  type="button"
                  onClick={() => handleZoneSelect("bottom")}
                  disabled={Boolean(currentResult?.answered)}
                  className={cn(
                    "absolute left-0 right-0 top-1/2 bottom-0 rounded-b-xl border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentResult?.selectedZone === "bottom" && currentResult?.isCorrect
                      ? "border-emerald-500 bg-emerald-500/15"
                      : "hover:bg-primary/10"
                  )}
                  aria-label="Select Self-dissolved side"
                />
              </>
            )}
          </div>

          {currentResult?.feedback ? (
            <p className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              {currentResult.feedback}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No situations configured.</p>
      )}

      <footer className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {axis === "horizontal" ? "Horizontal axis active" : "Vertical axis active"}.
        </p>
        <Button onClick={onComplete} disabled={!allAnswered || !onComplete}>
          Continue
        </Button>
      </footer>
    </section>
  )
}
