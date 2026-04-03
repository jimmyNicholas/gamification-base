"use client"

import * as React from "react"

import { DiscreteAxisSlider, AXIS_CENTER, type AxisIndex } from "@/components/discrete-axis-slider"
import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import type { AxisSituation } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import { QUADRANT_RANK_BEST_TO_WORST } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import type { AxisId, QuadrantId } from "@/lib/storyboard-component-contracts"
import { cn } from "@/lib/utils"

import {
  demoPrimaryCtaNativeFocusClassName,
  demoPrimaryCtaConstrainedClassName,
} from "@/sections/demo/demo-ui"

type AxisSliderQuizProps = {
  axisId: AxisId
  situations: AxisSituation[]
  onComplete?: () => void
}

function inferQuadrantPairForAxis(axisId: AxisId, sliderIndex: AxisIndex): QuadrantId[] {
  if (sliderIndex === AXIS_CENTER) return []

  if (axisId === "agency-fate") {
    // horizontal: left = agency; right = fate
    return sliderIndex <= 1 ? ["Q1", "Q2"] : ["Q3", "Q4"]
  }

  // vertical: top = self-intact; bottom = self-dissolved
  return sliderIndex <= 1 ? ["Q1", "Q3"] : ["Q2", "Q4"]
}

function inferSideForAxis(axisId: AxisId, sliderIndex: AxisIndex): AxisSituation["correctSide"] | null {
  if (sliderIndex === AXIS_CENTER) return null

  if (axisId === "agency-fate") return sliderIndex <= 1 ? "left" : "right"
  return sliderIndex <= 1 ? "top" : "bottom"
}

export function AxisSliderQuiz({ axisId, situations, onComplete }: AxisSliderQuizProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [sliderIndex, setSliderIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [submittedByIndex, setSubmittedByIndex] = React.useState<(null | { submittedIndex: AxisIndex; isCorrect: boolean })[]>(
    () => situations.map(() => null)
  )

  React.useEffect(() => {
    setCurrentIndex(0)
    setSliderIndex(AXIS_CENTER)
    setSubmittedByIndex(situations.map(() => null))
  }, [axisId, situations])

  const currentSituation = situations[currentIndex]
  const currentSubmitted = submittedByIndex[currentIndex]

  const allSubmitted = submittedByIndex.every((x) => x !== null)
  const allCorrect = submittedByIndex.every((x) => x?.isCorrect === true)
  const canContinue = allSubmitted && allCorrect

  const liveQuadrants = inferQuadrantPairForAxis(axisId, sliderIndex)
  const orderedLiveQuadrants = liveQuadrants
    .slice()
    .sort((a, b) => QUADRANT_RANK_BEST_TO_WORST.indexOf(a) - QUADRANT_RANK_BEST_TO_WORST.indexOf(b))

  const submitEnabled = currentSituation && sliderIndex !== AXIS_CENTER && currentSubmitted === null

  const submit = () => {
    if (!currentSituation) return
    if (!submitEnabled) return

    const side = inferSideForAxis(axisId, sliderIndex)
    if (!side) return

    const isCorrect = side === currentSituation.correctSide
    setSubmittedByIndex((prev) => {
      const next = [...prev]
      next[currentIndex] = { submittedIndex: sliderIndex, isCorrect }
      return next
    })
  }

  const canNext = currentSubmitted !== null && currentIndex < situations.length - 1
  const next = () => {
    if (!canNext) return
    setCurrentIndex((i) => i + 1)
    setSliderIndex(AXIS_CENTER)
  }

  const axisFocus: "horizontal" | "vertical" = axisId === "agency-fate" ? "horizontal" : "vertical"

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        {currentSituation ? (
          <div className="flex min-w-0 flex-1 flex-col gap-4 text-left">
            <div className="rounded-xl border border-black/10 bg-white/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Situation</p>
              <h3 className="mt-1 text-lg font-bold text-black">{currentSituation.heading}</h3>
              <p className="mt-1 text-sm text-black/70">
                {currentSituation.level} · {currentSituation.topic}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-black/85">{currentSituation.situation}</p>
            </div>

            <div className="rounded-xl border border-black/10 bg-white/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Slide</p>
              <div className="mt-3">
                <DiscreteAxisSlider
                  axis={axisFocus}
                  valueIndex={sliderIndex}
                  onChange={setSliderIndex}
                />
              </div>
              <p className="mt-2 text-xs text-black/60">Center is neutral; Submit requires choosing a side.</p>
            </div>

            {currentSubmitted ? (
              <div className="rounded-xl border border-black/10 bg-white/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Your read</p>
                <p className="mt-2 text-sm leading-relaxed text-black/85">
                  {currentSubmitted.isCorrect ? currentSituation.feedbackCorrect : currentSituation.feedbackIncorrect}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Consequence(s)</p>
                  {orderedLiveQuadrants.length === 0 ? (
                    <p className="mt-2 text-sm text-black/70">Move the slider to reveal consequences.</p>
                  ) : (
                    <div className="mt-2 space-y-3">
                      {orderedLiveQuadrants.map((q) => (
                        <div key={q} className={cn("rounded-lg border border-black/10 bg-white/60 p-3")}>
                          <p className="text-xs font-semibold text-black/60">{q}</p>
                          <p className="mt-1 text-sm leading-relaxed text-black/85">{currentSituation.consequences[q]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
              <div className="mt-3 text-center">
                <button
                  type="button"
                  className={cn(
                    demoPrimaryCtaConstrainedClassName,
                    demoPrimaryCtaNativeFocusClassName,
                    canContinue ? "" : "opacity-60"
                  )}
                  disabled={!canContinue || !onComplete}
                  onClick={() => onComplete?.()}
                >
                  Continue
                </button>
                {!canContinue && allSubmitted ? (
                  <p className="mt-2 text-sm text-black/60">To continue, both situations must be submitted on the correct side.</p>
                ) : null}
              </div>
            ) : (
              <p className="text-xs text-black/55">
                Situation {currentIndex + 1} of {situations.length}
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm text-black/70">No situations configured.</div>
        )}

        <div className="flex min-w-0 flex-none items-center justify-center">
          <QuadrantAxesModel
            mode="singleAxisQuiz"
            focusAxis={axisFocus}
            horizontalIndex={axisId === "agency-fate" ? sliderIndex : AXIS_CENTER}
            verticalIndex={axisId === "self-intact-dissolved" ? sliderIndex : AXIS_CENTER}
            onAxisIndexChange={(axis, index) => {
              if (axis !== axisFocus) return
              setSliderIndex(index)
            }}
          />
        </div>
      </div>
    </div>
  )
}

