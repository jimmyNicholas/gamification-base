import type { QuadrantId } from "@/lib/storyboard-component-contracts"

/** Post–recognition book: drag each activity onto its Caillois category (two per quadrant). */
export type BookDragActivity = { id: string; label: string; quadrant: QuadrantId }

export const BOOK_DRAG_ACTIVITIES: BookDragActivity[] = [
  { id: "debate", label: "Debate tournament", quadrant: "Q1" },
  { id: "kahoot", label: "Kahoot! quiz", quadrant: "Q1" },
  { id: "conv-dice", label: "Conversation dice", quadrant: "Q3" },
  { id: "lucky-dip", label: "Lucky dip questions", quadrant: "Q3" },
  { id: "mock-interview", label: "Mock job interview", quadrant: "Q2" },
  { id: "cust-sim", label: "Customer service simulation", quadrant: "Q2" },
  { id: "running-dict", label: "Running dictation", quadrant: "Q4" },
  { id: "word-assoc", label: "Word association", quadrant: "Q4" },
]
