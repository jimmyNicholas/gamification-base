import { bodySection } from "@/sections/body"

export {
  DEFAULT_INTRO_COPY,
  IntroPage,
  type IntroOutline,
  type IntroPageProps,
} from "@/sections/intro/intro-page"

export {
  DEMO_MAIN_WIDE,
  DEMO_OUTLINE_BG,
  DemoStyleLayout,
  type DemoStyleLayoutProps,
} from "@/sections/demo/demo-outline-layout"

export { DemoOutlinePage, type DemoOutlinePageProps } from "@/sections/demo/demo-outline-page"

export { CompetitionActivityPage } from "@/sections/demo/competition-activity/competition-activity-page"

export { ChancePage, type ChancePageProps } from "@/sections/demo/chance/chance-page"

export { MimicryPage, type MimicryPageProps } from "@/sections/demo/mimicry/mimicry-page"

export { ChaosPage, type ChaosPageProps } from "@/sections/demo/chaos/chaos-page"

export {
  MatchTheFourPage,
  type MatchTheFourPageProps,
} from "@/sections/demo/match-the-four/match-the-four-page"

export {
  VideoGroundingPage,
  type VideoGroundingPageProps,
} from "@/sections/demo/video-grounding/video-grounding-page"

export { QuadrantsBookPage, type QuadrantsBookPageProps } from "@/sections/demo/quadrants-axes/quadrants-book-page"

export { AxisAgencyFatePage, type AxisAgencyFatePageProps } from "@/sections/demo/quadrants-axes/axis-agency-fate-page"

export {
  AxisSelfIntactDissolvedPage,
  type AxisSelfIntactDissolvedPageProps,
} from "@/sections/demo/quadrants-axes/axis-self-intact-dissolved-page"

export { AxesAssessmentPage, type AxesAssessmentPageProps } from "@/sections/demo/quadrants-axes/axes-assessment-page"

export { ReflectionPage, type ReflectionPageProps } from "@/sections/demo/quadrants-axes/reflection-page"

export {
  initialDemoMatchOutcomes,
  type DemoMatchOutcomes,
} from "@/sections/demo/match-the-four/demo-match-outcomes"

/** In-course sections only (title / outline live on `IntroPage`). */
export const courseSections = [bodySection]
