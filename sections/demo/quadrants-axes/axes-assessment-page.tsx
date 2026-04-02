"use client"

import * as React from "react"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
} from "@/sections/demo/demo-ui"
import { AxesAssessmentAPlus } from "@/components/axes-assessment-a-plus"
import { AXES_ASSESSMENT_SITUATIONS } from "@/sections/demo/quadrants-axes/quadrants-axes-data"

export type AxesAssessmentPageProps = {
  onContinue?: () => void
}

export function AxesAssessmentPage({ onContinue }: AxesAssessmentPageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE} dataActivity="axes-assessment">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <h2 className={demoActivityHeadingClassName}>A+ Assessment</h2>
          <p className={demoActivityInstructionClassName}>
            For each situation, set both axes. Submit reveals the consequence for your current axis positions.
          </p>
        </div>

        <AxesAssessmentAPlus situations={AXES_ASSESSMENT_SITUATIONS} onComplete={onContinue} />
      </div>
    </DemoStyleLayout>
  )
}

