import type { QuadrantId } from "@/lib/storyboard-component-contracts"

/** One assessment situation (presentation order): learner quadrant vs ideal. */
export type AssessmentSituationResult = {
  chosen: QuadrantId
  ideal: QuadrantId
}

export type DemoMatchOutcomes = {
  competitionTimeMs: number | null
  /** One animal emoji from the competition match grid, shown on the Match the Four card. */
  competitionAnimalEmoji: string | null
  competitionReplayCount: number
  chanceQuestionNumber: number | null
  chanceAnswer: string | null
  roleplayHatLabel: string | null
  roleplayHatImageSrc: string | null
  roleplayTomResponse: string | null
  chaosQ1Answer: string | null
  chaosSkills: readonly string[]
  // Recognition tracking
  recognitionMatchMistakes: number
  recognitionCardFlips: number
  recognitionReflectionUsed: boolean
  /** Axis analysis section (book): label along horizontal axis — Agency or Fate. */
  axisAgencyQ1Choice: string | null
  axisAgencyQ2Choice: string | null
  /** Axis analysis section: label along vertical axis — Self-intact or Self-dissolved. */
  axisSelfQ1Choice: string | null
  axisSelfQ2Choice: string | null
  /** Four situations in Assessment (axisTogether), in presentation order (situation 1–4). */
  assessmentSituationResults: readonly [
    AssessmentSituationResult | null,
    AssessmentSituationResult | null,
    AssessmentSituationResult | null,
    AssessmentSituationResult | null,
  ]
  /** Final reflection page: learner used the free-text box. */
  reflectionFinalTextUsed: boolean
}

export function initialDemoMatchOutcomes(): DemoMatchOutcomes {
  return {
    competitionTimeMs: null,
    competitionAnimalEmoji: null,
    competitionReplayCount: 0,
    chanceQuestionNumber: null,
    chanceAnswer: null,
    roleplayHatLabel: null,
    roleplayHatImageSrc: null,
    roleplayTomResponse: null,
    chaosQ1Answer: null,
    chaosSkills: [],
    recognitionMatchMistakes: 0,
    recognitionCardFlips: 0,
    recognitionReflectionUsed: false,
    axisAgencyQ1Choice: null,
    axisAgencyQ2Choice: null,
    axisSelfQ1Choice: null,
    axisSelfQ2Choice: null,
    assessmentSituationResults: [null, null, null, null] as DemoMatchOutcomes["assessmentSituationResults"],
    reflectionFinalTextUsed: false,
  }
}
