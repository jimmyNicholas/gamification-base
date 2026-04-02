/** A2–B1 English prompts with four choices (A–D). Varied task types. */
export type ChanceQuestion = {
  id: string
  prompt: string
  choices: [string, string, string, string]
  /** grammar | vocab | reading | situational */
  type: "geography" | "science" | "history" | "nature" | "food" | "sport" | "pop_culture" | "numbers"
}

export const CHANCE_QUESTION_BANK: ChanceQuestion[] = [
  {
    id: "q1",
    type: "geography",
    prompt: "What is the capital of Japan?",
    choices: [
      "Beijing",
      "Seoul",
      "Tokyo",
      "Bangkok",
    ],
  },
  {
    id: "q2",
    type: "geography",
    prompt: "Which country is the Amazon River in?",
    choices: [
      "Argentina",
      "Brazil",
      "Mexico",
      "Peru",
    ],
  },
  {
    id: "q3",
    type: "science",
    prompt: "What do plants need from the sun to grow?",
    choices: [
      "Water",
      "Soil",
      "Light",
      "Wind",
    ],
  },
  {
    id: "q4",
    type: "science",
    prompt: "How many legs does a spider have?",
    choices: [
      "Six",
      "Eight",
      "Ten",
      "Four",
    ],
  },
  {
    id: "q5",
    type: "history",
    prompt: "Who was the first person to walk on the moon?",
    choices: [
      "Yuri Gagarin",
      "Buzz Aldrin",
      "Neil Armstrong",
      "John Glenn",
    ],
  },
  {
    id: "q6",
    type: "history",
    prompt: "Which city was the Titanic going to when it sank?",
    choices: [
      "London",
      "Boston",
      "New York",
      "Montreal",
    ],
  },
  {
    id: "q7",
    type: "nature",
    prompt: "What is the largest animal in the world?",
    choices: [
      "African elephant",
      "Great white shark",
      "Blue whale",
      "Giraffe",
    ],
  },
  {
    id: "q8",
    type: "nature",
    prompt: "How many seasons are there in a year?",
    choices: [
      "Two",
      "Three",
      "Four",
      "Five",
    ],
  },
  {
    id: "q9",
    type: "food",
    prompt: "Which country does sushi come from?",
    choices: [
      "China",
      "South Korea",
      "Thailand",
      "Japan",
    ],
  },
  {
    id: "q10",
    type: "food",
    prompt: "What is the main ingredient in guacamole?",
    choices: [
      "Tomato",
      "Avocado",
      "Mango",
      "Onion",
    ],
  },
  {
    id: "q11",
    type: "sport",
    prompt: "How many players are on a football team on the field?",
    choices: [
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
    ],
  },
  {
    id: "q12",
    type: "sport",
    prompt: "In which sport do you use a racket and a small yellow ball?",
    choices: [
      "Badminton",
      "Table tennis",
      "Tennis",
      "Squash",
    ],
  },
  {
    id: "q13",
    type: "pop_culture",
    prompt: "Which animal is the symbol of the World Wildlife Fund (WWF)?",
    choices: [
      "Polar bear",
      "Tiger",
      "Giant panda",
      "Snow leopard",
    ],
  },
  {
    id: "q14",
    type: "pop_culture",
    prompt: "What colour is the sky on a clear day?",
    choices: [
      "Green",
      "Blue",
      "White",
      "Grey",
    ],
  },
  {
    id: "q15",
    type: "numbers",
    prompt: "How many hours are there in a day?",
    choices: [
      "12",
      "18",
      "24",
      "48",
    ],
  },
  {
    id: "q16",
    type: "numbers",
    prompt: "How many days are in the month of February in a normal year?",
    choices: [
      "28",
      "29",
      "30",
      "31",
    ],
  },
]

function stableHash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Four candidate questions from the ordered picks (slot 1..4); dedupes indices when possible. */
export function resolveCandidateQuestions(
  orderedCardIds: [string, string, string, string],
  bank: ChanceQuestion[] = CHANCE_QUESTION_BANK
): ChanceQuestion[] {
  const used = new Set<number>()
  const out: ChanceQuestion[] = []
  for (let slot = 0; slot < 4; slot++) {
    const id = orderedCardIds[slot]!
    let idx = stableHash(`${id}:slot${slot}`) % bank.length
    let guard = 0
    while (used.has(idx) && guard < bank.length) {
      idx = (idx + 1) % bank.length
      guard++
    }
    used.add(idx)
    out.push(bank[idx]!)
  }
  return out
}
