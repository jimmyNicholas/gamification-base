"use client"

import * as React from "react"

import { AXIS_CENTER, type AxisIndex } from "@/components/discrete-axis-slider"
import { QuadrantAxesModelV2 } from "@/components/quadrant-axes-model-v2"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import type { AssessmentSituation } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import { QUADRANT_PLAY_CATEGORY_TILES } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import { ReflectionLayout } from "@/sections/reflection/reflection-layout"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"

const ASSESSMENT_INTRO_SURFACE = "#fce7f3"

export type AssessmentPageStep = "intro" | "situation1" | "situation2" | "situation3" | "situation4" | "wrapup"

const SITUATION_STEPS = ["situation1", "situation2", "situation3", "situation4"] as const
type SituationStep = typeof SITUATION_STEPS[number]

function isSituationStep(step: AssessmentPageStep): step is SituationStep {
  return (SITUATION_STEPS as readonly string[]).includes(step)
}

function situationSlot(step: AssessmentPageStep): number {
  return SITUATION_STEPS.indexOf(step as SituationStep)
}

function nextStep(step: AssessmentPageStep): AssessmentPageStep {
  switch (step) {
    case "intro": return "situation1"
    case "situation1": return "situation2"
    case "situation2": return "situation3"
    case "situation3": return "situation4"
    case "situation4": return "wrapup"
    default: return "wrapup"
  }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type AssessmentSituationWithIdeal = AssessmentSituation & {
  idealQuadrant: QuadrantId
  rationale: string
}

const ASSESSMENT_SITUATIONS: AssessmentSituationWithIdeal[] = [
  {
    heading: "Relaxed prep",
    level: "Upper-Intermediate",
    topic: "Illnesses and injuries",
    situation:
      "It is Sunday evening. You have an upper-intermediate class tomorrow morning on illnesses and injuries. You have time to prepare properly. The group is established, motivated, and gets along well. You want to run a game in the second hour to consolidate vocabulary from last week. Which quadrant fits this situation?",
    idealQuadrant: "Q1",
    rationale: "Competition works best here. The group is motivated and established, and systematic vocabulary consolidation needs structured challenge with clear outcomes—perfect for competition's agency + self-intact combination.",
    consequences: {
      Q1: "You run a vocabulary auction. Teams bid on sentences they think use the illness and injury vocabulary correctly. The class engages well. The vocabulary consolidates. Students leave energised.",
      Q2: "You run a doctor-patient roleplay using the target vocabulary. It runs well but the vocabulary feels incidental. Students enjoy inhabiting the characters but retention is lower than you hoped.",
      Q3: "You run a conversation dice activity. Students roll and must use the vocabulary in their answer. It runs but the target vocabulary comes up randomly rather than systematically. Consolidation is shallow.",
      Q4: "You run a word association chain using illness and injury terms. The activity gets a reaction but the target vocabulary disappears in the noise. A few students mention afterwards it didn't feel like much of a challenge.",
    },
  },
  {
    heading: "Colleague Question",
    level: "CAE",
    topic: "Climate and weather",
    situation:
      "A colleague finds you at the break. Their CAE class has just finished an intense reading test on climate and weather. They have an hour left and no ideas. The group is small and tight-knit and the students know each other well. What would you suggest? Which quadrant fits this situation?",
    idealQuadrant: "Q2",
    rationale: "Roleplay is ideal after an intense test with a tight-knit group. Students need agency to engage but self-dissolved activities (inhabiting characters) lift energy without adding pressure—exactly what's needed here.",
    consequences: {
      Q2: "Your colleague runs a short roleplay. Students take on the role of a climate journalist interviewing a sceptic. The group settle into it easily. Energy lifts after the test. Your colleague messages you later to say it was exactly what they needed.",
      Q1: "Your colleague runs a debate on environmental policy. It works but a few students who are still tired from the test don't fully engage. Fine, but not energising.",
      Q3: "Your colleague tries a spinner that chooses who speaks and what weather topic they discuss. It runs but feels disconnected from the reading they have been doing. Students participate without much investment.",
      Q4: "Your colleague tries a spontaneous chain story on an environmental theme. Students add one sentence each. The randomness creates some energy but the tired group can't sustain it. Your colleague has to prompt more than expected.",
    },
  },
  {
    heading: "Last minute cover",
    level: "Elementary",
    topic: "Food",
    situation:
      "It is 6:30am on a Friday. Your DOS calls. A teacher is sick and she asks if you can cover a class. It starts at 8:30am. The group is elementary level and the topic is food. You do not know the group. You need a warmer to get things started. Which quadrant fits this situation?",
    idealQuadrant: "Q3",
    rationale: "Chance activities are perfect for low-pressure warmers with unfamiliar groups. Random outcomes remove performance pressure while students stay themselves (self-intact)—the warmer runs itself without requiring trust or energy.",
    consequences: {
      Q3: "You run a picture card sort. Students randomly draw food cards and group them into categories. The warmer runs itself. The group warms up without any pressure. You find your footing before the main lesson begins.",
      Q4: "You try a quick mime game. Students mime a food randomly assigned to them. A few students look uncertain about performing for a teacher they have never met at 8:30am. The warmer runs but takes longer than expected.",
      Q1: "You run a quick food vocabulary quiz. Gaps in elementary knowledge appear before anyone knows each other. A few students go quiet. You spend the first ten minutes trying to recover the energy.",
      Q2: "You ask students to roleplay ordering food in a restaurant. Being asked to perform a character for a teacher they have never met at 8:30am on a Friday is too much. The room goes awkward and stays that way.",
    },
  },
  {
    heading: "Classroom in action",
    level: "Pre-intermediate",
    topic: "Modals of advice",
    situation:
      "You are mid-lesson with a pre-intermediate class working on modals of advice. The activity you planned is not working. The room is flat. Students are compliant but not engaged. You have 20 minutes left. You need to pivot right now. Which quadrant fits this moment?",
    idealQuadrant: "Q4",
    rationale: "Chaos activities work when you need to break a flat mood fast. Random, playful tasks with self-dissolved freedom let students stop monitoring themselves and just react—exactly what's needed to shift stuck energy in the moment.",
    consequences: {
      Q4: "You call a quick improv problem circle. Students are randomly assigned a ridiculous problem and the class shouts advice using modals. Something shifts in the room. Students stop monitoring themselves and just play. The energy carries through to the end of the lesson.",
      Q3: "You spin a wheel to choose who gives advice on a random scenario. Some movement but the room does not fully recover. Students participate but stay flat.",
      Q1: "You pivot to a structured advice-giving debate. The activity asks more of a flat room than it can give. Students become more withdrawn. One asks if they can leave early.",
      Q2: "You launch a roleplay where students take on characters with problems. It requires energy and trust the room does not have right now. The activity collapses. You finish the class early.",
    },
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffleIndices(count: number): number[] {
  const indices = Array.from({ length: count }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

function inferQuadrantFromAxes(h: AxisIndex, v: AxisIndex): QuadrantId | null {
  const hSide = h === AXIS_CENTER ? null : h <= 1 ? "left" : "right"
  const vSide = v === AXIS_CENTER ? null : v <= 1 ? "top" : "bottom"
  if (!hSide || !vSide) return null
  if (hSide === "left" && vSide === "top") return "Q1"
  if (hSide === "left" && vSide === "bottom") return "Q2"
  if (hSide === "right" && vSide === "top") return "Q3"
  return "Q4"
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type AssessmentPageProps = {
  onContinue?: () => void
  initialStep?: AssessmentPageStep
  onStepChange?: (step: AssessmentPageStep) => void
  /** Fires when the learner locks in a quadrant for a situation (for session analytics). */
  onAssessmentSituationSubmit?: (payload: {
    slotIndex: number
    chosen: QuadrantId
    ideal: QuadrantId
  }) => void
}

export function AssessmentPage({
  onContinue,
  initialStep = "intro",
  onStepChange,
  onAssessmentSituationSubmit,
}: AssessmentPageProps) {
  const situationOrderRef = React.useRef<number[]>(shuffleIndices(ASSESSMENT_SITUATIONS.length))
  const situationOrder = situationOrderRef.current

  const [step, setStep] = React.useState<AssessmentPageStep>(initialStep)
  const [horizontalIndex, setHorizontalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [verticalIndex, setVerticalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [submitted, setSubmitted] = React.useState(false)
  const [situationPanelOpen, setSituationPanelOpen] = React.useState(false)

  React.useEffect(() => { setStep(initialStep) }, [initialStep])
  React.useEffect(() => { onStepChange?.(step) }, [step, onStepChange])

  // Reset axes and submitted state on each new step
  React.useEffect(() => {
    setHorizontalIndex(AXIS_CENTER)
    setVerticalIndex(AXIS_CENTER)
    setSubmitted(false)
    setSituationPanelOpen(false)
  }, [step])

  const slot = situationSlot(step)
  const dataIndex = slot >= 0 ? situationOrder[slot] : -1
  const currentSituation: AssessmentSituationWithIdeal | null = dataIndex >= 0 ? ASSESSMENT_SITUATIONS[dataIndex] : null

  const liveQuadrant = inferQuadrantFromAxes(horizontalIndex, verticalIndex)
  const liveConsequence =
    liveQuadrant && currentSituation ? currentSituation.consequences[liveQuadrant] ?? null : null

  const canSubmit = !submitted && horizontalIndex !== AXIS_CENTER && verticalIndex !== AXIS_CENTER

  const advance = () => {
    const next = nextStep(step)
    if (next === "wrapup") {
      onContinue?.()
    } else {
      setStep(next)
    }
  }

  // --- Model ---
  const model = (() => {
    if (step === "intro") {
      return (
        <QuadrantAxesModelV2
          mode="axisDiagnostic"
          horizontalAxis={{ state: "color", clickable: false }}
          verticalAxis={{ state: "color", clickable: false }}
          className="h-full w-full"
        />
      )
    }
    if (isSituationStep(step)) {
      return (
        <QuadrantAxesModelV2
          mode="axesAssessment"
          horizontalAxis={{ state: "color", clickable: true, index: horizontalIndex }}
          verticalAxis={{ state: "color", clickable: true, index: verticalIndex }}
          onAxisIndexChange={(axis, index) => {
            if (axis === "horizontal") setHorizontalIndex(index)
            else setVerticalIndex(index)
          }}
          className="h-full w-full"
        />
      )
    }
    return null
  })()

  // --- Left column ---
  const leftColumn = (() => {
    if (step === "intro") {
      return (
        <>
          <h2 className="text-left text-xl font-bold leading-snug">Both axes together</h2>
          <p>
            Agency and fate describe how outcomes are decided. Self-intact and self-dissolved describe how much of the
            learner is on show. Every activity sits somewhere on both at once.
          </p>
          <p>
            In the next steps you will use the full grid: set both axes for each situation and see the consequence of
            the quadrant you land in.
          </p>
        </>
      )
    }
    if (isSituationStep(step) && currentSituation) {
      const situationCardBody = (
        <>
          <h3 className="text-lg font-bold text-black">{currentSituation.heading}</h3>
          <p className="mt-1 text-sm text-black/70">
            {currentSituation.level} · {currentSituation.topic}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-black/85">{currentSituation.situation}</p>
        </>
      )

      return (
        <>
          {!submitted ? (
            <h2 className="text-left text-xl font-bold leading-snug">
              Read the situation. Place your answer on the grid.
            </h2>
          ) : null}

          {!submitted ? (
            <div className="rounded-xl border border-black/10 bg-white/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Situation</p>
              <div className="mt-1">{situationCardBody}</div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-black/10 bg-white/40">
              <button
                type="button"
                onClick={() => setSituationPanelOpen((o) => !o)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-black/3"
                aria-expanded={situationPanelOpen}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Situation</p>
                  {!situationPanelOpen ? (
                    <p className="mt-1 line-clamp-2 text-base font-bold text-black">{currentSituation.heading}</p>
                  ) : null}
                </div>
                {situationPanelOpen ? (
                  <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-black/55" aria-hidden />
                ) : (
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-black/55" aria-hidden />
                )}
              </button>
              {situationPanelOpen ? (
                <div className="border-t border-black/10 px-4 pb-4 pt-1">{situationCardBody}</div>
              ) : null}
            </div>
          )}

          {/* Consequence — only visible after submit, but updates live as axes move */}
          {submitted ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-black/10 bg-white/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-black/55">Your Choice</p>
                {liveQuadrant && liveConsequence ? (
                  <>
                    <p className="mt-1 font-semibold text-black">
                      {QUADRANT_PLAY_CATEGORY_TILES[liveQuadrant].icon} {QUADRANT_PLAY_CATEGORY_TILES[liveQuadrant].label.charAt(0).toUpperCase() + QUADRANT_PLAY_CATEGORY_TILES[liveQuadrant].label.slice(1)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-black/85">{liveConsequence}</p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-black/70">
                    Move both axes away from centre to see a consequence.
                  </p>
                )}
              </div>

              {liveQuadrant && currentSituation && (
                <div className={cn(
                  "rounded-xl border p-4",
                  liveQuadrant === currentSituation.idealQuadrant
                    ? "border-green-500/40 bg-green-50/60"
                    : "border-amber-500/40 bg-amber-50/60"
                )}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/55">
                    {liveQuadrant === currentSituation.idealQuadrant ? "✓ Ideal match" : "Suggested alternative"}
                  </p>
                  {liveQuadrant !== currentSituation.idealQuadrant && (
                    <>
                      <p className="mt-1 font-semibold text-black">
                        {QUADRANT_PLAY_CATEGORY_TILES[currentSituation.idealQuadrant].icon} {QUADRANT_PLAY_CATEGORY_TILES[currentSituation.idealQuadrant].label.charAt(0).toUpperCase() + QUADRANT_PLAY_CATEGORY_TILES[currentSituation.idealQuadrant].label.slice(1)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-black/85">
                        {currentSituation.consequences[currentSituation.idealQuadrant]}
                      </p>
                    </>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-black/75 italic">
                    {currentSituation.rationale}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-black/55">
              Move both axes away from centre, then submit your answer.
            </p>
          )}
        </>
      )
    }
    return null
  })()

  // --- CTA ---
  const primaryCta = (() => {
    if (step === "intro") {
      return (
        <button
          type="button"
          className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
          onClick={advance}
        >
          Continue
        </button>
      )
    }
    if (isSituationStep(step)) {
      if (!submitted) {
        return (
          <button
            type="button"
            disabled={!canSubmit}
            className={cn(
              demoPrimaryCtaConstrainedClassName,
              demoPrimaryCtaNativeFocusClassName,
              "w-full max-w-lg",
              !canSubmit && "opacity-60"
            )}
            onClick={() => {
              if (liveQuadrant && currentSituation) {
                onAssessmentSituationSubmit?.({
                  slotIndex: slot,
                  chosen: liveQuadrant,
                  ideal: currentSituation.idealQuadrant,
                })
              }
              setSubmitted(true)
            }}
          >
            This is my read of the situation.
          </button>
        )
      }
      return (
        <button
          type="button"
          className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
          onClick={advance}
        >
          {step === "situation4" ? "Finish" : "Next situation"}
        </button>
      )
    }
    return null
  })()

  const progressLabel = isSituationStep(step)
    ? `Situation ${slot + 1} of ${SITUATION_STEPS.length}`
    : null

  return (
    <ReflectionLayout dataActivity="assessment-page" surfaceColor={ASSESSMENT_INTRO_SURFACE}>
      <TwoColumnActivityStageLayout
        reserveTopTitleSpace={true}
        leftVerticalAlign="start"
        leftContent={
          <div className="flex min-h-[min(52vh,420px)] w-full min-w-0 flex-col gap-4 self-stretch sm:gap-5 lg:min-h-0 lg:h-full px-10">
            <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
              {leftColumn}
              {progressLabel && (
                <p className="text-xs text-black/55">{progressLabel}</p>
              )}
            </div>
            
          </div>
        }
        rightContent={
          <>
          <div className="flex w-full min-w-0 justify-center sm:scale-90 md:scale-100">{model}</div>
          {primaryCta && (
            <div className="mt-auto flex w-full flex-col items-center pt-2 sm:pt-4">
              {primaryCta}
            </div>
            
          )}
          </>
        }
      />
    </ReflectionLayout>
  )
}