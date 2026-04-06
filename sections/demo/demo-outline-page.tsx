"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { DemoStyleLayout } from "@/sections/demo/demo-outline-layout"
import { demoPrimaryCtaConstrainedClassName } from "@/sections/demo/demo-ui"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { KeyboardKey } from "@/components/keyboard-key"

export { DEMO_OUTLINE_BG } from "@/sections/demo/demo-outline-layout"

/** Tune when wiring narration or audio (`timeupdate` / chapter cues). */
export const DEMO_OUTLINE_FIRST_LINE_DELAY_MS = 400
export const DEMO_OUTLINE_LINE_GAP_MS = 1900
export const DEMO_OUTLINE_BUTTON_AFTER_LAST_MS = 1200

const LINES = [
  "The following activities have been designed to help you experience game categories as a student.",
  "Some may feel nonsensical at times, but that's the point.",
  "Please complete them as best you can.",
] as const

export type DemoOutlinePageProps = {
  onBegin: () => void
  className?: string
}

export function DemoOutlinePage({ onBegin, className }: DemoOutlinePageProps) {
  const [visibleLineCount, setVisibleLineCount] = React.useState(0)
  const [showButton, setShowButton] = React.useState(false)

  React.useEffect(() => {
    const timers: number[] = []
    let acc = DEMO_OUTLINE_FIRST_LINE_DELAY_MS
    timers.push(window.setTimeout(() => setVisibleLineCount(1), acc))
    acc += DEMO_OUTLINE_LINE_GAP_MS
    timers.push(window.setTimeout(() => setVisibleLineCount(2), acc))
    acc += DEMO_OUTLINE_LINE_GAP_MS
    timers.push(window.setTimeout(() => setVisibleLineCount(3), acc))
    acc += DEMO_OUTLINE_BUTTON_AFTER_LAST_MS
    timers.push(window.setTimeout(() => setShowButton(true), acc))
    return () => timers.forEach(clearTimeout)
  }, [])

  // Enable Enter/Spacebar when button is visible
  useKeyboardNavigation({
    onSubmit: showButton ? onBegin : undefined,
  })

  return (
    <DemoStyleLayout className={className}>
      <div className="flex w-full flex-col items-center gap-14 sm:gap-16">
        <div className="flex w-full flex-col items-center gap-14 sm:gap-16">
          {LINES.map((line, i) => (
            <p
              key={i}
              className={cn(
                "max-w-2xl text-center text-xl font-medium leading-snug text-black transition-all duration-700 ease-out sm:text-2xl sm:leading-snug md:text-[1.75rem] md:leading-tight",
                i < visibleLineCount
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              )}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          className={cn(
            "flex w-full justify-center transition-all duration-500 ease-out",
            showButton ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          )}
        >
          <Button
            type="button"
            size="lg"
            className={demoPrimaryCtaConstrainedClassName}
            onClick={onBegin}
          >
            Begin <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </Button>
        </div>
      </div>
    </DemoStyleLayout>
  )
}
