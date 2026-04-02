"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { demoContentModelSplitClassName, demoContentModelTwoPaneClassName } from "@/sections/demo/demo-ui"

export type DemoThreePaneLayoutProps = {
  text: ReactNode
  video: ReactNode
  model: ReactNode
  className?: string
  textClassName?: string
  videoClassName?: string
  modelClassName?: string
}

export type DemoTwoPaneLayoutProps = {
  content: ReactNode
  model: ReactNode
  className?: string
  contentClassName?: string
  modelClassName?: string
}

/**
 * Canonical post-match layout: text (30%) + video (30%) + model (40%) on desktop.
 * On small screens this stacks vertically.
 */
export function DemoThreePaneLayout({
  text,
  video,
  model,
  className,
  textClassName,
  videoClassName,
  modelClassName,
}: DemoThreePaneLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[min(100%,1400px)]", demoContentModelSplitClassName, className)}>
      <div className={cn("flex min-w-0 flex-col gap-3 text-left", textClassName)}>{text}</div>
      <div className={cn("mx-auto flex w-full max-w-[min(100%,340px)] flex-col gap-3 lg:mx-0 lg:max-w-[420px]", videoClassName)}>
        {video}
      </div>
      <div className={cn("mx-auto flex w-full max-w-[min(100%,620px)] items-start justify-center", modelClassName)}>{model}</div>
    </div>
  )
}

/** Canonical post-match two-pane split: content (60%) + model (40%) on desktop. */
export function DemoTwoPaneLayout({ content, model, className, contentClassName, modelClassName }: DemoTwoPaneLayoutProps) {
  return (
    <div className={cn("mx-auto w-full", demoContentModelTwoPaneClassName, className)}>
      <div className={cn("flex min-w-0", contentClassName)}>{content}</div>
      <div className={cn("flex min-w-0 w-full items-start justify-center", modelClassName)}>{model}</div>
    </div>
  )
}
