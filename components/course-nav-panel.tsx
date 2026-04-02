"use client"

import { useState } from "react"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Dices,
  Layers,
  LayoutGrid,
  LayoutList,
  Sparkles,
  Trophy,
  Video,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type CoursePhase =
  | "intro"
  | "demoOutline"
  | "competitionActivity"
  | "chance"
  | "mimicry"
  | "chaos"
  | "matchTheFour"
  | "recognition"
  | "videoGrounding"
  | "book"
  | "axisAgencyFate"
  | "axisSelfIntactDissolved"
  | "axesAssessment"
  | "reflection"

const NAV_ITEMS: {
  phase: CoursePhase
  label: string
  Icon: typeof BookOpen
}[] = [
  { phase: "intro", label: "Intro", Icon: BookOpen },
  { phase: "demoOutline", label: "Outline", Icon: LayoutList },
  { phase: "competitionActivity", label: "Activity", Icon: Trophy },
  { phase: "chance", label: "Chance", Icon: Dices },
  { phase: "mimicry", label: "Mimicry", Icon: Copy },
  { phase: "chaos", label: "Chaos", Icon: Sparkles },
  {
    phase: "matchTheFour",
    label: "2.6 — Match the Four",
    Icon: LayoutGrid,
  },
  {
    phase: "recognition",
    label: "Recognition",
    Icon: Layers,
  },
  {
    phase: "videoGrounding",
    label: "2.7 — Video Grounding",
    Icon: Video,
  },
  { phase: "book", label: "Book (Quadrants)", Icon: LayoutGrid },
  { phase: "axisAgencyFate", label: "Agency ↔ Fate", Icon: Dices },
  { phase: "axisSelfIntactDissolved", label: "Self-intact ↔ Dissolved", Icon: Copy },
  { phase: "axesAssessment", label: "A+ Assessment", Icon: Trophy },
  { phase: "reflection", label: "Reflection", Icon: LayoutList },
]

type CourseNavPanelProps = {
  phase: CoursePhase
  onNavigate: (phase: CoursePhase) => void
}

export function CourseNavPanel({ phase, onNavigate }: CourseNavPanelProps) {
  const [open, setOpen] = useState(true)

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 z-50 flex h-14 w-5 -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-black/15 bg-white/95 text-black shadow-sm backdrop-blur-sm hover:bg-black/4"
          aria-label="Open course navigation"
        >
          <ChevronLeft className="size-3.5 shrink-0" aria-hidden />
        </button>
      ) : null}

      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col items-center border-l border-black/15 bg-white/95 py-2 backdrop-blur-sm transition-[width,opacity] duration-200 ease-out",
          open ? "w-10 opacity-100" : "pointer-events-none w-0 overflow-hidden border-0 opacity-0"
        )}
        aria-label="Course navigation"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mb-1 flex size-7 items-center justify-center rounded-md text-black/60 hover:bg-black/6 hover:text-black"
          aria-label="Hide navigation"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </button>

        <nav className="flex flex-1 flex-col items-center gap-1 pt-1" aria-orientation="vertical">
          {NAV_ITEMS.map(({ phase: id, label, Icon }) => {
            const active = phase === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                title={label}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md transition-colors",
                  active
                    ? "bg-black text-white"
                    : "text-black/70 hover:bg-black/6 hover:text-black"
                )}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
