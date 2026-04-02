"use client"

import * as React from "react"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
} from "@/sections/demo/demo-ui"
import { AxisSliderQuiz } from "@/components/axis-slider-quiz"
import { AXIS_SELF_INTACT_DISSOLVED_SITUATIONS } from "@/sections/demo/quadrants-axes/quadrants-axes-data"

export type AxisSelfIntactDissolvedPageProps = {
  onContinue?: () => void
}

export function AxisSelfIntactDissolvedPage({ onContinue }: AxisSelfIntactDissolvedPageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE} dataActivity="axis-self-intact-dissolved">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <h2 className={demoActivityHeadingClassName}>Axis 2: Self-intact &Hat; Self-dissolved</h2>
          <p className={demoActivityInstructionClassName}>
            Choose the slider position that best describes how teaching will feel for learners.
          </p>
        </div>

        <AxisSliderQuiz axisId="self-intact-dissolved" situations={AXIS_SELF_INTACT_DISSOLVED_SITUATIONS} onComplete={onContinue} />
      </div>
    </DemoStyleLayout>
  )
}

