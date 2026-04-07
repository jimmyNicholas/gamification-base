"use client"

import * as React from "react"

import { AXIS_CENTER, type AxisIndex } from "@/components/discrete-axis-slider"
import { ReflectionLayout } from "@/sections/reflection/reflection-layout"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { cn } from "@/lib/utils"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"
import { QuadrantAxesModelV2 } from "@/components/quadrant-axes-model-v2"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { KeyboardHints } from "@/components/keyboard-hints"
import { KeyboardKey } from "@/components/keyboard-key"

export type AxisPageStep =
  | "quizIntro"
  | "agencyIntro"
  | "agencyQ1"
  | "agencyQ2"
  | "selfIntro"
  | "selfQ1"
  | "selfQ2"

type FlowStep = AxisPageStep

export type AxisQuizStep = "agencyQ1" | "agencyQ2" | "selfQ1" | "selfQ2"

export type AxisPageProps = {
  onContinue?: () => void
  /** When set, the flow starts at this step (e.g. resume mid-section). */
  initialStep?: AxisPageStep
  /** Fires when the current step changes (for syncing course nav). */
  onStepChange?: (step: AxisPageStep) => void
  /** Fires when the learner submits an answer on an axis quiz step (for session analytics). */
  onAxisQuizSubmit?: (payload: { step: AxisQuizStep; choiceLabel: string }) => void
}

type QuizFeedback = { correct: boolean }

const AGENCY_Q1 = {
  title: "Cambridge speaking game",
  body: "You have a strong intermediate class preparing for a Cambridge exam. They are motivated and competitive. You want to run a speaking game. How much should skill and effort determine the outcome?",
  correct: "left" as const,
  feedbackYes:
    "Yes. High agency fits here. The students are confident, prepared, and the competitive stakes match their goal.",
  feedbackNo:
    "Consider the room. These students are motivated and exam-focused. Would fate serve them better than effort here? Have another look.",
}

const AGENCY_Q2 = {
  title: "New term icebreaker",
  body: "It is the first week of a new term. Students do not know each other yet. You want to run an icebreaker but you do not want stronger students to stand out. How much should performance determine the outcome?",
  correct: "right" as const,
  feedbackYes:
    "Yes. Fate works here. Nobody is disadvantaged, nobody dominates, and the focus stays on connection rather than performance.",
  feedbackNo:
    "Think about what this group needs right now. Would rewarding skill help or hurt the room at this stage? Have another look.",
  axisActivated: "You have activated your first axis. You will use it in the next section.",
}

const SELF_Q1 = {
  title: "Anxious new student",
  body: "A student has recently arrived from overseas and is visibly anxious in class. They participate when called on but never volunteer. You want them to contribute in today's discussion activity. How much should they be asked to step outside themselves?",
  correct: "top" as const,
  feedbackYes:
    "Yes. Self-intact is right here. This student needs to feel safe as themselves before they can step outside that safety.",
  feedbackNo:
    "Consider what this student needs right now. Would asking them to become someone else help or add pressure at this stage? Have another look.",
}

const SELF_Q2 = {
  title: "Conflict resolution",
  body: "You are working on a unit about conflict resolution. Students need to practise difficult conversations. Complaints, disagreements, confrontation. Most of them find this uncomfortable as themselves. How much would stepping into a character help them engage?",
  correct: "bottom" as const,
  feedbackYes:
    "Yes. Self-dissolution works here. The character gives students permission to have the difficult conversation without personal risk.",
  feedbackNo:
    "Think about what the character does for the student. Does it protect them or expose them in this context? Have another look.",
}

function horizontalSide(index: AxisIndex): "left" | "right" | null {
  if (index === AXIS_CENTER) return null
  return index <= 1 ? "left" : "right"
}

function verticalSide(index: AxisIndex): "top" | "bottom" | null {
  if (index === AXIS_CENTER) return null
  return index <= 1 ? "top" : "bottom"
}

