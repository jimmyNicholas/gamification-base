export type CategoryVisualToken = {
  category: "simulation" | "chance" | "performance" | "disruption"
  label: string
  icon: string
  color: string
  highContrastBorderColor: string
}

export const CATEGORY_VISUAL_TOKENS: CategoryVisualToken[] = [
  {
    category: "simulation",
    label: "Mimicry / Simulation",
    icon: "🧩",
    color: "#2563eb",
    highContrastBorderColor: "#93c5fd",
  },
  {
    category: "chance",
    label: "Alea / Chance",
    icon: "🎲",
    color: "#16a34a",
    highContrastBorderColor: "#86efac",
  },
  {
    category: "performance",
    label: "Agon / Performance",
    icon: "🏆",
    color: "#ea580c",
    highContrastBorderColor: "#fdba74",
  },
  {
    category: "disruption",
    label: "Ilinx / Disruption",
    icon: "⚡",
    color: "#a21caf",
    highContrastBorderColor: "#f0abfc",
  },
]

export const AXIS_ASSET = {
  id: "axis-grid",
  label: "Agency-Fate and Self-Intact/Self-Dissolved axes",
}

export const QUADRANT_ASSET = {
  id: "quadrant-grid",
  label: "2x2 consequence quadrant",
}
