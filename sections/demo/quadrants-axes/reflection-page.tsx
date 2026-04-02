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
import { QuadrantAxesModel } from "@/components/quadrant-axes-model"

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
            <h2 className={demoActivityHeadingClassName}>Reflection</h2>
          </div>
          <textarea
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

        <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-6 rounded-2xl border border-black/10 bg-white/30 p-6">
          <QuadrantAxesModel
            mode="controlled"
            quadrantStates={quadrantStates}
            axisStates={axisStates}
            horizontalIndex={axisPosition.horizontal}
            verticalIndex={axisPosition.vertical}
            showAxisLabels={axisLabelMode === "labeled"}
            onAxisIndexChange={(axis, index) =>
              setAxisPosition((prev) => ({
                ...prev,
                [axis]: index,
              }))
            }
            onAxisToggle={(axis) =>
              setAxisStates((prev) => ({
                ...prev,
                [axis]: cycleState(prev[axis]),
              }))
            }
          />

          <div className="w-full space-y-5 rounded-xl border border-black/10 bg-white/40 p-4">
            <div className="text-sm font-semibold text-black/70">Debug Control Panel</div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-black/60">Quadrants</div>
              <div className="grid grid-cols-2 gap-3">
                {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                  <fieldset key={q} className="rounded-lg border border-black/10 bg-white/50 p-3">
                    <legend className="px-1 text-xs font-semibold text-black/70">{q}</legend>
                    <StateRadioGroup
                      name={`reflection-quad-${q}`}
                      value={quadrantStates[q]}
                      onChange={(next) => setQuadrantStates((prev) => ({ ...prev, [q]: next }))}
                    />
                  </fieldset>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-black/60">Axes</div>
              <div className="grid grid-cols-2 gap-3">
                <fieldset className="rounded-lg border border-black/10 bg-white/50 p-3">
                  <legend className="px-1 text-xs font-semibold text-black/70">Horizontal</legend>
                  <AxisStateRadioGroup
                    name="reflection-axis-horizontal"
                    value={axisStates.horizontal}
                    onChange={(next) => setAxisStates((prev) => ({ ...prev, horizontal: next }))}
                  />
                </fieldset>
                <fieldset className="rounded-lg border border-black/10 bg-white/50 p-3">
                  <legend className="px-1 text-xs font-semibold text-black/70">Vertical</legend>
                  <AxisStateRadioGroup
                    name="reflection-axis-vertical"
                    value={axisStates.vertical}
                    onChange={(next) => setAxisStates((prev) => ({ ...prev, vertical: next }))}
                  />
                </fieldset>
              </div>
            </div>

            <fieldset className="rounded-lg border border-black/10 bg-white/50 p-3">
              <legend className="px-1 text-xs font-semibold text-black/70">Axis labels</legend>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-xs text-black/70">
                  <input type="radio" name="reflection-axis-labels" checked={axisLabelMode === "labeled"} onChange={() => setAxisLabelMode("labeled")} />
                  labeled
                </label>
                <label className="flex items-center gap-2 text-xs text-black/70">
                  <input
                    type="radio"
                    name="reflection-axis-labels"
                    checked={axisLabelMode === "unlabeled"}
                    onChange={() => setAxisLabelMode("unlabeled")}
                  />
                  unlabeled
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </DemoStyleLayout>
  )
}

