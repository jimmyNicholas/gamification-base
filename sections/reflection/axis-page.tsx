"use client"

import * as React from "react"

import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import { AXIS_CENTER, type AxisIndex } from "@/components/discrete-axis-slider"
import { ReflectionLayout } from "@/sections/reflection/reflection-layout"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { cn } from "@/lib/utils"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"

export type AxisPageProps = {
  onContinue?: () => void
}

export function AxisPage({ onContinue }: AxisPageProps) {
  const [horizontalIndex, setHorizontalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [verticalIndex, setVerticalIndex] = React.useState<AxisIndex>(AXIS_CENTER)

  return (
    <ReflectionLayout dataActivity="axis-page">
      <TwoColumnActivityStageLayout
        reserveTopTitleSpace={true}
        leftVerticalAlign="start"
        leftContent={
          <div className="flex min-h-[min(52vh,420px)] w-full min-w-0 flex-col gap-4 self-stretch sm:gap-5 lg:min-h-0 lg:h-full px-10">
            <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
              <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">You might have noticed that these four categories share some similarities and differences.</h2>
              <p>Each axis runs between two extremes. Agency and fate on one. Self-intact and self-dissolved on the other.</p>
              <p>In this section we&apos;ll look at each axis more closely. The strengths, the weaknesses, and how to use it as a quick diagnostic tool through common situations.</p>
            </div>

            {onContinue ? (
              <div className="mt-auto flex w-full flex-col items-center pt-2 sm:pt-4">
                <button
                  type="button"
                  className={cn(
                    demoPrimaryCtaConstrainedClassName,
                    demoPrimaryCtaNativeFocusClassName,
                    "w-full max-w-lg"
                  )}
                  onClick={() => onContinue()}
                >
                  Continue
                </button>
              </div>
            ) : null}
          </div>
        }
        rightContent={
          <div className="flex w-full min-w-0 justify-center">
            <QuadrantAxesModel
              mode="singleAxisQuiz"
              focusAxis="both"
              horizontalIndex={horizontalIndex}
              verticalIndex={verticalIndex}
              onAxisIndexChange={(axis, index) => {
                if (axis === "horizontal") {
                  setHorizontalIndex(index)
                  return
                }
                setVerticalIndex(index)
              }}
              className="h-full w-full max-w-[620px]"
            />
          </div>
        }
      />
    </ReflectionLayout>
  )
}

// axis quiz intro
{/* <div className="flex w-full min-w-0 justify-center">
<QuadrantAxesModel
mode="book"
bookShowAxes={false}
bookFlippable={false}
bookAxesOpacity={0.25}
axisStates={{ horizontal: "inactiveGrey", vertical: "inactiveGrey" }}
className="h-full w-full max-w-[620px] p-8"
/>
</div> */}

// axis quiz agency/fate
{/* <div className="flex w-full min-w-0 justify-center">
            <QuadrantAxesModel
              mode="singleAxisQuiz"
              focusAxis="horizontal"
              horizontalIndex={horizontalIndex}
              onAxisIndexChange={(axis, index) => {
                if (axis !== "horizontal") return
                setHorizontalIndex(index)
              }}
              className="h-full w-full max-w-[620px]"
            />
          </div> */}

// axis quiz self-intact/self-dissolved
{/* <div className="flex w-full min-w-0 justify-center">
  <QuadrantAxesModel
    mode="singleAxisQuiz"
    focusAxis="vertical"
    verticalIndex={verticalIndex}
    onAxisIndexChange={(axis, index) => {
      if (axis !== "vertical") return
      setVerticalIndex(index)
    }}
    className="h-full w-full max-w-[620px]"
  />
</div> */}

// axis quiz both
{/* <div className="flex w-full min-w-0 justify-center">
<QuadrantAxesModel
  mode="singleAxisQuiz"
  focusAxis="both"
  horizontalIndex={horizontalIndex}
  verticalIndex={verticalIndex}
  onAxisIndexChange={(axis, index) => {
    if (axis === "horizontal") {
      setHorizontalIndex(index)
      return
    }
    setVerticalIndex(index)
  }}
  className="h-full w-full max-w-[620px]"
/>
</div> */}