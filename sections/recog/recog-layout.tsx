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
}

/** Recognition-phase shell — yellow surface, wide main. Owns `<main>` so DevTools show `RecogLayout`, not `DemoStyleLayout`. */
export function RecogLayout({ children, className, mainClassName }: RecogLayoutProps) {
  const bg = DEMO_RECOGNITION_SURFACE
  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={{ backgroundColor: bg }}
      data-activity="recognition"
    >
      <main
        className={cn(DEMO_MAIN_BASE_CLASSNAME, DEMO_MAIN_WIDE, mainClassName)}
        style={{ backgroundColor: bg }}
      >
        {children}
      </main>
    </div>
  )
}
