"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ScenarioChoice = {
  id: string
  label: string
  nextStepId: string
}

type ScenarioStep = {
  id: string
  text: string
  choices: ScenarioChoice[]
}

type ScenarioFlowProps = {
  steps: ScenarioStep[]
  startStepId: string
  className?: string
}

export function ScenarioFlow({ steps, startStepId, className }: ScenarioFlowProps) {
  const byId = React.useMemo(() => new Map(steps.map((step) => [step.id, step])), [steps])
  const [currentId, setCurrentId] = React.useState(startStepId)
  const [history, setHistory] = React.useState<string[]>([])
  const current = byId.get(currentId)

  if (!current) {
    return <p className="text-sm text-white/75">Scenario configuration is invalid.</p>
  }

  return (
    <section className={cn("rounded-xl border border-white/15 bg-black/25 p-4 text-white/90", className)}>
      <p className="text-xs tracking-[0.14em] uppercase text-white/65">Scenario Flow</p>
      <p className="mt-2 rounded-lg border border-white/15 bg-black/20 p-3 text-sm leading-relaxed text-white">{current.text}</p>
      <div className="mt-3 grid gap-2">
        {current.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            onClick={() => {
              setHistory((prev) => [...prev, `${current.id}:${choice.id}`])
              setCurrentId(choice.nextStepId)
            }}
          >
            {choice.label}
          </button>
        ))}
      </div>
      {history.length > 0 ? (
        <p className="mt-3 text-xs text-white/65">Choices made: {history.length}</p>
      ) : null}
    </section>
  )
}
