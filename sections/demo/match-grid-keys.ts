/** Row-major 2×2: slot index 0 = top-left … 3 = bottom-right (shuffled items fill these slots). */
export const MATCH_GRID_LEFT_KEY_TO_INDEX: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
}

export const MATCH_GRID_RIGHT_KEY_TO_INDEX: Record<string, number> = {
  "7": 0,
  "8": 1,
  "9": 2,
  "0": 3,
}

export const MATCH_GRID_LEFT_SLOT_KEYS = ["1", "2", "3", "4"] as const
export const MATCH_GRID_RIGHT_SLOT_KEYS = ["7", "8", "9", "0"] as const
