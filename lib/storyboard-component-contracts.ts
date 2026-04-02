export type ComponentId =
  | "CourseShell"
  | "NarrativeScreen"
  | "MediaBlock"
  | "FlipCardGrid"
  | "MatchAssignBoard"
  | "HotspotAxisQuiz"
  | "HotspotQuadrantQuiz"
  | "ScenarioFlow"
  | "CustomTimedMatch"
  | "CustomChanceEngine"
  | "CustomChaosSelector"
  | "VisualDesignSystem";

export type ScreenType =
  | "intro"
  | "narrative"
  | "media"
  | "interaction"
  | "scenario"
  | "reflection"
  | "references"
  | "completion";

export type AssetType = "image" | "video" | "audio" | "icon" | "file" | "other";

export type ContinueRule =
  | "always"
  | "onFirstCompletion"
  | "onAllItemsVisited"
  | "onAllMatchesCorrect"
  | "onTimerFinished"
  | "onAxisComplete"
  | "onScenarioStepComplete"
  | "delayed";

export type RandomizationMode = "none" | "perSession" | "perAttempt";

export type InteractionMode = "click" | "drag" | "hybrid";

export type AxisId = "agency-fate" | "self-intact-dissolved";

export type QuadrantId = "Q1" | "Q2" | "Q3" | "Q4";

export interface AssetRef {
  id: string;
  type: AssetType;
  src: string;
  alt?: string;
  caption?: string;
}

export interface RichTextBlock {
  markdown?: string;
  plainText?: string;
}

export interface FeedbackBlock {
  correct?: RichTextBlock;
  partial?: RichTextBlock;
  incorrect?: RichTextBlock;
  neutral?: RichTextBlock;
}

export interface ContinueRulesConfig {
  rule: ContinueRule;
  delayMs?: number;
  minInteractions?: number;
}

export interface RandomizationRulesConfig {
  mode: RandomizationMode;
  seedKey?: string;
}

export interface BaseScreenContract<TInteractionConfig = unknown> {
  id: string;
  component: ComponentId;
  screenType: ScreenType;
  title: string;
  body?: RichTextBlock;
  narration?: string;
  assets?: AssetRef[];
  interactionConfig?: TInteractionConfig;
  feedback?: FeedbackBlock;
  continueRules: ContinueRulesConfig;
  randomizationRules?: RandomizationRulesConfig;
}

export interface CourseShellInteractionConfig {
  sectionId: string;
  sectionTitle: string;
  sectionIndex: number;
  totalSections: number;
  noBack?: boolean;
  triggerCompletionXapiOnReferences?: boolean;
}

export type CourseShellContract = BaseScreenContract<CourseShellInteractionConfig> & {
  component: "CourseShell";
  screenType: "intro" | "narrative" | "reflection" | "references" | "completion";
};

export interface NarrativeScreenInteractionConfig {
  prompt?: string;
  showReflectionInput?: boolean;
  reflectionMinChars?: number;
}

export type NarrativeScreenContract =
  BaseScreenContract<NarrativeScreenInteractionConfig> & {
    component: "NarrativeScreen";
    screenType: "intro" | "narrative" | "reflection" | "references";
  };

export interface MediaBlockInteractionConfig {
  mediaAssetId: string;
  allowSkip?: boolean;
  readingFallbackAssetId?: string;
  requireVideoCompletion?: boolean;
}

export type MediaBlockContract = BaseScreenContract<MediaBlockInteractionConfig> & {
  component: "MediaBlock";
  screenType: "media";
};

export interface FlipCard {
  id: string;
  front: RichTextBlock;
  back: RichTextBlock;
  category?: string;
}

export interface FlipCardGridInteractionConfig {
  layout: "2x2";
  cards: FlipCard[];
  persistVisitedState: boolean;
  requiredVisitedCount?: number;
}

export type FlipCardGridContract =
  BaseScreenContract<FlipCardGridInteractionConfig> & {
    component: "FlipCardGrid";
    screenType: "interaction";
  };

export interface MatchSourceItem {
  id: string;
  label: string;
  iconAssetId?: string;
}

export interface MatchTargetItem {
  id: string;
  label: string;
  category: string;
}

export interface MatchAssignBoardInteractionConfig {
  mode: InteractionMode;
  boardSize: "4x4" | "8x4";
  sources: MatchSourceItem[];
  targets: MatchTargetItem[];
  allowRetry: boolean;
  showGentleRedirects: boolean;
}

export type MatchAssignBoardContract =
  BaseScreenContract<MatchAssignBoardInteractionConfig> & {
    component: "MatchAssignBoard";
    screenType: "interaction";
  };

export interface AxisScenario {
  id: string;
  prompt: string;
  correctValue: number;
  redirectMessage?: string;
}

