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

/**
 * Reflection-phase shell — wide `<main>` like recognition.
 * Owns `<main>` so DevTools show `ReflectionLayout`, not `DemoStyleLayout`.
 */
export function ReflectionLayout({
  children,
  className,
  mainClassName,
  surfaceColor = "#dbeafe",
  dataActivity = "reflection",
}: ReflectionLayoutProps) {
  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={{ backgroundColor: surfaceColor }}
      data-activity={dataActivity}
    >
      <main
        className={cn(DEMO_MAIN_BASE_CLASSNAME, DEMO_MAIN_WIDE, mainClassName)}
        style={{ backgroundColor: surfaceColor }}
      >
        {children}
      </main>
    </div>
  )
}

