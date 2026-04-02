import type { QuadrantId } from "@/lib/storyboard-component-contracts"

/** Labels/icons for quadrant tiles in match-reveal mode (Match the Four + Recognition). */
export const QUADRANT_MATCH_REVEAL_CARDS: Record<QuadrantId, { label: string; icon: string }> = {
  Q1: { label: "competition", icon: "🏆" },
  Q2: { label: "roleplay", icon: "🎭" },
  Q3: { label: "chance", icon: "🎲" },
  Q4: { label: "chaos", icon: "💥" },
}