export interface HotspotAxisQuizInteractionConfig {
  axis: AxisId;
  minValue: -100;
  maxValue: 100;
  scenarios: AxisScenario[];
  randomizeScenarioOrder: boolean;
  showGentleRedirects: boolean;
}

export type HotspotAxisQuizContract =
  BaseScreenContract<HotspotAxisQuizInteractionConfig> & {
    component: "HotspotAxisQuiz";
    screenType: "interaction";
  };

export interface QuadrantScenario {
  id: string;
  prompt: string;
  selectedQuadrant?: QuadrantId;
  expectedQuadrant: QuadrantId;
  consequence: RichTextBlock;
  compareMessage?: RichTextBlock;
}

export interface HotspotQuadrantQuizInteractionConfig {
  scenarios: QuadrantScenario[];
  allowComparisonState: boolean;
  showConsequenceFeedback: boolean;
}

export type HotspotQuadrantQuizContract =
  BaseScreenContract<HotspotQuadrantQuizInteractionConfig> & {
    component: "HotspotQuadrantQuiz";
    screenType: "interaction";
  };

export interface ScenarioChoice {
  id: string;
  label: string;
  nextStepId: string;
}

export interface ScenarioStep {
  id: string;
  role: string;
  prompt: RichTextBlock;
  choices: ScenarioChoice[];
}

export interface ScenarioFlowInteractionConfig {
  steps: ScenarioStep[];
  startStepId: string;
  noFailForward: true;
}

export type ScenarioFlowContract = BaseScreenContract<ScenarioFlowInteractionConfig> & {
  component: "ScenarioFlow";
  screenType: "scenario" | "interaction";
};

export interface CustomTimedMatchInteractionConfig {
  durationMs: number;
  precisionMs: 100;
  persistSessionBest: boolean;
  leaderboardPreset: Array<{ learnerAlias: string; scoreMs: number }>;
}

export type CustomTimedMatchContract =
  BaseScreenContract<CustomTimedMatchInteractionConfig> & {
    component: "CustomTimedMatch";
    screenType: "interaction";
  };

export interface ChanceCard {
  id: string;
  label: string;
  weight: number;
}

export interface CustomChanceEngineInteractionConfig {
  cardPool: ChanceCard[];
  enableWheelSpin: boolean;
  naturalDeceleration: boolean;
  oneClickControls: boolean;
  continueDelayMs: number;
}

export type CustomChanceEngineContract =
  BaseScreenContract<CustomChanceEngineInteractionConfig> & {
    component: "CustomChanceEngine";
    screenType: "interaction";
  };

export interface ChaosCard {
  id: string;
  label: string;
  rankLabel?: string;
}

export interface CustomChaosSelectorInteractionConfig {
  cards: ChaosCard[];
  requiredSelectionCount: 4;
  rankingTimerMs: number;
}

export type CustomChaosSelectorContract =
  BaseScreenContract<CustomChaosSelectorInteractionConfig> & {
    component: "CustomChaosSelector";
    screenType: "interaction";
  };

export interface CategoryVisualToken {
  category: string;
  color: string;
  iconAssetId: string;
  highContrastBorderColor: string;
}

export interface VisualDesignSystemInteractionConfig {
  categoryTokens: CategoryVisualToken[];
  axisAssetId: string;
  quadrantAssetId: string;
  iconAndColorRedundancyRequired: boolean;
}

export type VisualDesignSystemContract =
  BaseScreenContract<VisualDesignSystemInteractionConfig> & {
    component: "VisualDesignSystem";
    screenType: "intro" | "narrative";
  };

export type StoryboardScreenContract =
  | CourseShellContract
  | NarrativeScreenContract
  | MediaBlockContract
  | FlipCardGridContract
  | MatchAssignBoardContract
  | HotspotAxisQuizContract
  | HotspotQuadrantQuizContract
  | ScenarioFlowContract
  | CustomTimedMatchContract
  | CustomChanceEngineContract
  | CustomChaosSelectorContract
  | VisualDesignSystemContract;

export type ReusableComponentContractMap = {
  CourseShell: CourseShellContract;
  NarrativeScreen: NarrativeScreenContract;
  MediaBlock: MediaBlockContract;
  FlipCardGrid: FlipCardGridContract;
  MatchAssignBoard: MatchAssignBoardContract;
  HotspotAxisQuiz: HotspotAxisQuizContract;
  HotspotQuadrantQuiz: HotspotQuadrantQuizContract;
  ScenarioFlow: ScenarioFlowContract;
  CustomTimedMatch: CustomTimedMatchContract;
  CustomChanceEngine: CustomChanceEngineContract;
  CustomChaosSelector: CustomChaosSelectorContract;
  VisualDesignSystem: VisualDesignSystemContract;
};
