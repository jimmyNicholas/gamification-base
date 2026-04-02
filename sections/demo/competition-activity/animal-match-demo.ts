import type { TimedMatchLeftItem, TimedMatchRightItem } from "./custom-timed-match"

export const ANIMAL_MATCH_DEMO = {
  title: "Match the animal with their name",
  unlockSignalId: "section-2-ready",
  leftItems: [
    { id: "l1", emoji: "🐶", matchId: "dog" },
    { id: "l2", emoji: "🐈", matchId: "cat" },
    { id: "l3", emoji: "🦆", matchId: "duck" },
    { id: "l4", emoji: "🐟", matchId: "fish" },
  ] satisfies TimedMatchLeftItem[],
  rightItems: [
    { id: "r1", label: "Mr. Quacks the duck", matchId: "duck" },
    { id: "r2", label: "Rupert the dog", matchId: "dog" },
    { id: "r3", label: "Boots the cat", matchId: "cat" },
    { id: "r4", label: "Bruce the fish", matchId: "fish" },
  ] satisfies TimedMatchRightItem[],
  leaderboard: [
    { name: "Rupert", timeMs: 5400 },
    { name: "Bruce", timeMs: 8200 },
    { name: "Mr. Quacks", timeMs: 10700 },
    { name: "Boots", timeMs: 13100 },
  ],
}
