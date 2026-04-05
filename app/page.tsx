"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"

import { CourseNavPanel, type CoursePhase } from "@/components/course-nav-panel"
import {
  clearDemoMatchOutcomesSession,
  DEMO_OUTCOMES_CLEAR_EVENT,
  loadDemoMatchOutcomesFromSession,
  saveDemoMatchOutcomesToSession,
} from "@/lib/demo-match-outcomes-session"
import {
  initializeSession,
  trackPhaseChange,
} from "@/lib/xapi-tracking"
import {
  initializeXAPISession,
  trackPhaseEntry,
} from "@/lib/xapi-session"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import {
  ChancePage,
  ChaosPage,
  CompetitionActivityPage,
  DemoOutlinePage,
  initialDemoMatchOutcomes,
  IntroPage,
  RecognitionPage,
  RecognitionCategoriesPage,
  RecognitionReflectionPage,
  PostRecognitionPage,
  MimicryPage,
  AxisPage,
  AssessmentPage,
  ReflectionPage,
  type AxisQuizStep,
  type DemoMatchOutcomes,
} from "@/sections"
import { AdminPage } from "@/sections/admin/admin-page"

export default function Home() {
  const [phase, setPhase] = useState<CoursePhase>("intro")
  const [matchOutcomes, setMatchOutcomes] = useState<DemoMatchOutcomes>(() => initialDemoMatchOutcomes())
  const [matchOutcomesSessionReady, setMatchOutcomesSessionReady] = useState(false)
  const [prevPhase, setPrevPhase] = useState<CoursePhase | null>(null)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)

  // Initialize xAPI tracking on mount
  useEffect(() => {
    const sessionId = initializeSession()
    initializeXAPISession(sessionId)
    trackPhaseEntry("intro")
  }, [])

  // Track phase changes
  useEffect(() => {
    if (prevPhase === null) {
      setPrevPhase(phase)
      return
    }

    if (prevPhase !== phase) {
      trackPhaseChange(prevPhase, phase)
      trackPhaseEntry(phase)
      setPrevPhase(phase)
    }
  }, [phase, prevPhase])

  useEffect(() => {
    const loaded = loadDemoMatchOutcomesFromSession()
    if (loaded) setMatchOutcomes(loaded)
    setMatchOutcomesSessionReady(true)
  }, [])

  useEffect(() => {
    const onOutcomesCleared = () => {
      setMatchOutcomes(initialDemoMatchOutcomes())
    }
    window.addEventListener(DEMO_OUTCOMES_CLEAR_EVENT, onOutcomesCleared)
    return () => window.removeEventListener(DEMO_OUTCOMES_CLEAR_EVENT, onOutcomesCleared)
  }, [])

  useEffect(() => {
    if (!matchOutcomesSessionReady) return
    saveDemoMatchOutcomesToSession(matchOutcomes)
  }, [matchOutcomes, matchOutcomesSessionReady])

  const goToChance = useCallback((payload?: { timeMs: number; animalEmoji?: string }) => {
    setMatchOutcomes((o) => ({
      ...o,
      competitionTimeMs: payload?.timeMs ?? o.competitionTimeMs,
      competitionAnimalEmoji: payload?.animalEmoji ?? o.competitionAnimalEmoji,
    }))
    setPhase("chance")
  }, [])

  const goToMimicry = useCallback((payload?: { answer: string; questionNumber: number }) => {
    setMatchOutcomes((o) => ({
      ...o,
      chanceQuestionNumber: payload?.questionNumber ?? o.chanceQuestionNumber,
      chanceAnswer: payload?.answer ?? o.chanceAnswer,
    }))
    setPhase("mimicry")
  }, [])

  const goToChaos = useCallback(
    (payload?: { hatLabel: string | null; hatImageSrc: string | null; tomResponse: string | null }) => {
      setMatchOutcomes((o) => ({
        ...o,
        roleplayHatLabel: payload?.hatLabel ?? o.roleplayHatLabel,
        roleplayHatImageSrc: payload?.hatImageSrc ?? o.roleplayHatImageSrc,
        roleplayTomResponse: payload?.tomResponse ?? o.roleplayTomResponse,
      }))
      setPhase("chaos")
    },
    []
  )

  const goToRecognitionFromChaos = useCallback((payload?: { chaosQ1Answer: string | null; chaosQ2Skills: readonly string[] }) => {
    setMatchOutcomes((o) => ({
      ...o,
      chaosQ1Answer: payload?.chaosQ1Answer ?? o.chaosQ1Answer,
      chaosQ2Skills: payload?.chaosQ2Skills ?? o.chaosQ2Skills,
    }))
    setPhase("recognition")
  }, [])

  const goToRecognitionCategories = useCallback(() => {
    setPhase("recognitionCategories")
  }, [])

  const goToRecognitionMiniReflection = useCallback(() => {
    setPhase("recognitionMiniReflection")
  }, [])

  const goToPostRecognition = useCallback(() => {
    setPhase("postRecognition")
  }, [])

  const goToBook = useCallback(() => {
    setPhase("book")
  }, [])

  const startCourseFromIntro = useCallback(() => {
    clearDemoMatchOutcomesSession()
    setMatchOutcomes(initialDemoMatchOutcomes())
    setPhase("demoOutline")
  }, [])

  const goToAssessment = useCallback(() => {
    setPhase("axisTogether")
  }, [])

  const goToReflection = useCallback(() => {
    setPhase("reflection")
  }, [])

  const finishReflection = useCallback(() => {
    setPhase("intro")
  }, [])

  const handleCompetitionReplay = useCallback(() => {
    setMatchOutcomes((o) => ({
      ...o,
      competitionReplayCount: o.competitionReplayCount + 1,
    }))
  }, [])

  const handleRecognitionMistake = useCallback(() => {
    setMatchOutcomes((o) => ({
      ...o,
      recognitionMatchMistakes: o.recognitionMatchMistakes + 1,
    }))
  }, [])

  const handleRecognitionReflectionUsed = useCallback(() => {
    setMatchOutcomes((o) => ({
      ...o,
      recognitionReflectionUsed: true,
    }))
  }, [])

  const handleAxisQuizSubmit = useCallback(
    (payload: { step: AxisQuizStep; choiceLabel: string }) => {
      setMatchOutcomes((o) => {
        switch (payload.step) {
          case "agencyQ1":
            return { ...o, axisAgencyQ1Choice: payload.choiceLabel }
          case "agencyQ2":
            return { ...o, axisAgencyQ2Choice: payload.choiceLabel }
          case "selfQ1":
            return { ...o, axisSelfQ1Choice: payload.choiceLabel }
          case "selfQ2":
            return { ...o, axisSelfQ2Choice: payload.choiceLabel }
          default:
            return o
        }
      })
    },
    []
  )

  const handleAssessmentSituationSubmit = useCallback(
    (payload: { slotIndex: number; chosen: QuadrantId; ideal: QuadrantId }) => {
      const i = payload.slotIndex
      if (i < 0 || i > 3) return
      setMatchOutcomes((o) => {
        const row = { chosen: payload.chosen, ideal: payload.ideal }
        return {
          ...o,
          assessmentSituationResults: [
            i === 0 ? row : o.assessmentSituationResults[0],
            i === 1 ? row : o.assessmentSituationResults[1],
            i === 2 ? row : o.assessmentSituationResults[2],
            i === 3 ? row : o.assessmentSituationResults[3],
          ] as DemoMatchOutcomes["assessmentSituationResults"],
        }
      })
    },
    []
  )

  const handleFinalReflectionTextUsed = useCallback(() => {
    setMatchOutcomes((o) => ({ ...o, reflectionFinalTextUsed: true }))
  }, [])

  let main: ReactNode
  switch (phase) {
    case "intro":
      main = <IntroPage onStartCourse={startCourseFromIntro} />
      break
    case "demoOutline":
      main = <DemoOutlinePage onBegin={() => setPhase("competitionActivity")} />
      break
    case "competitionActivity":
      main = <CompetitionActivityPage onNextGame={goToChance} onReplay={handleCompetitionReplay} />
      break
    case "chance":
      main = <ChancePage onContinue={goToMimicry} />
      break
    case "mimicry":
      main = <MimicryPage onContinue={goToChaos} />
      break
    case "chaos":
      main = <ChaosPage onContinue={goToRecognitionFromChaos} />
      break
    case "recognition":
      main = (
        <RecognitionPage
          outcomes={matchOutcomes}
          onComplete={goToRecognitionCategories}
          onMatchMistake={handleRecognitionMistake}
        />
      )
      break
    case "recognitionCategories":
      main = <RecognitionCategoriesPage onContinue={goToRecognitionMiniReflection} />
      break
    case "recognitionMiniReflection":
      main = (
        <RecognitionReflectionPage
          onContinue={goToPostRecognition}
          onReflectionUsed={handleRecognitionReflectionUsed}
        />
      )
      break
    case "postRecognition":
      main = <PostRecognitionPage onContinue={goToBook} />
      break
    case "book":
      main = <AxisPage onContinue={goToAssessment} onAxisQuizSubmit={handleAxisQuizSubmit} />
      break
    case "axisTogether":
      main = (
        <AssessmentPage
          onContinue={goToReflection}
          onAssessmentSituationSubmit={handleAssessmentSituationSubmit}
        />
      )
      break
    case "axesAssessment":
      main = (
        <AssessmentPage
          onContinue={goToReflection}
          onAssessmentSituationSubmit={handleAssessmentSituationSubmit}
        />
      )
      break
    case "reflection":
      main = (
        <ReflectionPage onContinue={finishReflection} onReflectionTextUsed={handleFinalReflectionTextUsed} />
      )
      break
    default: {
      const _exhaustive: never = phase
      void _exhaustive
      main = null
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen min-w-0 flex-1">
        {main}
      </main>
      <CourseNavPanel
        phase={phase}
        onNavigate={setPhase}
        adminPanelOpen={adminPanelOpen}
        onToggleAdminPanel={() => setAdminPanelOpen(!adminPanelOpen)}
      />
      <AdminPage
        currentPhase={phase}
        onNavigate={setPhase}
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  )
}
