import type { MimicryBackgroundId, MimicryCharacterId } from "./mimicry-assets"

/** Append to image URLs when replacing files under `public/` so dev/prod caches refresh. */
export const MIMICRY_IMAGE_CACHE_BUST = "2"

export type BubbleKind = "speech" | "thought"

export type BubbleLine = {
  kind: BubbleKind
  /** Shown above bubble; omit or use role name */
  speaker?: string
  text: string
}

export type SceneChoice = {
  id: string
  label: string
  /** All choices in a beat advance the story — typically the same next id. */
  nextSceneId: string
  /** Square tile image (e.g. hat); when set, UI shows image button instead of text row. */
  imageSrc?: string
}

export type MimicryFreeform = {
  placeholder: string
  footnote: string
  nextSceneId: string
}

export type MimicryAutoAdvance = {
  nextSceneId: string
  /** Default a few seconds if omitted. */
  delayMs?: number
}

export type MimicryScene = {
  id: string
  backgroundId: MimicryBackgroundId
  /** Who appears centered on the stage (placeholder art). */
  focusCharacterId: MimicryCharacterId
  lines: BubbleLine[]
  /** Bold prompt shown with choices (last line) or with freeform; optional. */
  prompt?: string
  /** Two or three options; no wrong answers. Omit or empty when using freeform or linear continue. */
  choices: SceneChoice[]
  /** When set and `choices` is empty, last CONTINUE goes here (no choice panel). */
  continueToSceneId?: string
  /** `freeform`: after lines, show textarea instead of choice buttons. */
  /** `autoAdvance`: no UI chrome; client shows transition copy then advances (see page). */
  interaction?: "choices" | "freeform" | "autoAdvance"
  freeform?: MimicryFreeform
  /** Required when `interaction` is `autoAdvance`. */
  autoAdvance?: MimicryAutoAdvance
}

export const MIMICRY_SCENES = [
  {
    id: "judyIntro",
    backgroundId: "hatShop",
    focusCharacterId: "judyThoughtful",
    lines: [
      {
        kind: "thought",
        speaker: "Judy",
        text: "You are Judy, the owner of a small cafe. You are 39, live in the inner city and enjoy reading, spending time with your dog, Rupert, and looking stylish.",
      },
    ],
    choices: [],
    continueToSceneId: "weddingHats",
  },
  {
    id: "weddingHats",
    backgroundId: "mountains",
    focusCharacterId: "judyThoughtful",
    lines: [
      {
        kind: "speech",
        speaker: "Judy",
        text: "This weekend, you are going to a friend's wedding in the mountains. The weather is going to be sunny and not too hot. You decide to take a hat to complement your dress.",
      },
    ],
    prompt: "Which hat do you choose?",
    choices: [
      {
        id: "hat_beret",
        label: "Beret",
        nextSceneId: "hatAffirmation",
        imageSrc: `/assets/mimicry/beret.png?v=${MIMICRY_IMAGE_CACHE_BUST}`,
      },
      {
        id: "hat_fedora",
        label: "Fedora",
        nextSceneId: "hatAffirmation",
        imageSrc: `/assets/mimicry/fedora.png?v=${MIMICRY_IMAGE_CACHE_BUST}`,
      },
      {
        id: "hat_sunhat",
        label: "Sun hat",
        nextSceneId: "hatAffirmation",
        imageSrc: `/assets/mimicry/sunhat.png?v=${MIMICRY_IMAGE_CACHE_BUST}`,
      },
    ],
  },
  {
    id: "hatAffirmation",
    backgroundId: "mountains",
    focusCharacterId: "judyThoughtful",
    lines: [],
    choices: [],
    interaction: "autoAdvance",
    autoAdvance: { nextSceneId: "cafeConfront", delayMs: 3200 },
  },
  {
    id: "cafeConfront",
    backgroundId: "cafe",
    focusCharacterId: "tom",
    interaction: "freeform",
    lines: [
      {
        kind: "speech",
        speaker: "Narration",
        text: "Recently, you have been having issues with a barista, Tom, who is constantly on his phone during work. You have decided to bring it up in an informal meeting in the staffroom. Tom becomes defensive and calls you a bad boss.",
      },
    ],
    prompt: "How do you respond?",
    choices: [],
    freeform: {
      placeholder: "As Judy, you say...",
      footnote: "There is no right answer. Just respond as Judy would.",
      nextSceneId: "resolution",
    },
  },
] as const satisfies readonly MimicryScene[]

export type MimicrySceneId = (typeof MIMICRY_SCENES)[number]["id"]

export function getSceneById(id: string): MimicryScene | undefined {
  return MIMICRY_SCENES.find((s) => s.id === id)
}
