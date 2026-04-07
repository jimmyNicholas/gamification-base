"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

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
  | "references"

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
  { phase: "references", label: "References", Icon: icons.references },
]

type CourseNavPanelProps = {
  phase: CoursePhase
  onNavigate: (phase: CoursePhase) => void
  adminPanelOpen: boolean
  onToggleAdminPanel: () => void
  unlockedPhases: Set<CoursePhase>
}

export function CourseNavPanel({ phase, onNavigate, adminPanelOpen, onToggleAdminPanel, unlockedPhases }: CourseNavPanelProps) {
  const [open, setOpen] = useState(true)

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed z-50 flex items-center justify-center border border-black/15 bg-white/95 text-black shadow-sm backdrop-blur-sm hover:bg-black/4",
            // Mobile: tab under where the top bar was
            "right-3 top-2 h-10 w-10 rounded-md md:right-0 md:top-1/2 md:h-14 md:w-5 md:-translate-y-1/2 md:rounded-l-md md:border-r-0 md:rounded-r-none"
          )}
          aria-label="Open course navigation"
        >
          <ChevronDown className="size-3.5 shrink-0 md:hidden" aria-hidden />
          <icons.chevronLeft className="hidden size-3.5 shrink-0 md:block" aria-hidden />
        </button>
      ) : null}

      <aside
        className={cn(
          "shrink-0 bg-white/95 backdrop-blur-sm transition-[width,height,opacity] duration-200 ease-out",
          // Mobile: fixed strip at top, horizontal layout
          "max-md:fixed max-md:left-0 max-md:right-0 max-md:top-0 max-md:z-40 max-md:flex max-md:h-16 max-md:flex-row max-md:items-center max-md:border-b max-md:border-black/15 max-md:px-2 max-md:py-2",
          // md+: right-hand column
          "md:sticky md:top-0 md:flex md:h-screen md:min-h-0 md:flex-col md:border-l md:border-black/15 md:py-2",
          open
            ? "max-md:opacity-100 md:w-15 md:opacity-100"
            : "pointer-events-none max-md:h-0 max-md:overflow-hidden max-md:border-0 max-md:opacity-0 md:w-0 md:overflow-hidden md:border-0 md:opacity-0"
        )}
        role="complementary"
        aria-label="Course navigation panel"
      >
        <div
          className={cn(
            "flex w-full min-h-0 min-w-0 items-center px-1",
            "max-md:h-full max-md:flex-row max-md:gap-1",
            "md:h-full md:min-h-0 md:flex-1 md:flex-col md:items-center"
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-black/60 hover:bg-black/6 hover:text-black max-md:mb-0 md:mb-1"
            aria-label="Hide navigation"
          >
            <ChevronUp className="size-3.5 md:hidden" aria-hidden />
            <icons.chevronRight className="hidden size-3.5 md:block" aria-hidden />
          </button>

          <nav
            className={cn(
              "flex min-h-0 min-w-0 items-center gap-1",
              "max-md:flex-1 max-md:flex-row max-md:overflow-x-auto max-md:overflow-y-hidden max-md:overscroll-x-contain max-md:py-0.5",
              "md:w-full md:flex-1 md:flex-col md:overflow-y-auto md:overscroll-contain md:pt-1"
            )}
            aria-label="Course sections"
          >
            {NAV_ITEMS.map(({ phase: id, label, Icon }) => {
              const isAdmin = id === "admin"
              const isLocked = !isAdmin && !unlockedPhases.has(id as CoursePhase)
              const active = isAdmin
                ? adminPanelOpen
                : id === "recognition"
                  ? isRecognitionSectionPhase(phase)
                  : phase === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (isLocked) return
                    if (isAdmin) {
                      onToggleAdminPanel()
                    } else if (id === "recognition") {
                      onNavigate("recognition")
                    } else {
                      onNavigate(id)
                    }
                  }}
                  title={isLocked ? `${label} (Locked)` : label}
                  aria-label={isLocked ? `${label} (Locked)` : label}
                  aria-current={active ? "page" : undefined}
                  aria-disabled={isLocked}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors",
                    isLocked && "cursor-not-allowed opacity-50",
                    !isLocked && active
                      ? isAdmin
                        ? "bg-blue-900 text-white"
                        : "bg-black text-white"
                      : !isLocked && "text-black/70 hover:bg-black/6 hover:text-black"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
