"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SourceItem = {
  id: string
  label: string
}

type TargetItem = {
  id: string
  label: string
}

type MatchAssignBoardProps = {
  sources: SourceItem[]
  targets: TargetItem[]
  answers: Record<string, string>
  className?: string
  unlockSignalId?: string
}

export function MatchAssignBoard({
  sources,
  targets,
  answers,
  className,
  unlockSignalId,
}: MatchAssignBoardProps) {
  const [assignments, setAssignments] = React.useState<Record<string, string>>({})
  const [feedback, setFeedback] = React.useState<string>("")
  const allPlaced = sources.every((source) => assignments[source.id])
  const allCorrect = allPlaced && sources.every((source) => answers[source.id] === assignments[source.id])

  React.useEffect(() => {
    if (!allCorrect || !unlockSignalId) return
    window.dispatchEvent(new Event(`course-shell:unlock:${unlockSignalId}`))
  }, [allCorrect, unlockSignalId])

  const assign = (sourceId: string, targetId: string) => {
    setAssignments((prev) => ({ ...prev, [sourceId]: targetId }))
  }

  const check = () => {
    if (!allPlaced) {
      setFeedback("Place all cards before checking.")
      return
    }
    setFeedback(allCorrect ? "Great match. Continue is now unlocked." : "Not quite. Try adjusting some matches.")
  }

  return (
    <section className={cn("rounded-xl border border-white/15 bg-black/25 p-4 text-white/90", className)}>
      <p className="mb-3 text-xs tracking-[0.14em] uppercase text-white/65">Match Assign Board</p>
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.id} className="flex flex-col gap-2 rounded-lg border border-white/15 bg-black/20 p-3 sm:flex-row sm:items-center">
            <p className="min-w-52 text-sm text-white">{source.label}</p>
            <div className="flex flex-wrap gap-2">
              {targets.map((target) => {
                const selected = assignments[source.id] === target.id
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => assign(source.id, target.id)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs transition focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none",
                      selected
                        ? "border-emerald-300 bg-emerald-500/20 text-white"
                        : "border-white/25 bg-white/5 text-white/85 hover:bg-white/10"
                    )}
                  >
                    {target.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button onClick={check}>Check matches</Button>
        {feedback ? <p className="text-sm text-white/75">{feedback}</p> : null}
      </div>
    </section>
  )
}