export function AxisPage({
  onContinue,
  initialStep = "quizIntro",
  onStepChange,
  onAxisQuizSubmit,
}: AxisPageProps) {
  const [step, setStep] = React.useState<FlowStep>(initialStep)
  const [horizontalIndex, setHorizontalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [verticalIndex, setVerticalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [quizFeedback, setQuizFeedback] = React.useState<QuizFeedback | null>(null)
  const [isAgencyExplanationOpen, setIsAgencyExplanationOpen] = React.useState(false)
  const [isSelfExplanationOpen, setIsSelfExplanationOpen] = React.useState(false)

  React.useEffect(() => {
    setStep(initialStep)
  }, [initialStep])

  React.useEffect(() => {
    onStepChange?.(step)
  }, [step, onStepChange])

  React.useEffect(() => {
    setHorizontalIndex(AXIS_CENTER)
    setVerticalIndex(AXIS_CENTER)
    setQuizFeedback(null)

    // Open explanation on intro screens, close on quiz screens
    if (step === "agencyIntro") {
      setIsAgencyExplanationOpen(true)
    } else if (step === "agencyQ1" || step === "agencyQ2") {
      setIsAgencyExplanationOpen(false)
    }

    if (step === "selfIntro") {
      setIsSelfExplanationOpen(true)
    } else if (step === "selfQ1" || step === "selfQ2") {
      setIsSelfExplanationOpen(false)
    }
  }, [step])

  const isAgencyQuiz = step === "agencyQ1" || step === "agencyQ2"
  const isSelfQuiz = step === "selfQ1" || step === "selfQ2"
  const axesLocked = quizFeedback !== null

  const onHChange = React.useCallback(
    (idx: AxisIndex) => {
      if (axesLocked) return
      setHorizontalIndex(idx)
    },
    [axesLocked]
  )

  const onVChange = React.useCallback(
    (idx: AxisIndex) => {
      if (axesLocked) return
      setVerticalIndex(idx)
    },
    [axesLocked]
  )

  React.useEffect(() => {
    setQuizFeedback((f) => (f && !f.correct ? null : f))
  }, [horizontalIndex, verticalIndex])

  const submitAgency = React.useCallback((correctSide: "left" | "right") => {
    const side = horizontalSide(horizontalIndex)
    if (!side) return
    const choiceLabel = side === "left" ? "Agency" : "Fate"
    if (step === "agencyQ1" || step === "agencyQ2") {
      onAxisQuizSubmit?.({ step, choiceLabel })
    }
    setQuizFeedback({ correct: side === correctSide })
  }, [horizontalIndex, step, onAxisQuizSubmit])

  const submitSelf = React.useCallback((correctSide: "top" | "bottom") => {
    const side = verticalSide(verticalIndex)
    if (!side) return
    const choiceLabel = side === "top" ? "Self-intact" : "Self-dissolved"
    if (step === "selfQ1" || step === "selfQ2") {
      onAxisQuizSubmit?.({ step, choiceLabel })
    }
    setQuizFeedback({ correct: side === correctSide })
  }, [verticalIndex, step, onAxisQuizSubmit])

  const canSubmitAgency = !axesLocked && horizontalSide(horizontalIndex) !== null
  const canSubmitSelf = !axesLocked && verticalSide(verticalIndex) !== null

  // Helper to advance to next step
  const advanceStep = React.useCallback((next: FlowStep) => {
    setStep(next)
  }, [])

  // Keyboard navigation support
  const handleSubmit = React.useCallback(() => {
    // Handle quiz submission
    if (isAgencyQuiz && !quizFeedback && canSubmitAgency) {
      const correctSide = step === "agencyQ1" ? AGENCY_Q1.correct : AGENCY_Q2.correct
      submitAgency(correctSide)
      return
    }
    if (isSelfQuiz && !quizFeedback && canSubmitSelf) {
      const correctSide = step === "selfQ1" ? SELF_Q1.correct : SELF_Q2.correct
      submitSelf(correctSide)
      return
    }

    // Handle "Try again" after incorrect answer
    if (quizFeedback && !quizFeedback.correct) {
      setQuizFeedback(null)
      return
    }

    // Handle continue/advance actions
    switch (step) {
      case "quizIntro":
        advanceStep("agencyIntro")
        break
      case "agencyIntro":
        advanceStep("agencyQ1")
        break
      case "agencyQ1":
        if (quizFeedback?.correct) advanceStep("agencyQ2")
        break
      case "agencyQ2":
        if (quizFeedback?.correct) advanceStep("selfIntro")
        break
      case "selfIntro":
        advanceStep("selfQ1")
        break
      case "selfQ1":
        if (quizFeedback?.correct) advanceStep("selfQ2")
        break
      case "selfQ2":
        if (quizFeedback?.correct && onContinue) onContinue()
        break
    }
  }, [step, isAgencyQuiz, isSelfQuiz, canSubmitAgency, canSubmitSelf, quizFeedback, submitAgency, submitSelf, advanceStep, onContinue])

  useKeyboardNavigation({
    onHorizontalChange: isAgencyQuiz ? onHChange : undefined,
    onVerticalChange: isSelfQuiz ? onVChange : undefined,
    onSubmit: handleSubmit,
    horizontalIndex,
    verticalIndex,
    disabled: false,
  })

  const model = (() => {
    switch (step) {
      case "quizIntro":
        return (
          <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{ state: "black", clickable: false }}
            verticalAxis={{ state: "black", clickable: false }}
            className="h-full w-full"
          />
        )
      case "agencyIntro":
        return (
          <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{ state: "color", clickable: false }}
            verticalAxis={{ state: "grey", clickable: false }}
            className="h-full w-full"
          />
        )
      case "agencyQ1":
      case "agencyQ2":
        return (
          <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "color",
              clickable: !axesLocked,
              index: horizontalIndex,
            }}
            verticalAxis={{ state: "grey", clickable: false }}
            onAxisIndexChange={(axis, index) => {
              if (axis !== "horizontal") return
              onHChange(index as AxisIndex)
            }}
            className="h-full w-full"
          />
        )
      case "selfIntro":
        return (
          <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{ state: "grey", clickable: false }}
            verticalAxis={{ state: "color", clickable: false }}
            className="h-full w-full"
          />
        )
      case "selfQ1":
      case "selfQ2":
        return (
          <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{ state: "grey", clickable: false }}
            verticalAxis={{
              state: "color",
              clickable: !axesLocked,
              index: verticalIndex,
            }}
            onAxisIndexChange={(axis, index) => {
              if (axis !== "vertical") return
              onVChange(index as AxisIndex)
            }}
            className="h-full w-full"
          />
        )
      default:
        return null
    }
  })()

  const leftColumn = (() => {
    switch (step) {
      case "quizIntro":
        return (
          <>
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">
              You might have noticed that these four categories share some similarities and differences.
            </h2>
            <p>Each axis runs between two extremes. Agency and fate on one. Self-intact and self-dissolved on the other.</p>
            <p>
              In this section we&apos;ll look at each axis more closely. The strengths, the weaknesses, and how to use it
              as a quick diagnostic tool through common situations.
            </p>
          </>
        )
      case "agencyIntro":
        return (
          <>
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">Agency and Fate</h2>
            <p>How much does the outcome depend on the student&apos;s skill and preparation versus randomness and chance?</p>
            <button
              type="button"
              onClick={() => setIsAgencyExplanationOpen(!isAgencyExplanationOpen)}
              className="text-left text-sm font-medium text-black/70 hover:text-black/90 underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
            >
              {isAgencyExplanationOpen ? "Hide explanation" : "Show explanation"}
            </button>
            {isAgencyExplanationOpen ? (
              <>
                <p>
                  Agency rewards effort and builds pride, but exposes weaker students and can cause withdrawal in low-confidence
                  rooms.
                </p>
                <p>
                  Fate levels the field and reduces anxiety, but feels meaningless if students can&apos;t see a communicative
                  purpose behind the randomness.
                </p>
                <p>
                  High agency increases performance anxiety and makes proficiency gaps visible. High fate reduces anxiety and
                  equalises the room regardless of level.
                </p>
              </>
            ) : null}
          </>
        )
      case "agencyQ1":
        return (
          <>
            <button
              type="button"
              onClick={() => setIsAgencyExplanationOpen(!isAgencyExplanationOpen)}
              className="text-left text-sm font-medium text-black/70 hover:text-black/90 underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1 mb-2"
            >
              {isAgencyExplanationOpen ? "Hide" : "Show"} Agency and Fate explanation
            </button>
            {isAgencyExplanationOpen ? (
              <div className="mb-4 space-y-3 rounded-xl border border-black/10 bg-black/5 p-4">
                <p className="text-sm font-semibold">Agency and Fate</p>
                <p className="text-sm">How much does the outcome depend on the student&apos;s skill and preparation versus randomness and chance?</p>
                <p className="text-sm">
                  Agency rewards effort and builds pride, but exposes weaker students and can cause withdrawal in low-confidence
                  rooms.
                </p>
                <p className="text-sm">
                  Fate levels the field and reduces anxiety, but feels meaningless if students can&apos;t see a communicative
                  purpose behind the randomness.
                </p>
                <p className="text-sm">
                  High agency increases performance anxiety and makes proficiency gaps visible. High fate reduces anxiety and
                  equalises the room regardless of level.
                </p>
              </div>
            ) : null}
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">Read each situation. Place your answer on the grid below.</h2>
            <p className="font-medium text-black/90">{AGENCY_Q1.title}</p>
            <p>{AGENCY_Q1.body}</p>
            {quizFeedback ? (
              <div className="rounded-xl border border-black/10 bg-white/50 p-4">
                <p className="text-sm leading-relaxed text-black/85">
                  {quizFeedback.correct ? AGENCY_Q1.feedbackYes : AGENCY_Q1.feedbackNo}
                </p>
              </div>
            ) : null}
          </>
        )
      case "agencyQ2":
        return (
          <>
            <button
              type="button"
              onClick={() => setIsAgencyExplanationOpen(!isAgencyExplanationOpen)}
              className="text-left text-sm font-medium text-black/70 hover:text-black/90 underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1 mb-2"
            >
              {isAgencyExplanationOpen ? "Hide" : "Show"} Agency and Fate explanation
            </button>
            {isAgencyExplanationOpen ? (
              <div className="mb-4 space-y-3 rounded-xl border border-black/10 bg-black/5 p-4">
                <p className="text-sm font-semibold">Agency and Fate</p>
                <p className="text-sm">How much does the outcome depend on the student&apos;s skill and preparation versus randomness and chance?</p>
                <p className="text-sm">
                  Agency rewards effort and builds pride, but exposes weaker students and can cause withdrawal in low-confidence
                  rooms.
                </p>
                <p className="text-sm">
                  Fate levels the field and reduces anxiety, but feels meaningless if students can&apos;t see a communicative
                  purpose behind the randomness.
                </p>
                <p className="text-sm">
                  High agency increases performance anxiety and makes proficiency gaps visible. High fate reduces anxiety and
                  equalises the room regardless of level.
                </p>
              </div>
            ) : null}
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">Read each situation. Place your answer on the grid below.</h2>
            <p className="font-medium text-black/90">{AGENCY_Q2.title}</p>
            <p>{AGENCY_Q2.body}</p>
            {quizFeedback ? (
              <div className="space-y-3 rounded-xl border border-black/10 bg-white/50 p-4">
                <p className="text-sm leading-relaxed text-black/85">
                  {quizFeedback.correct ? AGENCY_Q2.feedbackYes : AGENCY_Q2.feedbackNo}
                </p>
                {quizFeedback.correct ? (
                  <p className="text-sm font-medium leading-relaxed text-black/90">{AGENCY_Q2.axisActivated}</p>
                ) : null}
              </div>
            ) : null}
          </>
        )
      case "selfIntro":
        return (
          <>
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">Self-intact and Self-dissolved</h2>
            <p>
              How much of the student&apos;s real identity is present in the activity versus temporarily suspended through
              character, role, or cognitive overwhelm?
            </p>
            <button
              type="button"
              onClick={() => setIsSelfExplanationOpen(!isSelfExplanationOpen)}
              className="text-left text-sm font-medium text-black/70 hover:text-black/90 underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1"
            >
              {isSelfExplanationOpen ? "Hide explanation" : "Show explanation"}
            </button>
            {isSelfExplanationOpen ? (
              <>
                <p>
                  Self-intact produces authentic, meaningful language and real communicative investment, but requires
                  psychological safety that may not yet exist.
                </p>
                <p>
                  Self-dissolution lowers the cost of errors and unlocks fluency in over-monitors, but feels threatening rather
                  than liberating if introduced before trust is established.
                </p>
                <p>
                  Self-dissolved activities create an illusion of distance from performance. For roleplay this is conscious. For
                  chaos it is involuntary. Both suspend self-monitoring through different mechanisms.
                </p>
              </>
            ) : null}
          </>
        )
      case "selfQ1":
        return (
          <>
            <button
              type="button"
              onClick={() => setIsSelfExplanationOpen(!isSelfExplanationOpen)}
              className="text-left text-sm font-medium text-black/70 hover:text-black/90 underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1 mb-2"
            >
              {isSelfExplanationOpen ? "Hide" : "Show"} Self-intact and Self-dissolved explanation
            </button>
            {isSelfExplanationOpen ? (
              <div className="mb-4 space-y-3 rounded-xl border border-black/10 bg-black/5 p-4">
                <p className="text-sm font-semibold">Self-intact and Self-dissolved</p>
                <p className="text-sm">
                  How much of the student&apos;s real identity is present in the activity versus temporarily suspended through
                  character, role, or cognitive overwhelm?
                </p>
                <p className="text-sm">
                  Self-intact produces authentic, meaningful language and real communicative investment, but requires
                  psychological safety that may not yet exist.
                </p>
                <p className="text-sm">
                  Self-dissolution lowers the cost of errors and unlocks fluency in over-monitors, but feels threatening rather
                  than liberating if introduced before trust is established.
                </p>
                <p className="text-sm">
                  Self-dissolved activities create an illusion of distance from performance. For roleplay this is conscious. For
                  chaos it is involuntary. Both suspend self-monitoring through different mechanisms.
                </p>
              </div>
            ) : null}
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">Read each situation. Place your answer on the grid below.</h2>
            <p className="font-medium text-black/90">{SELF_Q1.title}</p>
            <p>{SELF_Q1.body}</p>
            {quizFeedback ? (
              <div className="rounded-xl border border-black/10 bg-white/50 p-4">
                <p className="text-sm leading-relaxed text-black/85">
                  {quizFeedback.correct ? SELF_Q1.feedbackYes : SELF_Q1.feedbackNo}
                </p>
                {quizFeedback.correct ? (
                  <p className="mt-3 text-sm font-medium text-black/90">
                    You have activated this axis on the grid. You will use it again in the next situation.
                  </p>
                ) : null}
              </div>
            ) : null}
          </>
        )
      case "selfQ2":
        return (
          <>
            <button
              type="button"
              onClick={() => setIsSelfExplanationOpen(!isSelfExplanationOpen)}
              className="text-left text-sm font-medium text-black/70 hover:text-black/90 underline focus:outline-none focus:ring-2 focus:ring-black/20 rounded px-1 -mx-1 mb-2"
            >
              {isSelfExplanationOpen ? "Hide" : "Show"} Self-intact and Self-dissolved explanation
            </button>
            {isSelfExplanationOpen ? (
              <div className="mb-4 space-y-3 rounded-xl border border-black/10 bg-black/5 p-4">
                <p className="text-sm font-semibold">Self-intact and Self-dissolved</p>
                <p className="text-sm">
                  How much of the student&apos;s real identity is present in the activity versus temporarily suspended through
                  character, role, or cognitive overwhelm?
                </p>
                <p className="text-sm">
                  Self-intact produces authentic, meaningful language and real communicative investment, but requires
                  psychological safety that may not yet exist.
                </p>
                <p className="text-sm">
                  Self-dissolution lowers the cost of errors and unlocks fluency in over-monitors, but feels threatening rather
                  than liberating if introduced before trust is established.
                </p>
                <p className="text-sm">
                  Self-dissolved activities create an illusion of distance from performance. For roleplay this is conscious. For
                  chaos it is involuntary. Both suspend self-monitoring through different mechanisms.
                </p>
              </div>
            ) : null}
            <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">Read each situation. Place your answer on the grid below.</h2>
            <p className="font-medium text-black/90">{SELF_Q2.title}</p>
            <p>{SELF_Q2.body}</p>
            {quizFeedback ? (
              <div className="rounded-xl border border-black/10 bg-white/50 p-4">
                <p className="text-sm leading-relaxed text-black/85">
                  {quizFeedback.correct ? SELF_Q2.feedbackYes : SELF_Q2.feedbackNo}
                </p>
                {quizFeedback.correct ? (
                  <p className="mt-3 text-sm font-medium text-black/90">
                    You have activated your second axis. Next, you will see how both axes work together.
                  </p>
                ) : null}
              </div>
            ) : null}
          </>
        )
      default:
        return null
    }
  })()

  const primaryCta = (() => {
    const advance = (next: FlowStep) => {
      setStep(next)
    }

    switch (step) {
      case "quizIntro":
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => advance("agencyIntro")}
          >
            Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      case "agencyIntro":
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => advance("agencyQ1")}
          >
            Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      case "agencyQ1":
        if (!quizFeedback) {
          return (
            <button
              type="button"
              className={cn(
                demoPrimaryCtaConstrainedClassName,
                demoPrimaryCtaNativeFocusClassName,
                "w-full max-w-lg",
                canSubmitAgency ? "" : "opacity-60"
              )}
              disabled={!canSubmitAgency}
              onClick={() => submitAgency(AGENCY_Q1.correct)}
            >
              Submit <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        if (quizFeedback.correct) {
          return (
            <button
              type="button"
              className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
              onClick={() => advance("agencyQ2")}
            >
              Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => setQuizFeedback(null)}
          >
            Try again <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      case "agencyQ2":
        if (!quizFeedback) {
          return (
            <button
              type="button"
              className={cn(
                demoPrimaryCtaConstrainedClassName,
                demoPrimaryCtaNativeFocusClassName,
                "w-full max-w-lg",
                canSubmitAgency ? "" : "opacity-60"
              )}
              disabled={!canSubmitAgency}
              onClick={() => submitAgency(AGENCY_Q2.correct)}
            >
              Submit <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        if (quizFeedback.correct) {
          return (
            <button
              type="button"
              className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
              onClick={() => advance("selfIntro")}
            >
              Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => setQuizFeedback(null)}
          >
            Try again <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      case "selfIntro":
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => advance("selfQ1")}
          >
            Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      case "selfQ1":
        if (!quizFeedback) {
          return (
            <button
              type="button"
              className={cn(
                demoPrimaryCtaConstrainedClassName,
                demoPrimaryCtaNativeFocusClassName,
                "w-full max-w-lg",
                canSubmitSelf ? "" : "opacity-60"
              )}
              disabled={!canSubmitSelf}
              onClick={() => submitSelf(SELF_Q1.correct)}
            >
              Submit <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        if (quizFeedback.correct) {
          return (
            <button
              type="button"
              className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
              onClick={() => advance("selfQ2")}
            >
              Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => setQuizFeedback(null)}
          >
            Try again <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      case "selfQ2":
        if (!quizFeedback) {
          return (
            <button
              type="button"
              className={cn(
                demoPrimaryCtaConstrainedClassName,
                demoPrimaryCtaNativeFocusClassName,
                "w-full max-w-lg",
                canSubmitSelf ? "" : "opacity-60"
              )}
              disabled={!canSubmitSelf}
              onClick={() => submitSelf(SELF_Q2.correct)}
            >
              Submit <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          )
        }
        if (quizFeedback.correct) {
          return onContinue ? (
            <button
              type="button"
              className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
              onClick={() => onContinue()}
            >
              Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
            </button>
          ) : null
        }
        return (
          <button
            type="button"
            className={cn(demoPrimaryCtaConstrainedClassName, demoPrimaryCtaNativeFocusClassName, "w-full max-w-lg")}
            onClick={() => setQuizFeedback(null)}
          >
            Try again <KeyboardKey keyLabel="ENTER" className="ml-2" />
          </button>
        )
      default:
        return null
    }
  })()

  const progressLabel = (() => {
    if (step === "agencyQ1") return "Situation 1 of 2"
    if (step === "agencyQ2") return "Situation 2 of 2"
    if (step === "selfQ1") return "Situation 1 of 2"
    if (step === "selfQ2") return "Situation 2 of 2"
    return null
  })()

  return (
    <ReflectionLayout dataActivity="axis-page">
      <TwoColumnActivityStageLayout
        reserveTopTitleSpace={true}
        leftVerticalAlign="start"
        leftContent={
          <div className="flex min-h-[min(52vh,420px)] w-full min-w-0 flex-col gap-4 self-stretch sm:gap-5 lg:min-h-0 lg:h-full px-10">
            <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
              {leftColumn}
              {progressLabel ? <p className="text-xs text-black/55">{progressLabel}</p> : null}
            </div>
          </div>
        }
        rightContent={
        <>
          <div className="flex w-full min-w-0 justify-center sm:scale-90 md:scale-100">{model}</div>
          {primaryCta ? (
              <div className="mt-auto flex w-full flex-col items-center gap-3 pt-2 sm:pt-4">
                <div className="mb-1 min-h-6 flex items-center">
                  <KeyboardHints
                    axisMode={
                      isAgencyQuiz ? "horizontal" :
                      isSelfQuiz ? "vertical" :
                      "none"
                    }
                  />
                </div>
                {primaryCta}
              </div>
            ) : null}
        </>
         }
      />
    </ReflectionLayout>
  )
}
