"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Quadrant = "Q1" | "Q2" | "Q3" | "Q4"

type Scenario = {
  id: string
  prompt: string
  bestQuadrant: Quadrant
  consequences: Record<Quadrant, string>
}

type HotspotQuadrantQuizProps = {
  scenarios: Scenario[]
  className?: string
  unlockSignalId?: string
}

const labels: Record<Quadrant, string> = {
  Q1: "High agency + self-intact",
  Q2: "High agency + self-dissolved",
  Q3: "High fate + self-intact",
  Q4: "High fate + self-dissolved",
}

export function HotspotQuadrantQuiz({ scenarios, className, unlockSignalId }: HotspotQuadrantQuizProps) {
  const [index, setIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<Quadrant | null>(null)
  const [completed, setCompleted] = React.useState<Record<string, Quadrant>>({})

  const scenario = scenarios[index]
  const allDone = scenarios.length > 0 && Object.keys(completed).length === scenarios.length

  React.useEffect(() => {
    if (!allDone || !unlockSignalId) return
    window.dispatchEvent(new Event(`course-shell:unlock:${unlockSignalId}`))
  }, [allDone, unlockSignalId])

  if (!scenario) {
    return <p className="text-sm text-white/75">No scenarios configured.</p>
  }

  const submit = () => {
    if (!choice) return
    setCompleted((prev) => ({ ...prev, [scenario.id]: choice }))
  }

  const next = () => {
    setChoice(null)
    setIndex((prev) => Math.min(prev + 1, scenarios.length - 1))
  }

  const selected = completed[scenario.id] ?? choice
  const showFeedback = Boolean(completed[scenario.id] && selected)

  return (
    <section className={cn("rounded-xl border border-white/15 bg-black/25 p-4 text-white/90", className)}>
      <p className="text-xs tracking-[0.14em] uppercase text-white/65">Application Grid</p>
      <p className="mt-2 text-sm leading-relaxed text-white">{scenario.prompt}</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(Object.keys(labels) as Quadrant[]).map((quadrant) => {
          const isSelected = selected === quadrant
          return (
            <button
              key={quadrant}
              type="button"
              className={cn(
                "rounded-md border p-3 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none",
                isSelected
                  ? "border-emerald-300 bg-emerald-500/20 text-white"
                  : "border-white/20 bg-white/5 text-white/85 hover:bg-white/10"
              )}
              onClick={() => !completed[scenario.id] && setChoice(quadrant)}
            >
              {labels[quadrant]}
            </button>
          )
        })}
      </div>

      {showFeedback && selected ? (
        <p className="mt-3 rounded-lg border border-white/15 bg-black/20 p-3 text-sm text-white/80">
          {scenario.consequences[selected]}
        </p>
      ) : null}

      <div className="mt-3 flex gap-2">
        <Button onClick={submit} disabled={!choice || Boolean(completed[scenario.id])}>
          Submit choice
        </Button>
        <Button
          variant="outline"
          className="border-white/25 bg-white/5 text-white hover:bg-white/10"
          onClick={next}
          disabled={!completed[scenario.id] || index === scenarios.length - 1}
        >
          Next situation
        </Button>
      </div>
      {allDone ? <p className="mt-2 text-sm text-emerald-300">All scenarios completed. Continue is unlocked.</p> : null}
    </section>
  )
}
