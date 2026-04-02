"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import type { ContinueRule } from "@/lib/storyboard-component-contracts"
import { cn } from "@/lib/utils"
import { CATEGORY_VISUAL_TOKENS } from "@/lib/visual-design-system"

type CourseSection = {
  id: string
  title: string
  body: React.ReactNode
  continueLabel?: string
  continueRule?: ContinueRule
  continueDelayMs?: number
  continueSignalId?: string
  noBack?: boolean
  triggerCompletionXapiOnReferences?: boolean
}

type CourseShellProps = {
  sections: CourseSection[]
  courseTitle: string
  subtitle?: string
  backgroundImageUrl?: string
  className?: string
}

export function CourseShell({
  sections,
  courseTitle,
  subtitle,
  backgroundImageUrl,
  className,
}: CourseShellProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0)
  const [furthestSectionIndex, setFurthestSectionIndex] = React.useState(0)
  const [continueUnlocked, setContinueUnlocked] = React.useState(true)
  const completionTriggered = React.useRef(false)

  const section = sections[currentSectionIndex]

  React.useEffect(() => {
    if (!section) return

    const requiresSignal =
      section.continueRule &&
      !["always", "delayed"].includes(section.continueRule)

    setContinueUnlocked(!requiresSignal && section.continueRule !== "delayed")

    if (section.continueRule === "delayed") {
      const delay = section.continueDelayMs ?? 2000
      const timer = window.setTimeout(() => setContinueUnlocked(true), delay)
      return () => window.clearTimeout(timer)
    }

    if (requiresSignal) {
      const signalId = section.continueSignalId ?? section.id
      const eventName = `course-shell:unlock:${signalId}`
      const handler = () => setContinueUnlocked(true)
      window.addEventListener(eventName, handler)
      return () => window.removeEventListener(eventName, handler)
    }
  }, [section])

  React.useEffect(() => {
    if (!section?.triggerCompletionXapiOnReferences || completionTriggered.current) {
      return
    }

    completionTriggered.current = true
    window.dispatchEvent(
      new CustomEvent("course-complete", {
        detail: {
          event: "xapi.course.complete",
          sectionId: section.id,
          sectionTitle: section.title,
          completedAt: new Date().toISOString(),
        },
      })
    )
  }, [section])

  if (!section) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <p className="rounded-lg border border-dashed border-border/80 bg-card p-6 text-center text-card-foreground">
          No sections configured yet.
        </p>
      </main>
    )
  }

  const canGoBack = currentSectionIndex > 0 && !section.noBack
  const canContinue = continueUnlocked && currentSectionIndex < sections.length - 1
  const progressPercent =
    sections.length > 1 ? (currentSectionIndex / (sections.length - 1)) * 100 : 100

  const goBack = () => {
    if (!canGoBack) return
    setCurrentSectionIndex((index) => Math.max(0, index - 1))
  }

  const continueToNextSection = () => {
    if (!canContinue) return

    const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1)
    setCurrentSectionIndex(nextIndex)
    setFurthestSectionIndex((prev) => Math.max(prev, nextIndex))
  }

  return (
    <main className={cn("relative min-h-screen overflow-hidden", className)}>
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-course-shell-glow),transparent_55%),linear-gradient(170deg,var(--color-course-shell-top),var(--color-course-shell-bottom))]" />
      )}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        <header className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
          <p className="text-xs tracking-[0.18em] uppercase text-white/75">Course Shell</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{courseTitle}</h1>
          {subtitle ? <p className="mt-2 text-base text-white/80">{subtitle}</p> : null}
        </header>

        <section className="mt-6 rounded-2xl border border-white/15 bg-black/35 p-5 text-white shadow-xl backdrop-blur-sm sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-white/70">
              Section {currentSectionIndex + 1} of {sections.length}
            </p>
            <p className="text-sm font-medium">{section.title}</p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-(--color-token-simulation) transition-[width] duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORY_VISUAL_TOKENS.map((token) => (
              <span
                key={token.category}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${token.color}22`,
                  borderColor: token.highContrastBorderColor,
                }}
              >
                <span aria-hidden>{token.icon}</span>
                {token.label}
              </span>
            ))}
          </div>

          <article className="mt-8 rounded-xl border border-white/15 bg-black/25 p-5 leading-relaxed text-white/90">
            {section.body}
          </article>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={!canGoBack}
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              Back
            </Button>

            <Button
              onClick={continueToNextSection}
              disabled={!canContinue}
              className="bg-(--color-token-transformation) text-white hover:opacity-95"
            >
              {section.continueLabel ?? "Continue"}
            </Button>
          </div>
        </section>

        <footer className="mt-4 text-xs text-white/75">
          Furthest unlocked section: {Math.max(1, furthestSectionIndex + 1)}
        </footer>
      </div>
    </main>
  )
}

