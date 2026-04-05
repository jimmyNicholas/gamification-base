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
  chaosQ2Skills: readonly string[]
  // Recognition tracking
  recognitionMatchMistakes: number
  recognitionCardFlips: number
  recognitionReflectionUsed: boolean
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
    chaosQ2Skills: [],
    recognitionMatchMistakes: 0,
    recognitionCardFlips: 0,
    recognitionReflectionUsed: false,
  }
}
