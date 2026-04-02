"use client"

import * as React from "react"

import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import { DiscreteAxisSlider, AXIS_CENTER, type AxisIndex } from "@/components/discrete-axis-slider"
import type { AssessmentSituation } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { cn } from "@/lib/utils"

import { demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName } from "@/sections/demo/demo-ui"

type AxesAssessmentAPlusProps = {
  situations: AssessmentSituation[]
  onComplete?: () => void
}

function inferHorizontalSide(index: number | undefined): "left" | "right" | null {
  if (index == null || typeof index !== "number") return null
  if (index === AXIS_CENTER) return null
  return index <= 1 ? "left" : "right"
}

function inferVerticalSide(index: number | undefined): "top" | "bottom" | null {
  if (index == null || typeof index !== "number") return null
  if (index === AXIS_CENTER) return null
  return index <= 1 ? "top" : "bottom"
}

function inferQuadrantFromAxes(horizontalIndex: AxisIndex, verticalIndex: AxisIndex): QuadrantId | null {
  const h = inferHorizontalSide(horizontalIndex)
  const v = inferVerticalSide(verticalIndex)
  if (!h || !v) return null

  if (h === "left" && v === "top") return "Q1"
  if (h === "left" && v === "bottom") return "Q2"
  if (h === "right" && v === "top") return "Q3"
  return "Q4"
}

export function AxesAssessmentAPlus({ situations, onComplete }: AxesAssessmentAPlusProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [horizontalIndex, setHorizontalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [verticalIndex, setVerticalIndex] = React.useState<AxisIndex>(AXIS_CENTER)

  const [submittedByIndex, setSubmittedByIndex] = React.useState<(null | { horizontal: AxisIndex; vertical: AxisIndex })[]>(
    () => situations.map(() => null)
  )

  React.useEffect(() => {
    setCurrentIndex(0)
    setHorizontalIndex(AXIS_CENTER)
    setVerticalIndex(AXIS_CENTER)
    setSubmittedByIndex(situations.map(() => null))
  }, [situations])

  const currentSituation = situations[currentIndex]
  const currentSubmitted = submittedByIndex[currentIndex]

  const allSubmitted = submittedByIndex.every((x) => x !== null)

  const liveQuadrant = inferQuadrantFromAxes(horizontalIndex, verticalIndex)
  const liveConsequence = liveQuadrant && currentSituation ? currentSituation.consequences[liveQuadrant] : null

  const submitEnabled =
    currentSituation &&
    currentSubmitted === null &&
    // submit should require both axes to be non-center so we can select a quadrant read
    horizontalIndex !== AXIS_CENTER &&
    verticalIndex !== AXIS_CENTER

  const submit = () => {
    if (!submitEnabled) return
    setSubmittedByIndex((prev) => {
      const next = [...prev]
      next[currentIndex] = { horizontal: horizontalIndex, vertical: verticalIndex }
      return next
    })
  }

  const canNext = currentSubmitted !== null && currentIndex < situations.length - 1
  const next = () => {
    if (!canNext) return
    setCurrentIndex((i) => i + 1)
    setHorizontalIndex(AXIS_CENTER)
    setVerticalIndex(AXIS_CENTER)
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-left">
          {currentSituation ? (
            <div className="rounded-xl border border-black/10 bg-white/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Situation</p>
              <h3 className="mt-1 text-lg font-bold text-black">{currentSituation.heading}</h3>
              <p className="mt-1 text-sm text-black/70">
                {currentSituation.level} · {currentSituation.topic}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-black/85">{currentSituation.situation}</p>
            </div>
          ) : (
            <div className="text-sm text-black/70">No situations configured.</div>
          )}

          <div className="rounded-xl border border-black/10 bg-white/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Slide the axes</p>
            <div className="mt-4 flex w-full flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-xs text-black/60">Agency ↔ Fate (&lt;-&gt;)</p>
                <DiscreteAxisSlider axis="horizontal" valueIndex={horizontalIndex} onChange={setHorizontalIndex} disabled={false} />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-xs text-black/60">Self-intact ↔ Self-dissolved (`^`)</p>
                <DiscreteAxisSlider axis="vertical" valueIndex={verticalIndex} onChange={setVerticalIndex} disabled={false} />
              </div>
            </div>
            <p className="mt-3 text-xs text-black/60">Center positions mean “no quadrant selected”.</p>
          </div>

          {currentSubmitted ? (
            <div className="rounded-xl border border-black/10 bg-white/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Consequence</p>
              {liveConsequence ? (
                <p className="mt-2 text-sm leading-relaxed text-black/85">{liveConsequence}</p>
              ) : (
                <p className="mt-2 text-sm text-black/70">Move both axes away from center to reveal a consequence.</p>
              )}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
            <button
              type="button"
              className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "max-w-lg", submitEnabled ? "" : "opacity-60")}
              onClick={submit}
              disabled={!submitEnabled}
            >
              This is my read of the situation.
            </button>

            {canNext ? (
              <button
                type="button"
                className={cn(
                  demoPrimaryCtaConstrainedClassName,
                  "bg-white text-black/90 hover:bg-white/90 border border-black/15",
                  demoPrimaryCtaNativeFocusClassName
                )}
                onClick={next}
              >
                Next situation
              </button>
            ) : null}
          </div>

          {currentIndex === situations.length - 1 ? (
            <div className="mt-2 text-center">
              <button
                type="button"
                className={cn(
                  demoPrimaryCtaConstrainedClassName,
                  demoPrimaryCtaNativeFocusClassName,
                  allSubmitted ? "" : "opacity-60"
                )}
                disabled={!allSubmitted || !onComplete}
                onClick={() => onComplete?.()}
              >
                Continue
              </button>
              {!allSubmitted ? <p className="mt-2 text-sm text-black/60">Submit all four situations to continue.</p> : null}
            </div>
          ) : (
            <p className="text-xs text-black/55">
              Situation {currentIndex + 1} of {situations.length}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-none items-center justify-center">
          <QuadrantAxesModel
            mode="axesAssessment"
            horizontalIndex={horizontalIndex}
            verticalIndex={verticalIndex}
          />
        </div>
      </div>
    </div>
  )
}

