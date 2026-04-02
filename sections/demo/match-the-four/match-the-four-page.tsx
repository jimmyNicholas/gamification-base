"use client"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityCopyBlockClassName,
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
  demoStageMatchTheFourPanelClassName,
} from "@/sections/demo/demo-ui"

import type { DemoMatchOutcomes } from "@/sections/demo/match-the-four/demo-match-outcomes"
import { MatchTheFourActivity } from "@/sections/demo/match-the-four/match-the-four-activity"

export type MatchTheFourPageProps = {
  outcomes: DemoMatchOutcomes
  onContinue?: () => void
}

/** §2.6 — Match the Four (separate from Chaos; same nav slot as course `matchTheFour` phase). */
export function MatchTheFourPage({ outcomes, onContinue }: MatchTheFourPageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE}>
      <div className="flex w-full flex-col gap-6">
        <div className={demoActivityCopyBlockClassName}>
          <h2 className={demoActivityHeadingClassName}>You just played four different games.</h2>
          <h2 className={demoActivityInstructionClassName}>Match each game to its category</h2>
        </div>

        <div className={demoStageMatchTheFourPanelClassName}>
          <MatchTheFourActivity outcomes={outcomes} onContinue={onContinue} />
        </div>
      </div>
    </DemoStyleLayout>
  )
}
