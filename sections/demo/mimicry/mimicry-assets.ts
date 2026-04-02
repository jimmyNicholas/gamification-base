export type MimicryCharacter = {
  id: string
  label: string
  /** Shown in tiles and preview when `imageSrc` is absent or fails to load. */
  emoji: string
  /** Center / accent for character placeholder (circle behind emoji). */
  accentBackground: string
  /** Remote URL (e.g. Unsplash) or `/...` under `public/`. */
  imageSrc?: string
}

export type MimicryBackground = {
  id: string
  label: string
  cssBackground: string
  /** Remote URL (e.g. Unsplash) or `/...` under `public/`. */
  imageSrc?: string
}

/** Unsplash CDN base (`images.unsplash.com` is allowlisted in `next.config.ts`). */
const U = "https://images.unsplash.com"

/**
 * Character art (full-body PNGs) under `public/`; backgrounds from Unsplash.
 * Design doc 2.4 — Roleplay (Mimicry).
 */
export const MIMICRY_CHARACTERS = [
  {
    id: "judyNeutral",
    label: "Judy — neutral",
    emoji: "👩‍🦰",
    accentBackground: "linear-gradient(145deg, #9f1239 0%, #db2777 45%, #f472b6 100%)",
    imageSrc: "/mimicry-judy-casual.png",
  },
  {
    id: "judyThoughtful",
    label: "Judy — thoughtful",
    emoji: "👩‍🦰",
    accentBackground: "linear-gradient(145deg, #831843 0%, #be185d 42%, #f9a8d4 100%)",
    imageSrc: "/mimicry-judy-casual.png",
  },
  {
    id: "judySpeaking",
    label: "Judy — speaking",
    emoji: "👩‍🦰",
    accentBackground: "linear-gradient(145deg, #881337 0%, #e11d48 48%, #fda4af 100%)",
    imageSrc: "/mimicry-judy-casual.png",
  },
  {
    id: "tom",
    label: "Tom",
    emoji: "👨‍🦱",
    accentBackground: "linear-gradient(145deg, #1e3a5f 0%, #334155 50%, #64748b 100%)",
    imageSrc: "/mimicry-tom.png",
  },
  {
    id: "weddingFriend",
    label: "Wedding friend",
    emoji: "🙂",
    accentBackground: "linear-gradient(145deg, #6d28d9 0%, #8b5cf6 50%, #c4b5fd 100%)",
    imageSrc: "/mimicry-judy-formal.png",
  },
] as const satisfies readonly MimicryCharacter[]

/** Scene backgrounds from Unsplash; `cssBackground` is fallback if images fail. */
export const MIMICRY_BACKGROUNDS = [
  {
    id: "cafe",
    label: "Kitchen",
    cssBackground:
      "linear-gradient(180deg, #292524 0%, #57534e 22%, #78716c 40%, #d6d3d1 100%)",
    // brown wooden kitchen — https://unsplash.com/photos/brown-wooden-kitchen-cupboard-near-wall-ZZxmc66SjfM
    imageSrc: `${U}/photo-1567880905822-56f8e06fe630?auto=format&fit=crop&w=1920&h=1080&q=80`,
  },
  {
    id: "mountains",
    label: "Mountain setting",
    cssBackground:
      "linear-gradient(180deg, #38bdf8 0%, #bae6fd 35%, #86efac 55%, #4ade80 75%, #166534 100%)",
    imageSrc: `${U}/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&h=1080&q=80`,
  },
  {
    id: "hatShop",
    label: "Hat shop",
    cssBackground:
      "linear-gradient(145deg, #fdf4ff 0%, #fae8ff 40%, #e9d5ff 70%, #c084fc 100%)",
    // hat display — https://unsplash.com/photos/a-display-of-hats-in-a-hat-shop-mxO7q2tfrXc
    imageSrc: `${U}/photo-1643789898717-69771e559de3?auto=format&fit=crop&w=1920&h=1080&q=80`,
  },
  {
    id: "livingRoom",
    label: "Living room",
    cssBackground:
      "linear-gradient(165deg, #e7e5e4 0%, #d6d3d1 35%, #a8a29e 70%, #78716c 100%)",
    // modern neutral living room — https://unsplash.com/photos/modern-living-room-with-a-chic-neutral-color-scheme--jk2BBoQxSk
    imageSrc: `${U}/photo-1745429523617-0d837856ca35?auto=format&fit=crop&w=1920&h=1080&q=80`,
  },
  {
    id: "weddingGarden",
    label: "Wedding garden",
    cssBackground:
      "linear-gradient(165deg, #14532d 0%, #22c55e 35%, #fde047 55%, #f0abfc 78%, #faf5ff 100%)",
    imageSrc: `${U}/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&h=1080&q=80`,
  },
  {
    id: "cityStreet",
    label: "Inner-city street",
    cssBackground:
      "linear-gradient(180deg, #64748b 0%, #94a3b8 25%, #cbd5e1 50%, #e2e8f0 100%)",
    imageSrc: `${U}/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&h=1080&q=80`,
  },
] as const satisfies readonly MimicryBackground[]

export type MimicryCharacterId = (typeof MIMICRY_CHARACTERS)[number]["id"]
export type MimicryBackgroundId = (typeof MIMICRY_BACKGROUNDS)[number]["id"]

export function getCharacterById(id: MimicryCharacterId): MimicryCharacter {
  const c = MIMICRY_CHARACTERS.find((x) => x.id === id)
  if (!c) throw new Error(`Unknown character: ${id}`)
  return c
}

export function getBackgroundById(id: MimicryBackgroundId): MimicryBackground {
  const b = MIMICRY_BACKGROUNDS.find((x) => x.id === id)
  if (!b) throw new Error(`Unknown background: ${id}`)
  return b
}
