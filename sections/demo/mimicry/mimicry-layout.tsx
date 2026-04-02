"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"

export type MimicryLayoutProps = {
  children: ReactNode
  className?: string
  mainClassName?: string
}

/** Thin wrapper for React DevTools — same shell as other wide demo games. */
export function MimicryLayout({ children, className, mainClassName }: MimicryLayoutProps) {
  return (
    <DemoStyleLayout
      dataActivity="mimicry"
      className={className}
      mainClassName={cn(DEMO_MAIN_WIDE, mainClassName)}
    >
      {children}
    </DemoStyleLayout>
  )
}
