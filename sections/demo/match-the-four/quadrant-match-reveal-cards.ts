import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { QUADRANT_PLAY_CATEGORY_TILES } from "@/sections/demo/quadrants-axes/quadrants-axes-data"

/** Labels/icons for quadrant tiles in match-reveal mode (Match the Four + Recognition). */
export const QUADRANT_MATCH_REVEAL_CARDS: Record<QuadrantId, { label: string; icon: string }> =
  QUADRANT_PLAY_CATEGORY_TILES
