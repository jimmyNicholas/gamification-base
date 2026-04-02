import { cn } from "@/lib/utils"

// --- Typography (demo activities)

/** Centered title above a demo step or game (chaos, timed match, etc.). */
export const demoActivityHeadingClassName =
  "text-center text-xl font-bold leading-snug text-black sm:text-2xl"

/** Centered supporting copy under a title or standalone intro (e.g. match-the-four). */
export const demoActivityInstructionClassName =
  "text-center text-base font-medium leading-snug text-black/85 sm:text-lg"

/** Narrow column for a heading + instruction stack. */
export const demoActivityCopyBlockClassName =
  "mx-auto flex w-full max-w-3xl flex-col gap-3 text-center"

/** Bold scene prompt in roleplay (usually left-aligned; pair with `text-center` when needed). */
export const demoMimicryScenePromptClassName =
  "text-lg font-bold leading-snug text-black sm:text-xl sm:leading-snug md:text-2xl md:leading-snug"

/** Small uppercased UI label (“Your move”, etc.). */
export const demoUiEyebrowClassName =
  "text-xs font-semibold uppercase tracking-wide text-black/50 sm:text-[0.8rem]"

/** Muted helper line under controls. */
export const demoUiHelperTextClassName =
  "text-center text-xs leading-snug text-black/55 sm:text-sm"

/** Small panel heading (e.g. leaderboard title). */
export const demoPanelTitleClassName =
  "mb-2 text-center text-sm font-semibold text-black sm:text-base"

/**
 * Same horizontal cap as chaos / mimicry stages — use for wide demo games
 * (competition match, chance engine) so they fill the viewport like those flows.
 */
export const demoWideContentClassName = "mx-auto w-full max-w-[min(100%,3200px)]"

/** Width cap + rounded frame + shadow shared by large demo stages. */
export const demoStageShellCoreClassName =
  "relative w-full max-w-[min(100%,3200px)] overflow-hidden rounded-2xl border-2 shadow-[0_8px_28px_rgba(0,0,0,0.12)]"

export const demoStageBorderFaintClassName = "border-black/15"
export const demoStageBorderMimicryClassName = "border-black/20"

export const demoStageGradientFillClassName =
  "bg-linear-to-b from-white/90 to-[#e8f5ef]/90"

/**
 * Match-the-four content width + padding on the mint page (no lifted card —
 * same flat treatment as competition `CustomTimedMatch` with `flatSurface`).
 */
export const demoStageMatchTheFourPanelClassName = cn(
  demoWideContentClassName,
  "relative px-0 py-2 sm:py-3 md:py-4"
)

/** Chaos Q1 quadrant arena. */
export const demoStageChaosQ1ClassName = cn(
  demoStageShellCoreClassName,
  "mx-auto aspect-3600/1800",
  demoStageBorderFaintClassName,
  "bg-white/80"
)

/** Chaos Q2 skills arena. */
export const demoStageChaosQ2ClassName = cn(
  demoStageShellCoreClassName,
  "mx-auto h-[min(60vh,780px)]",
  demoStageBorderFaintClassName,
  demoStageGradientFillClassName
)

/** Mimicry scene frame (no horizontal centering — parent is `items-center`). */
export const demoStageMimicryFrameClassName = cn(
  demoStageShellCoreClassName,
  "flex flex-col",
  demoStageBorderMimicryClassName,
  "md:aspect-3600/1800"
)

/** Mint primary CTA — full width of parent, `px-8`. */
export const demoPrimaryCtaNarrowClassName =
  "h-13 w-full rounded-full border border-black bg-[#a8e5cf] px-8 text-sm font-bold tracking-[0.08em] text-black uppercase shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-[#98d9c1] sm:h-14 sm:text-base"

/** Mint primary CTA — `max-w-md`, `px-10`. */
export const demoPrimaryCtaConstrainedClassName =
  "h-13 w-full max-w-md rounded-full border border-black bg-[#a8e5cf] px-10 text-sm font-bold tracking-[0.08em] text-black uppercase shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-[#98d9c1] sm:h-14 sm:text-base"

/** Extra classes for native `<button>` / focusable divs outside shadcn `Button`. */
export const demoPrimaryCtaNativeFocusClassName =
  "cursor-pointer outline-none transition-colors hover:text-black focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"

/** Selected teaching-style pill (e.g. chaos Q1). */
export const demoMintSelectionSurfaceClassName =
  "z-10 border-2 border-black bg-[#a8e5cf] text-black ring-2 ring-black/25"
