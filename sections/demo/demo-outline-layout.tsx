"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Shared with in-course activities (e.g. competition match) for consistent light surfaces. */
export const DEMO_OUTLINE_BG = "#EEF8F3"

/**
 * Tailwind `amber-50` — competition match cards / leaderboard tints use this family.
 * Recognition uses a distinct warm yellow (see `DEMO_RECOGNITION_SURFACE`).
 */
export const DEMO_COMPETITION_AMBER_SURFACE = "#fffbeb"

/** Full-page surface for Recognition — same hue family as competition amber, slightly different shade. */
export const DEMO_RECOGNITION_SURFACE = "#fff4d9"

/** Default `<main>` padding / centering — merged with `mainClassName` in `DemoStyleLayout`. */
export const DEMO_MAIN_BASE_CLASSNAME =
  "mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center layout-padding-default"

/** Wide demo stages (chaos, mimicry, etc.) — merges over default `main` via `tailwind-merge`. */
export const DEMO_MAIN_WIDE =
  "max-w-full layout-padding-wide lg:max-w-[min(100%,85rem)] xl:max-w-[min(100%,100rem)] xl:px-10 2xl:max-w-[min(100%,120rem)] 2xl:px-12"

export type DemoStyleLayoutProps = {
  children: React.ReactNode
  /** Outer wrapper (mint background). */
  className?: string
  /** Applied to `<main>` — use to widen content beyond default `max-w-4xl`. */
  mainClassName?: string
  /** Overrides default mint (`DEMO_OUTLINE_BG`) for outer shell + `<main>` (e.g. Recognition yellow). */
  surfaceColor?: string
  /** Set on the outer `<div>` for tests or instrumentation. */
  dataActivity?: string
}

export function DemoStyleLayout({ children, className, mainClassName, surfaceColor, dataActivity }: DemoStyleLayoutProps) {
  const bg = surfaceColor ?? DEMO_OUTLINE_BG
  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={{ backgroundColor: bg }}
      {...(dataActivity ? { "data-activity": dataActivity } : {})}
    >
      <div
        className={cn(DEMO_MAIN_BASE_CLASSNAME, mainClassName)}
        style={{ backgroundColor: bg }}
      >
        {children}
      </div>
    </div>
  )
}
