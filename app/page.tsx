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
  MatchTheFourPage,
  MimicryPage,
  VideoGroundingPage,
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

  const goToMatchTheFour = useCallback((payload?: { chaosQ2Skills: readonly string[] }) => {
    setMatchOutcomes((o) => ({
      ...o,
      chaosQ2Skills: payload?.chaosQ2Skills ?? o.chaosQ2Skills,
    }))
    setPhase("matchTheFour")
  }, [])

  const goToVideoGrounding = useCallback(() => {
    setPhase("videoGrounding")
  }, [])

  const finishVideoGrounding = useCallback(() => {
    setPhase("intro")
  }, [])

  const startCourseFromIntro = useCallback(() => {
    clearDemoMatchOutcomesSession()
    setMatchOutcomes(initialDemoMatchOutcomes())
    setPhase("demoOutline")
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
    main = <ChaosPage onContinue={goToMatchTheFour} />
  } else if (phase === "matchTheFour") {
    main = <MatchTheFourPage outcomes={matchOutcomes} onContinue={goToVideoGrounding} />
  } else if (phase === "videoGrounding") {
    main = <VideoGroundingPage onContinue={finishVideoGrounding} />
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
