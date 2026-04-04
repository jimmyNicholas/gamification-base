"use client"

import * as React from "react"
import { PenLine } from "lucide-react"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"

export type ReflectionPageProps = {
  onContinue?: () => void
}

type QuadState = "invisible" | "inactive" | "color" | "highlighted"
type AxisState = "invisible" | "inactiveGrey" | "inactiveColor" | "activeColor"

const QUAD_STATE_OPTIONS: Array<{ value: QuadState; label: string }> = [
  { value: "invisible", label: "invisible" },
  { value: "inactive", label: "grey / inactive" },
  { value: "color", label: "colour" },
  { value: "highlighted", label: "highlighted" },
]

function StateRadioGroup({
  name,
  value,
  onChange,
}: {
  name: string
  value: QuadState
  onChange: (next: QuadState) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {QUAD_STATE_OPTIONS.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-xs text-black/70">
          <input type="radio" name={name} checked={value === opt.value} onChange={() => onChange(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

const AXIS_STATE_OPTIONS: Array<{ value: AxisState; label: string }> = [
  { value: "invisible", label: "invisible" },
  { value: "inactiveGrey", label: "inactive grey" },
  { value: "inactiveColor", label: "inactive colour" },
  { value: "activeColor", label: "active colour" },
]

function AxisStateRadioGroup({
  name,
  value,
  onChange,
}: {
  name: string
  value: AxisState
  onChange: (next: AxisState) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {AXIS_STATE_OPTIONS.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-xs text-black/70">
          <input type="radio" name={name} checked={value === opt.value} onChange={() => onChange(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

export function ReflectionPage({ onContinue }: ReflectionPageProps) {
  const [quadrantStates, setQuadrantStates] = React.useState<Record<QuadrantId, QuadState>>({
    Q1: "inactive",
    Q2: "inactive",
    Q3: "inactive",
    Q4: "inactive",
  })

  const [axisStates, setAxisStates] = React.useState<{ horizontal: AxisState; vertical: AxisState }>({
    horizontal: "invisible",
    vertical: "invisible",
  })

  const [axisLabelMode, setAxisLabelMode] = React.useState<"labeled" | "unlabeled">("unlabeled")
  const [axisPosition, setAxisPosition] = React.useState<{ horizontal: 0 | 1 | 2 | 3 | 4; vertical: 0 | 1 | 2 | 3 | 4 }>({
    horizontal: 2,
    vertical: 2,
  })

  const cycleState = React.useCallback((s: AxisState): AxisState => {
    if (s === "invisible") return "inactiveGrey"
    if (s === "inactiveGrey") return "inactiveColor"
    if (s === "inactiveColor") return "activeColor"
    return "invisible"
  }, [])

  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE} dataActivity="reflection">
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-left">
          <div className="flex items-center gap-3">
            <PenLine className="size-6 text-black/70" aria-hidden />
            <h2 id="reflection-heading" className={demoActivityHeadingClassName}>Reflection</h2>
          </div>
          <textarea
            aria-labelledby="reflection-heading"
            className="min-h-[220px] w-full resize-y rounded-xl border border-black/10 bg-white/60 p-4 text-black/90 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            placeholder=""
          />
          {onContinue ? (
            <button
              type="button"
              className={`${demoPrimaryCtaConstrainedClassName} ${demoPrimaryCtaNativeFocusClassName} max-w-lg`}
              onClick={() => onContinue()}
            >
              Continue
            </button>
          ) : null}
        </div>
      </div>
    </DemoStyleLayout>
  )
}

