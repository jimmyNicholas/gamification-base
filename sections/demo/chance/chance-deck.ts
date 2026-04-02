export type PlayingCard = {
  id: string
  rank: string
  suit: "spades" | "hearts" | "diamonds" | "clubs"
}

const SUITS: PlayingCard["suit"][] = ["spades", "hearts", "diamonds", "clubs"]
const RANKS = ["A", "K", "Q", "J"] as const

/** 4×4 = 16 cards: every suit with A, K, Q, J */
export function buildChanceDeck(): PlayingCard[] {
  const cards: PlayingCard[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: `${suit}-${rank}`, rank, suit })
    }
  }
  return cards
}

export function suitSymbol(suit: PlayingCard["suit"]): string {
  switch (suit) {
    case "spades":
      return "\u2660"
    case "hearts":
      return "\u2665"
    case "diamonds":
      return "\u2666"
    case "clubs":
      return "\u2663"
  }
}

export function isRedSuit(suit: PlayingCard["suit"]): boolean {
  return suit === "hearts" || suit === "diamonds"
}
