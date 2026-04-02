import type { DemoMatchOutcomes } from "@/sections/demo/match-the-four/demo-match-outcomes"

const STORAGE_KEY = "gamification-base:demo-match-outcomes"

function parseStored(json: string): DemoMatchOutcomes | null {
  try {
    const v = JSON.parse(json) as unknown
    if (!v || typeof v !== "object") return null
    const o = v as Record<string, unknown>
    return {
      competitionTimeMs:
        o.competitionTimeMs === null || typeof o.competitionTimeMs === "number"
          ? (o.competitionTimeMs as number | null)
          : null,
      competitionAnimalEmoji:
        o.competitionAnimalEmoji === null || typeof o.competitionAnimalEmoji === "string"
          ? (o.competitionAnimalEmoji as string | null)
          : null,
      chanceAnswer:
        o.chanceAnswer === null || typeof o.chanceAnswer === "string"
          ? (o.chanceAnswer as string | null)
          : null,
      roleplayHatLabel:
        o.roleplayHatLabel === null || typeof o.roleplayHatLabel === "string"
          ? (o.roleplayHatLabel as string | null)
          : null,
      roleplayHatImageSrc:
        o.roleplayHatImageSrc === null || typeof o.roleplayHatImageSrc === "string"
          ? (o.roleplayHatImageSrc as string | null)
          : null,
      chaosQ2Skills: Array.isArray(o.chaosQ2Skills)
        ? o.chaosQ2Skills.filter((x): x is string => typeof x === "string")
        : [],
    }
  } catch {
    return null
  }
}

export function loadDemoMatchOutcomesFromSession(): DemoMatchOutcomes | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return parseStored(raw)
  } catch {
    return null
  }
}

export function saveDemoMatchOutcomesToSession(outcomes: DemoMatchOutcomes): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(outcomes))
  } catch {
    // ignore quota / private mode
  }
}

export function clearDemoMatchOutcomesSession(): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
