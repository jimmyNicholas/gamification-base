"use client"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"

import { ANIMAL_MATCH_DEMO } from "./animal-match-demo"
import { CustomTimedMatch } from "./custom-timed-match"

type CompetitionActivityPageProps = {
  onNextGame?: (payload?: { timeMs: number }) => void
}

export function CompetitionActivityPage({ onNextGame }: CompetitionActivityPageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE}>
      <div className="flex w-full flex-col items-stretch">
        <CustomTimedMatch flatSurface {...ANIMAL_MATCH_DEMO} onNextGame={onNextGame} />
      </div>
    </DemoStyleLayout>
  )
}
