import type { QuadrantId } from "@/lib/storyboard-component-contracts"

export type SituationTemplate = {
  heading: string
  level: string
  topic: string
  situation: string
}

export type AxisSituation = SituationTemplate & {
  /** Correct side for this axis: horizontal uses left/right; vertical uses top/bottom. */
  correctSide: "left" | "right" | "top" | "bottom"
  /** Consequences for all 4 quadrants. */
  consequences: Record<QuadrantId, string>
  feedbackCorrect: string
  feedbackIncorrect: string
}

export type AssessmentSituation = SituationTemplate & {
  consequences: Record<QuadrantId, string>
}

export type QuadrantBookCard = {
  front: string
  back: string
}

export const QUADRANT_RANK_BEST_TO_WORST: QuadrantId[] = ["Q1", "Q2", "Q3", "Q4"]

export const QUADRANT_BOOK_CARDS: Partial<Record<QuadrantId, QuadrantBookCard>> = {
  Q1: {
    front: "Agency + Self-intact",
    back: "Students feel in control and psychologically safe. Instruction invites choice, clarity, and coherent practice.",
  },
  Q2: {
    front: "Agency + Self-dissolved",
    back: "Students are expressive and self-driven, but emotional safety is fragile. Activities can feel playful yet retention may drop.",
  },
  Q3: {
    front: "Fate + Self-intact",
    back: "Students benefit from structure and predictable outcomes. Instruction is guided by rules; practice becomes systematic.",
  },
  Q4: {
    front: "Fate + Self-dissolved",
    back: "Students react to uncertainty and disruption. Energetic engagement can come with weaker consolidation of learning goals.",
  },
}

const RELAXED_PREP: Record<QuadrantId, string> = {
  Q1: "You run a vocabulary auction. Teams bid on sentences they think use the illness and injury vocabulary correctly. The class engages well. The vocabulary consolidates. Students leave energised.",
  Q2: "You run a doctor-patient roleplay using the target vocabulary. It runs well but the vocabulary feels incidental. Students enjoy inhabiting the characters but retention is lower than you hoped.",
  Q3: "You run a conversation dice activity. Students roll and must use the vocabulary in their answer. It runs but the target vocabulary comes up randomly rather than systematically. Consolidation is shallow.",
  Q4: "You run a chaos word association chain using illness and injury terms. The activity gets a reaction but the target vocabulary disappears in the noise. A few students mention afterwards it didn't feel like much of a challenge.",
}

export const AXIS_AGENCY_FATE_SITUATIONS: AxisSituation[] = [
  {
    heading: "Relaxed prep",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "It is Sunday evening. You have an upper-intermediate class tomorrow morning on illnesses and injuries. You have time to prepare properly. The group is established, motivated, and gets along well. You want to run a game in the second hour to consolidate vocabulary from last week. Which quadrant fits this situation?",
    correctSide: "left",
    consequences: RELAXED_PREP,
    feedbackCorrect: "This side fits: both agency quadrants involve learner control and participation.",
    feedbackIncorrect: "Not quite—this situation fits better with the agency side.",
  },
  {
    heading: "Last-minute disruption",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "It is Sunday evening, but something goes wrong: you are interrupted and your plans are disrupted. Tomorrow’s class begins tense and unpredictable. You still need to consolidate the illnesses-and-injuries vocabulary in the second hour, but you have little preparation control. Which quadrant fits this situation?",
    correctSide: "right",
    consequences: {
      Q1: "You still structure a clear vocabulary auction, but the group’s external pressures reduce coherence; students engage yet consolidation is inconsistent.",
      Q2: "You allow expressive roleplay while outcomes stay uncertain; students enjoy it, but the target vocabulary becomes incidental.",
      Q3: "You run a conversation-dice structured exchange with tight goals; learners use the vocabulary systematically enough to consolidate.",
      Q4: "You run a chaos word chain; energy rises but vocabulary consolidation collapses into noise for many students.",
    },
    feedbackCorrect: "Correct side: fate outcomes align with structured constraints when self stays intact, and with disruption when self dissolves.",
    feedbackIncorrect: "Not quite—given the lack of control, fate fits better than agency.",
  },
]

