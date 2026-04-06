import Image from "next/image"
import type { ReactNode } from "react"

import { ChanceWheelPreview } from "@/components/chance-wheel"
import { ChaosSkillsMicroArena } from "@/sections/demo/chaos/chaos-skills-micro-arena"
import { MIMICRY_IMAGE_CACHE_BUST } from "@/sections/demo/mimicry/mimicry-scenario"
import { ANIMAL_MATCH_DEMO } from "@/sections/demo/competition-activity/animal-match-demo"
import { formatMmSs } from "@/lib/format-mm-ss"
import type { DemoMatchOutcomes } from "./demo-match-outcomes"

export type CategoryId = "competition" | "chance" | "roleplay" | "chaos"

const DEFAULT_ROLEPLAY_BERET_SRC = `/assets/mimicry/beret.png?v=${MIMICRY_IMAGE_CACHE_BUST}`
const FALLBACK_COMPETITION_ANIMAL = ANIMAL_MATCH_DEMO.leftItems[0]?.emoji ?? "🐶"

/** `compact` — Match the Four grid cards. `quadrant` — Recognition 2×2 tiles (centered, capped size). */
export type BuildLeftCardDensity = "compact" | "quadrant"

export function buildLeftCard(
  outcomes: DemoMatchOutcomes,
  matchId: CategoryId,
  density: BuildLeftCardDensity = "compact"
): { content: ReactNode; ariaLabel: string } {
  switch (matchId) {
    case "competition": {
      const emoji = outcomes.competitionAnimalEmoji ?? FALLBACK_COMPETITION_ANIMAL
      const line = outcomes.competitionTimeMs != null ? formatMmSs(outcomes.competitionTimeMs) : "0.0"
      return {
        content: (
          <div
            className={
              density === "quadrant"
                ? "flex min-h-0 w-full flex-col items-center justify-center gap-2 px-1"
                : "flex min-h-0 w-full flex-col items-center justify-center gap-1"
            }
          >
            <span
              className={
                density === "quadrant"
                  ? "text-[clamp(4.25rem,13vw,9.5rem)] leading-none"
                  : "text-[2.5rem] leading-none sm:text-[3rem]"
              }
              aria-hidden
            >
              {emoji}
            </span>
            <span
              className={
                density === "quadrant"
                  ? "tabular-nums text-2xl font-bold text-black sm:text-3xl"
                  : "tabular-nums text-base font-semibold text-black sm:text-lg"
              }
            >
              {line}
            </span>
          </div>
        ),
        ariaLabel: `Competition, your time ${line}`,
      }
    }
    case "chance": {
      const line = outcomes.chanceAnswer ?? "Tokyo"
      return {
        content:
          density === "quadrant" ? (
            <div className="flex w-full max-w-48 flex-col items-center justify-center gap-2">
              <div className="aspect-square w-full max-w-44 shrink-0">
                <ChanceWheelPreview className="h-full w-full max-w-none" />
              </div>
              <span className="text-balance text-center text-sm font-medium leading-snug text-black sm:text-base">{line}</span>
            </div>
          ) : (
            <div className="flex min-h-0 w-full flex-col items-center justify-center gap-1.5">
              <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                <ChanceWheelPreview className="h-full w-full max-w-none" />
              </div>
              <span className="text-balance text-center text-xs leading-snug text-black sm:text-sm">{line}</span>
            </div>
          ),
        ariaLabel: `Chance, your answer: ${line}`,
      }
    }
    case "roleplay": {
      const label = outcomes.roleplayHatLabel ?? "Beret"
      const src = outcomes.roleplayHatImageSrc ?? DEFAULT_ROLEPLAY_BERET_SRC
      return {
        content: (
          <div
            className={
              density === "quadrant"
                ? "flex min-h-0 w-full items-center justify-center p-1"
                : "flex min-h-0 w-full items-center justify-center p-0.5"
            }
          >
            <Image
              src={src}
              alt={label}
              width={density === "quadrant" ? 256 : 120}
              height={density === "quadrant" ? 256 : 120}
              className={
                density === "quadrant"
                  ? "aspect-square w-full max-w-[min(100%,16rem)] rounded-xl object-cover sm:max-w-[min(100%,17.5rem)]"
                  : "max-h-[min(100%,7.5rem)] max-w-[min(100%,7.5rem)] rounded-lg object-cover sm:max-h-[min(100%,8rem)] sm:max-w-[min(100%,8rem)]"
              }
            />
          </div>
        ),
        ariaLabel: `Roleplay, hat chosen: ${label}`,
      }
    }
    case "chaos": {
      const skills = outcomes.chaosSkills
      if (skills.length === 0) {
        const line = "Grammar"
        return {
          content:
            density === "quadrant" ? (
              <span className="rounded-full border-2 border-black/25 bg-black/4 px-4 py-2 text-center text-sm font-semibold text-black sm:text-base">
                {line}
              </span>
            ) : (
              <span className="text-balance text-[0.65rem] leading-snug text-black sm:text-xs">{line}</span>
            ),
          ariaLabel: `Chaos, skills selected: ${line}`,
        }
      }
      return {
        content:
          density === "quadrant" ? (
            <div className="flex h-[min(100%,10rem)] w-full min-h-0 max-w-56 items-center justify-center">
              <ChaosSkillsMicroArena skills={skills} className="h-full w-full min-h-0" />
            </div>
          ) : (
            <div className="flex h-full min-h-36 w-full min-w-0 flex-col sm:min-h-42">
              <ChaosSkillsMicroArena skills={skills} className="h-full min-h-0 w-full flex-1" />
            </div>
          ),
        ariaLabel: `Chaos, skills selected: ${skills.join(", ")}`,
      }
    }
  }
}
