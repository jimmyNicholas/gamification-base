"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type CustomChaosSelectorProps = {
  words: string[]
  className?: string
  unlockSignalId?: string
}

export function CustomChaosSelector({ words, className, unlockSignalId }: CustomChaosSelectorProps) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [order, setOrder] = React.useState<string[]>([])
  const [phase, setPhase] = React.useState<"pick" | "order">("pick")
  const [timer, setTimer] = React.useState(15)

  React.useEffect(() => {
    if (phase !== "pick") return
    if (timer <= 0) {
      if (selected.length === 4) setPhase("order")
      return
    }
    const id = window.setTimeout(() => setTimer((prev) => prev - 1), 1000)
    return () => window.clearTimeout(id)
  }, [phase, timer, selected.length])

  React.useEffect(() => {
    if (selected.length === 4 && phase === "pick") {
      setPhase("order")
      setOrder(selected)
      setTimer(10)
    }
  }, [selected, phase])

  React.useEffect(() => {
    if (phase !== "order") return
    if (timer <= 0 || order.length === 4) {
      if (unlockSignalId) {
        window.dispatchEvent(new Event(`course-shell:unlock:${unlockSignalId}`))
      }
      return
    }
    const id = window.setTimeout(() => setTimer((prev) => prev - 1), 1000)
    return () => window.clearTimeout(id)
  }, [phase, timer, order, unlockSignalId])

  const toggle = (word: string) => {
    setSelected((prev) => {
      if (prev.includes(word)) return prev.filter((value) => value !== word)
      if (prev.length >= 4) return prev
      return [...prev, word]
    })
  }

  const move = (from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  return (
    <section className={cn("rounded-xl border border-white/15 bg-black/25 p-4 text-white/90", className)}>
      <h3 className="text-lg font-semibold text-white">Chaos Selector</h3>
      <p className="mt-1 text-sm text-white/75">
        {phase === "pick"
          ? `Pick exactly four words. Time left: ${timer}s`
          : `Order your four words by priority. Time left: ${timer}s`}
      </p>

      {phase === "pick" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {words.map((word) => {
            const isSelected = selected.includes(word)
            return (
              <button
                key={word}
                type="button"
                onClick={() => toggle(word)}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  isSelected
                    ? "border-emerald-300 bg-emerald-500/20 text-white"
                    : "border-white/20 bg-white/5 text-white/85 hover:bg-white/10"
                )}
              >
                {word}
              </button>
            )
          })}
        </div>
      ) : (
        <ol className="mt-3 space-y-2">
          {order.map((word, index) => (
            <li key={word} className="flex items-center justify-between rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm">
              <span>
                {index + 1}. {word}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded border border-white/20 px-2 py-0.5 text-xs"
                  onClick={() => index > 0 && move(index, index - 1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded border border-white/20 px-2 py-0.5 text-xs"
                  onClick={() => index < order.length - 1 && move(index, index + 1)}
                >
                  Down
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
