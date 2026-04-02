"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Shared with in-course activities (e.g. competition match) for consistent light surfaces. */
export const DEMO_OUTLINE_BG = "#EEF8F3"

/** Wide demo stages (chaos, match-the-four, mimicry) — merges over default `main` via `tailwind-merge`. */
export const DEMO_MAIN_WIDE =
  "max-w-full px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:px-8 lg:max-w-[min(100%,85rem)] xl:max-w-[min(100%,100rem)] xl:px-10 2xl:max-w-[min(100%,120rem)] 2xl:px-12"

export type DemoStyleLayoutProps = {
  children: React.ReactNode
  /** Outer wrapper (mint background). */
  className?: string
  /** Applied to `<main>` — use to widen content beyond default `max-w-4xl`. */
  mainClassName?: string
  /** Set on the outer `<div>` for tests or instrumentation. */
  dataActivity?: string
}

export function DemoStyleLayout({ children, className, mainClassName, dataActivity }: DemoStyleLayoutProps) {
  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={{ backgroundColor: DEMO_OUTLINE_BG }}
      {...(dataActivity ? { "data-activity": dataActivity } : {})}
    >
      <main
        className={cn(
          "mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-14 sm:px-10",
          mainClassName
        )}
      >
        {children}
      </main>
    </div>
  )
}