export const AXIS_SELF_INTACT_DISSOLVED_SITUATIONS: AxisSituation[] = [
  {
    heading: "Stable routines",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "You have a planned class flow, the group is calm, and learners feel emotionally grounded. You want a game in the second hour that uses illnesses and injuries vocabulary effectively. Which quadrant fits this situation?",
    correctSide: "top",
    consequences: {
      Q1: "You run a vocabulary auction that feels safe and well-paced; students can take control without losing emotional stability.",
      Q2: "You run a doctor-patient roleplay, but anxiety and fragility make it harder for vocabulary to stick reliably.",
      Q3: "You run a conversation dice activity within a structured constraint so the vocabulary is used systematically.",
      Q4: "You run a chaos word chain; students react strongly but emotional uncertainty weakens consolidation.",
    },
    feedbackCorrect: "Correct: self-intact supports stable engagement and more reliable consolidation.",
    feedbackIncorrect: "Not quite—this situation matches self-intact more than self-dissolved.",
  },
  {
    heading: "Unsteady self",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "The classroom atmosphere is shaky: some learners feel exposed, distracted, or emotionally unsteady. You still need to consolidate illness and injury vocabulary through a game in the second hour. Which quadrant fits this situation?",
    correctSide: "bottom",
    consequences: {
      Q1: "Agency remains, but emotional unsteadiness interferes; students choose activities yet retention is uneven.",
      Q2: "Agency plus self-dissolved: roleplay is expressive and engaging, but the target vocabulary can feel incidental.",
      Q3: "Fate plus self-intact: structure helps, yet emotional fragility still limits how much learners retain.",
      Q4: "Fate plus self-dissolved: chaos drives reaction; vocabulary fades into noise for many students.",
    },
    feedbackCorrect: "Correct: self-dissolved predicts disruption in how learners experience and remember the vocabulary.",
    feedbackIncorrect: "Not quite—an unsteady classroom points to self-dissolved.",
  },
]

export const AXES_ASSESSMENT_SITUATIONS: AssessmentSituation[] = [
  {
    heading: "Relaxed prep",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "It is Sunday evening. You have an upper-intermediate class tomorrow morning on illnesses and injuries. You have time to prepare properly. The group is established, motivated, and gets along well. You want to run a game in the second hour to consolidate vocabulary from last week. Which quadrant fits this situation?",
    consequences: RELAXED_PREP,
  },
  {
    heading: "Last-minute disruption",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "Something disrupts your plans: you have limited control and the class starts tense. You still need consolidation of illness and injury vocabulary in the second hour. Which quadrant fits this situation?",
    consequences: {
      Q1: "Structured agency works briefly, but external pressure pulls coherence apart; consolidation is partial.",
      Q2: "Expressive roleplay follows learner energy, yet the vocabulary becomes background noise; retention is weaker.",
      Q3: "Rule-guided dice tasks keep vocabulary usable enough for systematic practice.",
      Q4: "Chaos reactions spike engagement, but learning goals dissolve in the noise.",
    },
  },
  {
    heading: "Stable routines",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "The group is calm and emotionally grounded. You can choose activities, but you mainly need predictability to consolidate targeted vocabulary. Which quadrant fits this situation?",
    consequences: {
      Q1: "Learner-controlled auction + stable self: students engage deeply and remember vocabulary.",
      Q2: "Learner control with fragile self: students enjoy the roleplay but retention drops.",
      Q3: "Structured fate with intact self: systematic dice use consolidates vocabulary effectively.",
      Q4: "Disruption with dissolving self: chaos energy remains, but vocabulary fades.",
    },
  },
  {
    heading: "Unsteady self",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "Learners feel exposed and emotionally unsteady. You still need to consolidate illness and injury vocabulary. Predictable results feel hard. Which quadrant fits this situation?",
    consequences: {
      Q1: "Agency with intact self is possible, but only briefly; consolidation is limited.",
      Q2: "Agency with self-dissolved: expressive roleplay engages, but target vocabulary sticks less.",
      Q3: "Fate with self-intact: structured guidance reduces stress and improves retention.",
      Q4: "Fate with self-dissolved: chaos reaction dominates and vocabulary consolidation fails for many.",
    },
  },
]

