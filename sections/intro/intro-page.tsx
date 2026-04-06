"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { icons } from "@/lib/icons"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

export type IntroOutline = {
  objective: string
  listHeading?: string
  items: { icon: LucideIcon; label: string }[]
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
      {
        icon: icons.demoOutline,
        label: "Feel what it is like to be a student in different game types.",
      },
      {
        icon: icons.recognition,
        label: "Name the patterns you already use and when they help.",
      },
      {
        icon: icons.analysis,
        label: "Understand why each type works, and when it backfires.",
      },
      {
        icon: icons.assessment,
        label: "Read the room on the spot using a simple diagnostic frame.",
      },
      {
        icon: icons.reflection,
        label: "Reflect on what you've learned and how it can help you in the future.",
      }
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

  // Enable Enter/Spacebar to start course
  useKeyboardNavigation({
    onSubmit: onStartCourse,
  })

  return (
    <main className={cn("relative h-dvh overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-intro px-5 py-12 sm:px-10 sm:py-16">
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
                <ul className="mt-3 list-none space-y-2.5 text-[0.9rem] leading-snug text-slate-800 sm:text-[0.95rem]">
                  {outline.items.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <li key={`${index}-${item.label}`} className="flex gap-3">
                        <Icon
                          className="mt-0.5 h-5 w-5 shrink-0 text-slate-500"
                          aria-hidden
                        />
                        <span className="leading-snug">{item.label}</span>
                      </li>
                    )
                  })}
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
