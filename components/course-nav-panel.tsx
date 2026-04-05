"use client"

import { useState } from "react"

import { icons } from "@/lib/icons"
import { cn } from "@/lib/utils"

export type CoursePhase =
  | "intro"
  | "demoOutline"
  | "competitionActivity"
  | "chance"
  | "mimicry"
  | "chaos"
  | "recognition"
  | "recognitionCategories"
  | "recognitionMiniReflection"
  | "postRecognition"
  | "book"
  | "axisTogether"
  | "axesAssessment"
  | "reflection"

/** Phases that belong to the Recognition side-rail section (single icon). */
export function isRecognitionSectionPhase(phase: CoursePhase): boolean {
  return (
    phase === "recognition" ||
    phase === "recognitionCategories" ||
    phase === "recognitionMiniReflection"
  )
}

type NavItemId = CoursePhase | "admin"

const NAV_ITEMS: {
  phase: NavItemId
  label: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}[] = [
  { phase: "admin", label: "Admin", Icon: icons.admin },
  { phase: "intro", label: "Intro", Icon: icons.intro },
  { phase: "demoOutline", label: "Demo", Icon: icons.demoOutline },
  { phase: "recognition", label: "Recognition", Icon: icons.recognition },
  { phase: "book", label: "Analysis", Icon: icons.analysis },
  { phase: "axisTogether", label: "Assessment", Icon: icons.assessment },
  { phase: "reflection", label: "Reflection", Icon: icons.reflection },
]

type CourseNavPanelProps = {
  phase: CoursePhase
  onNavigate: (phase: CoursePhase) => void
  adminPanelOpen: boolean
  onToggleAdminPanel: () => void
}

export function CourseNavPanel({ phase, onNavigate, adminPanelOpen, onToggleAdminPanel }: CourseNavPanelProps) {
  const [open, setOpen] = useState(true)

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 z-50 -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-black/15 bg-white/95 text-black shadow-sm backdrop-blur-sm hover:bg-black/4 hidden md:flex h-14 w-5"
          aria-label="Open course navigation"
        >
          <icons.chevronLeft className="size-3.5 shrink-0" aria-hidden />
        </button>
      ) : null}

      <aside
        className={cn(
          "sticky top-0 h-screen shrink-0 flex-col items-center border-l border-black/15 bg-white/95 py-2 backdrop-blur-sm transition-[width,opacity] duration-200 ease-out hidden md:flex",
          open ? "w-[3.75rem] opacity-100" : "pointer-events-none w-0 overflow-hidden border-0 opacity-0"
        )}
        role="complementary"
        aria-label="Course navigation panel"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mb-1 flex h-11 w-11 items-center justify-center rounded-md text-black/60 hover:bg-black/6 hover:text-black"
          aria-label="Hide navigation"
        >
          <icons.chevronRight className="size-3.5" aria-hidden />
        </button>

        <nav
          className="flex flex-1 flex-col items-center gap-1 pt-1"
          aria-label="Course sections"
        >
          {NAV_ITEMS.map(({ phase: id, label, Icon }) => {
            const isAdmin = id === "admin"
            const active = isAdmin
              ? adminPanelOpen
              : id === "recognition"
                ? isRecognitionSectionPhase(phase)
                : phase === id
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  isAdmin ? onToggleAdminPanel() : id === "recognition" ? onNavigate("recognition") : onNavigate(id)
                }
                title={label}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-md transition-colors",
                  active
                    ? isAdmin
                      ? "bg-blue-900 text-white"
                      : "bg-black text-white"
                    : "text-black/70 hover:bg-black/6 hover:text-black"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
