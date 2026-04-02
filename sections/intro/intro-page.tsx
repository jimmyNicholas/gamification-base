"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type IntroOutline = {
  objective: string
  listHeading?: string
  items: string[]
}

export const DEFAULT_INTRO_COPY = {
  courseTitle: "Gamification in the Classroom",
  instructorName: "Jimmy Nicholas",
  backgroundImageUrl: "/intro-hero.png",
  outline: {
    objective:
      "By the end you will be able to read any classroom situation and choose the right game type on the spot.",
    listHeading: "Here's what you'll do:",
    items: [
      "Feel what it is like to be a student in different game types.",
      "Name the patterns you already use and when they help.",
      "Understand why each type works, and when it backfires.",
      "Read the room on the spot using a simple diagnostic frame.",
      "Take the framework into your next lesson with confidence.",
    ],
  } satisfies IntroOutline,
} as const

export type IntroPageProps = {
  onStartCourse: () => void
  courseTitle?: string
  instructorName?: string
  backgroundImageUrl?: string
  outline?: IntroOutline
  className?: string
}

export function IntroPage({
  onStartCourse,
  courseTitle = DEFAULT_INTRO_COPY.courseTitle,
  instructorName = DEFAULT_INTRO_COPY.instructorName,
  backgroundImageUrl = DEFAULT_INTRO_COPY.backgroundImageUrl,
  outline = DEFAULT_INTRO_COPY.outline,
  className,
}: IntroPageProps) {
  const listHeading = outline.listHeading ?? "Here's what you'll do:"

  return (
    <main className={cn("relative min-h-screen overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] px-5 py-12 sm:px-10 sm:py-16">
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:gap-12">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_400px] lg:items-center lg:gap-16 xl:grid-cols-[1fr_440px]">
            <header className="text-white lg:max-w-xl">
              <h1 className="text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.1]">
                {courseTitle}
              </h1>
              <p className="mt-3 text-lg font-bold text-white sm:mt-4 sm:text-xl">by {instructorName}</p>
            </header>

            <div className="flex w-full flex-col self-center lg:max-w-none">
              <div className="rounded-[28px] bg-white px-7 py-8 text-slate-900 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-9 sm:py-9">
                <p className="text-[0.95rem] leading-relaxed sm:text-base">{outline.objective}</p>
                <h2 className="mt-7 text-[0.95rem] font-bold text-slate-900 sm:text-base">{listHeading}</h2>
                <ul className="mt-3 list-disc space-y-2.5 pl-5 text-[0.9rem] leading-snug text-slate-800 marker:text-slate-400 sm:text-[0.95rem]">
                  {outline.items.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <Button
              type="button"
              size="lg"
              className="h-13 w-full max-w-xl rounded-full border-0 bg-[#a8e5cf] px-10 text-sm font-bold tracking-[0.12em] text-black uppercase shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:bg-[#98d9c1] sm:h-14 sm:max-w-2xl sm:text-base"
              onClick={onStartCourse}
            >
              Start course
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
