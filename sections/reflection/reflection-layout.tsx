"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { DEMO_MAIN_BASE_CLASSNAME, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"

export type ReflectionLayoutProps = {
  children: ReactNode
  className?: string
  /** Applied to `<main>` — use to widen content beyond default. */
  mainClassName?: string
  /** Outer + `<main>` background color. */
  surfaceColor?: string
  /** DevTools / instrumentation — defaults to `reflection`. */
  dataActivity?: string
}

const REFLECTION_SURFACE = "#dbeafe" // TODO: Replace with CSS variable once Tailwind 4 supports it

/**
 * Reflection-phase shell — wide layout like recognition.
 */
export function ReflectionLayout({
  children,
  className,
  mainClassName,
  surfaceColor = REFLECTION_SURFACE,
  dataActivity = "reflection",
}: ReflectionLayoutProps) {
  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={{ backgroundColor: surfaceColor }}
      data-activity={dataActivity}
    >
      <div
        className={cn(DEMO_MAIN_BASE_CLASSNAME, DEMO_MAIN_WIDE, mainClassName)}
        style={{ backgroundColor: surfaceColor }}
      >
        {children}
      </div>
    </div>
  )
}

