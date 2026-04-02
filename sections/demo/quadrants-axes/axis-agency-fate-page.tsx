"use client"

import * as React from "react"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
} from "@/sections/demo/demo-ui"
import { AxisSliderQuiz } from "@/components/axis-slider-quiz"
import { AXIS_AGENCY_FATE_SITUATIONS } from "@/sections/demo/quadrants-axes/quadrants-axes-data"

export type AxisAgencyFatePageProps = {
  onContinue?: () => void
}

export function AxisAgencyFatePage({ onContinue }: AxisAgencyFatePageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE} dataActivity="axis-agency-fate">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <h2 className={demoActivityHeadingClassName}>Axis 1: Agency &harr; &harr; Fate</h2>
          <p className={demoActivityInstructionClassName}>
            For each situation, choose the slider position that best describes how teaching will feel for learners.
          </p>
        </div>

        <AxisSliderQuiz axisId="agency-fate" situations={AXIS_AGENCY_FATE_SITUATIONS} onComplete={onContinue} />
      </div>
    </DemoStyleLayout>
  )
}

