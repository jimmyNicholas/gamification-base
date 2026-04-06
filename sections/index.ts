import { bodySection } from "@/sections/body"

export {
  DEFAULT_INTRO_COPY,
  IntroPage,
  type IntroOutline,
  type IntroPageProps,
} from "@/sections/intro/intro-page"

export {
  DEMO_COMPETITION_AMBER_SURFACE,
  DEMO_MAIN_BASE_CLASSNAME,
  DEMO_MAIN_WIDE,
  DEMO_OUTLINE_BG,
  DEMO_RECOGNITION_SURFACE,
  DemoStyleLayout,
  type DemoStyleLayoutProps,
} from "@/sections/demo/demo-outline-layout"

export { DemoOutlinePage, type DemoOutlinePageProps } from "@/sections/demo/demo-outline-page"

export { CompetitionActivityPage } from "@/sections/demo/competition-activity/competition-activity-page"

export { ChancePage, type ChancePageProps } from "@/sections/demo/chance/chance-page"

export { MimicryPage, type MimicryPageProps } from "@/sections/demo/mimicry/mimicry-page"

export { ChaosPage, type ChaosPageProps } from "@/sections/demo/chaos/chaos-page"

export { RecognitionPage, type RecognitionPageProps } from "@/sections/recog/recognition-page"

export {
  RecognitionCategoriesPage,
  type RecognitionCategoriesPageProps,
} from "@/sections/recog/recognition-categories-page"

export {
  RecognitionReflectionPage,
  type RecognitionReflectionPageProps,
} from "@/sections/recog/recognition-reflection-page"

export { PostRecognitionPage, type PostRecognitionPageProps } from "@/sections/recog/post-recognition-page"

export { RecogLayout, type RecogLayoutProps } from "@/sections/recog/recog-layout"

export {
  AxisPage,
  type AxisPageProps,
  type AxisPageStep,
  type AxisQuizStep,
} from "@/sections/analysis/axis-page"

export {
  AssessmentPage,
  type AssessmentPageProps,
  type AssessmentPageStep,
} from "@/sections/assessment/assessment-page"


export { ReflectionPage, type ReflectionPageProps } from "@/sections/reflection/reflection-page"

export { ReferencesPage, type ReferencesPageProps } from "@/sections/references/references-page"

export {
  initialDemoMatchOutcomes,
  type AssessmentSituationResult,
  type DemoMatchOutcomes,
} from "@/sections/demo/match-the-four/demo-match-outcomes"

/** In-course sections only (title / outline live on `IntroPage`). */
export const courseSections = [bodySection]
