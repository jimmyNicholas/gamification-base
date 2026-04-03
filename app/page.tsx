"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"

import { CourseNavPanel, type CoursePhase } from "@/components/course-nav-panel"
import {
  clearDemoMatchOutcomesSession,
  loadDemoMatchOutcomesFromSession,
  saveDemoMatchOutcomesToSession,
} from "@/lib/demo-match-outcomes-session"
import {
  ChancePage,
  ChaosPage,
  CompetitionActivityPage,
  DemoOutlinePage,
  initialDemoMatchOutcomes,
  IntroPage,
  RecognitionPage,
  PostRecognitionPage,
  MimicryPage,
  AxisPage,
  AxisAgencyFatePage,
  AxisSelfIntactDissolvedPage,
  AxesAssessmentPage,
  ReflectionPage,
  type DemoMatchOutcomes,
} from "@/sections"

export default function Home() {
  const [phase, setPhase] = useState<CoursePhase>("intro")
  const [matchOutcomes, setMatchOutcomes] = useState<DemoMatchOutcomes>(() => initialDemoMatchOutcomes())
  const [matchOutcomesSessionReady, setMatchOutcomesSessionReady] = useState(false)

  useEffect(() => {
    const loaded = loadDemoMatchOutcomesFromSession()
    if (loaded) setMatchOutcomes(loaded)
    setMatchOutcomesSessionReady(true)
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

  const goToMimicry = useCallback((payload?: { answer: string }) => {
    setMatchOutcomes((o) => ({
      ...o,
      chanceAnswer: payload?.answer ?? o.chanceAnswer,
    }))
    setPhase("mimicry")
  }, [])

  const goToChaos = useCallback(
    (payload?: { hatLabel: string | null; hatImageSrc: string | null }) => {
      setMatchOutcomes((o) => ({
        ...o,
        roleplayHatLabel: payload?.hatLabel ?? o.roleplayHatLabel,
        roleplayHatImageSrc: payload?.hatImageSrc ?? o.roleplayHatImageSrc,
      }))
      setPhase("chaos")
    },
    []
  )

  const goToRecognitionFromChaos = useCallback((payload?: { chaosQ2Skills: readonly string[] }) => {
    setMatchOutcomes((o) => ({
      ...o,
      chaosQ2Skills: payload?.chaosQ2Skills ?? o.chaosQ2Skills,
    }))
    setPhase("recognition")
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

  const goToAxisAgencyFate = useCallback(() => {
    setPhase("axisAgencyFate")
  }, [])

  const goToAxisSelfIntactDissolved = useCallback(() => {
    setPhase("axisSelfIntactDissolved")
  }, [])

  const goToAxesAssessment = useCallback(() => {
    setPhase("axesAssessment")
  }, [])

  const goToReflection = useCallback(() => {
    setPhase("reflection")
  }, [])

  const finishReflection = useCallback(() => {
    setPhase("intro")
  }, [])

  let main: ReactNode
  if (phase === "intro") {
    main = <IntroPage onStartCourse={startCourseFromIntro} />
  } else if (phase === "demoOutline") {
    main = <DemoOutlinePage onBegin={() => setPhase("competitionActivity")} />
  } else if (phase === "competitionActivity") {
    main = <CompetitionActivityPage onNextGame={goToChance} />
  } else if (phase === "chance") {
    main = <ChancePage onContinue={goToMimicry} />
  } else if (phase === "mimicry") {
    main = <MimicryPage onContinue={goToChaos} />
  } else if (phase === "chaos") {
    main = <ChaosPage onContinue={goToRecognitionFromChaos} />
  } else if (phase === "recognition") {
    main = <RecognitionPage outcomes={matchOutcomes} onContinue={goToPostRecognition} />
  } else if (phase === "postRecognition") {
    main = <PostRecognitionPage onContinue={goToBook} />
  } else if (phase === "book") {
    main = <AxisPage onContinue={goToAxisAgencyFate} />
  } else if (phase === "axisAgencyFate") {
    main = <AxisAgencyFatePage onContinue={goToAxisSelfIntactDissolved} />
  } else if (phase === "axisSelfIntactDissolved") {
    main = <AxisSelfIntactDissolvedPage onContinue={goToAxesAssessment} />
  } else if (phase === "axesAssessment") {
    main = <AxesAssessmentPage onContinue={goToReflection} />
  } else if (phase === "reflection") {
    main = <ReflectionPage onContinue={finishReflection} />
  } else {
    const _exhaustive: never = phase
    void _exhaustive
    main = null
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="min-h-screen min-w-0 flex-1">{main}</div>
      <CourseNavPanel phase={phase} onNavigate={setPhase} />
    </div>
  )
}
