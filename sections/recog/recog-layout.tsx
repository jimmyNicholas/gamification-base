"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import {
  DEMO_MAIN_BASE_CLASSNAME,
  DEMO_MAIN_WIDE,
  DEMO_RECOGNITION_SURFACE,
} from "@/sections/demo/demo-outline-layout"

export type RecogLayoutProps = {
  children: ReactNode
  className?: string
  mainClassName?: string
  /** DevTools / instrumentation — defaults to `recognition`. */
  dataActivity?: string
}

/** Recognition-phase shell — yellow surface, wide layout. */
export function RecogLayout({ children, className, mainClassName, dataActivity = "recognition" }: RecogLayoutProps) {
  const bg = DEMO_RECOGNITION_SURFACE
  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={{ backgroundColor: bg }}
      data-activity={dataActivity}
    >
      <div
        className={cn(DEMO_MAIN_BASE_CLASSNAME, DEMO_MAIN_WIDE, mainClassName)}
        style={{ backgroundColor: bg }}
      >
        {children}
      </div>
    </div>
  )
}
