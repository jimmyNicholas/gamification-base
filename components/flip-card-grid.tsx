"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type FlipCard = {
  id: string
  front: string
  back: string
}

type FlipCardGridProps = {
  cards: FlipCard[]
  storageKey: string
  className?: string
}

export function FlipCardGrid({ cards, storageKey, className }: FlipCardGridProps) {
  const [flipped, setFlipped] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    try {
      const existing = window.sessionStorage.getItem(storageKey)
      if (existing) {
        setFlipped(JSON.parse(existing) as Record<string, boolean>)
      }
    } catch {
      // Ignore non-blocking persistence errors.
    }
  }, [storageKey])

  const toggle = (id: string) => {
    setFlipped((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // Ignore non-blocking persistence errors.
      }
      return next
    })
  }

  return (
    <section className={cn("rounded-xl border border-white/15 bg-black/25 p-4 text-white/90", className)}>
      <p className="mb-3 text-xs tracking-[0.14em] uppercase text-white/65">Flip Cards</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const isFlipped = Boolean(flipped[card.id])
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => toggle(card.id)}
              className="rounded-lg border border-white/20 bg-black/20 p-4 text-left transition hover:bg-black/30 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
              aria-pressed={isFlipped}
            >
              <p className="text-sm font-medium text-white">{isFlipped ? card.back : card.front}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
