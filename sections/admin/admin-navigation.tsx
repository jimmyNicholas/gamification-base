"use client"

import type { CoursePhase } from "@/components/course-nav-panel"
import { cn } from "@/lib/utils"

type AdminNavigationProps = {
  currentPhase: CoursePhase
  onNavigate: (phase: CoursePhase) => void
  onClose: () => void
}

type NavSection = {
  title: string
  phases: Array<{ phase: CoursePhase; label: string }>
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Introduction",
    phases: [{ phase: "intro", label: "Course Introduction" }],
  },
  {
    title: "Demonstration",
    phases: [
      { phase: "demoOutline", label: "Outline" },
      { phase: "competitionActivity", label: "Competition" },
      { phase: "chance", label: "Chance" },
      { phase: "mimicry", label: "Mimicry" },
      { phase: "chaos", label: "Chaos" },
    ],
  },
  {
    title: "Recognition",
    phases: [
      { phase: "recognition", label: "Match the Four" },
      { phase: "recognitionCategories", label: "Four categories" },
      { phase: "recognitionMiniReflection", label: "Mini reflection" },
    ],
  },
  {
    title: "Analysis",
    phases: [
      { phase: "book", label: "Analysis" },
    ],
  },
  {
    title: "Assessment",
    phases: [
      { phase: "axisTogether", label: "Assessment" },
      //{ phase: "axesAssessment", label: "Situations 1-4" },
      // Note: Assessment feedback phase to be added
    ],
  },
  {
    title: "Reflection",
    phases: [
      { phase: "reflection", label: "Reflection" },
      // Note: "References" and "Packages Used" would be sub-pages
    ],
  },
]

export function AdminNavigation({
  currentPhase,
  onNavigate,
  onClose,
}: AdminNavigationProps) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-black">Quick Navigation</h3>
        <p className="text-sm text-black/70">
          Navigate to any course section or sub-page
        </p>
      </div>

      <nav className="flex flex-col gap-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-black/60">
              {section.title}
            </h4>
            <div className="flex flex-col gap-1">
              {section.phases.map(({ phase, label }) => {
                const isActive = currentPhase === phase
                return (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => {
                      onNavigate(phase)
                      onClose()
                    }}
                    className={cn(
                      "rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "bg-black text-white"
                        : "text-black/80 hover:bg-black/5 hover:text-black"
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
