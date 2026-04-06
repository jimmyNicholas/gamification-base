/** Row-major 2×2: slot index 0 = top-left … 3 = bottom-right (shuffled items fill these slots). */
export const MATCH_GRID_LEFT_KEY_TO_INDEX: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
}

export const MATCH_GRID_RIGHT_KEY_TO_INDEX: Record<string, number> = {
  "5": 0,
  "6": 1,
  "7": 2,
  "8": 3,
}

export const MATCH_GRID_LEFT_SLOT_KEYS = ["1", "2", "3", "4"] as const
export const MATCH_GRID_RIGHT_SLOT_KEYS = ["5", "6", "7", "8"] as const
