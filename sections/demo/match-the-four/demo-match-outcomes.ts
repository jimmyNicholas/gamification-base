export type DemoMatchOutcomes = {
  competitionTimeMs: number | null
  /** One animal emoji from the competition match grid, shown on the Match the Four card. */
  competitionAnimalEmoji: string | null
  chanceAnswer: string | null
  roleplayHatLabel: string | null
  roleplayHatImageSrc: string | null
  chaosQ2Skills: readonly string[]
}

export function initialDemoMatchOutcomes(): DemoMatchOutcomes {
  return {
    competitionTimeMs: null,
    competitionAnimalEmoji: null,
    chanceAnswer: null,
    roleplayHatLabel: null,
    roleplayHatImageSrc: null,
    chaosQ2Skills: [],
  }
}
