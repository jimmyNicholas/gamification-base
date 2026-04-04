import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const matchCardSurfaceClass =
  "flex aspect-square min-h-[9rem] w-full max-w-[13rem] items-center justify-center rounded-2xl border-2 px-4 py-4 transition-colors sm:min-h-[10.5rem] sm:max-w-[15rem] sm:px-4 sm:py-5"

/** Fills the grid cell on wide layouts (competition demo); no fixed max-width cap. */
export const matchCardFluidSurfaceClass =
  "flex aspect-square w-full min-w-0 items-center justify-center rounded-2xl border-2 px-3 py-3 transition-colors sm:px-4 sm:py-4 md:px-5 md:py-5"

const matchCardMatchedSurfaceClass =
  "border-amber-500 bg-amber-50 text-amber-950"

function matchCardSelectionSurface(selected: boolean, interactive: boolean) {
  if (!interactive) return "border-black bg-white"
  return selected
    ? "border-blue-600 bg-blue-600/15"
    : "border-black bg-white hover:border-blue-600/75 hover:bg-blue-600/5"
}

/** Keeps `frameClassName` borders (e.g. category 4px left accent) while showing focus/selection. */
function matchCardFrameSelectionSurface(selected: boolean, interactive: boolean) {
  if (!interactive) return ""
  return selected
    ? "z-[1] ring-2 ring-blue-600 ring-offset-2 bg-blue-600/12"
    : "hover:bg-black/[0.04]"
}

function MatchCardMatchedStack({
  leading,
  label,
  fluid = false,
}: {
  leading: ReactNode
  label: string
  fluid?: boolean
}) {
  return (
    <div className="flex min-h-0 w-full flex-col items-center justify-center gap-1.5">
      <div
        className={cn(
          "flex items-center justify-center leading-none",
          fluid ? "text-[clamp(2rem,26cqw,4.75rem)]" : "text-[3.25rem] sm:text-[3.75rem]"
        )}
        aria-hidden
      >
        {leading}
      </div>
      <span
        className={cn(
          "text-center font-medium leading-snug",
          fluid
            ? "text-[clamp(0.65rem,5cqw,1.05rem)] sm:text-[clamp(0.72rem,4.5cqw,1.125rem)]"
            : "text-[0.75rem] sm:text-sm"
        )}
      >
        {label}
      </span>
    </div>
  )
}

/** Keyboard shortcut label; `pointer-events-none` so parent button receives clicks. */
function CardKeyHint({ char }: { char: string }) {
  return (
    <span
      className="pointer-events-none absolute right-2 top-2 z-10 text-[0.65rem] font-medium tabular-nums text-black/60 sm:right-2.5 sm:top-2.5"
      aria-hidden
    >
      {char}
    </span>
  )
}

function matchCardEmojiSizeClass(fluid: boolean) {
  return fluid
    ? "text-[clamp(2.5rem,30cqw,5.5rem)]"
    : "text-[3.25rem] leading-none sm:text-[3.75rem]"
}

export function MatchEmojiCard({
  emoji,
  content,
  className,
  selected = false,
  matched = false,
  matchedPresentation = "hide",
  matchedAccentClassName,
  onClick,
  keyHint,
  ariaLabel,
  layout = "default",
}: {
  /** Shown when `content` is not provided. */
  emoji?: string
  /** When set, replaces the emoji slot (e.g. illustration placeholder). */
  content?: ReactNode
  className?: string
  selected?: boolean
  /** When `hide`, keeps an invisible cell (competition behaviour). When `accent`, shows a tinted locked cell. */
  matched?: boolean
  matchedPresentation?: "hide" | "accent"
  /** Used with `matchedPresentation="accent"` (e.g. category 4px left border + tint). */
  matchedAccentClassName?: string
  onClick?: () => void
  /** Shown in the top-right corner of the card (e.g. keyboard shortcut). */
  keyHint?: string
  /** Accessible name when `content` is non-textual or abbreviated. */
  ariaLabel?: string
  /** `fluid` = grow with the grid cell (wide competition layout). */
  layout?: "default" | "fluid"
}) {
  const surfaceBase = layout === "fluid" ? matchCardFluidSurfaceClass : matchCardSurfaceClass
  const emojiSizeClass = matchCardEmojiSizeClass(layout === "fluid")
  if (matched) {
    if (matchedPresentation === "accent" && matchedAccentClassName) {
      return (
        <div
          className={cn(
            surfaceBase,
            "@container pointer-events-none relative overflow-hidden",
            matchedAccentClassName,
            className
          )}
          aria-hidden
        />
      )
    }
    return (
      <div
        className={cn(surfaceBase, "invisible pointer-events-none", className)}
        aria-hidden
      />
    )
  }

  const surface = cn(
    surfaceBase,
    layout === "fluid" && "@container",
    matchCardSelectionSurface(selected, !!onClick),
    content != null
      ? "relative min-h-0 px-2 py-2 text-sm font-medium leading-snug sm:px-3 sm:text-base"
      : cn("relative leading-none", emojiSizeClass),
    onClick &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
    className
  )

  const rawInner = content ?? (emoji != null ? <span aria-hidden>{emoji}</span> : null)
  const inner =
    ariaLabel != null ? (
      <span className="flex min-h-0 w-full flex-col items-center justify-center" aria-hidden>
        {rawInner}
      </span>
    ) : (
      rawInner
    )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-keyshortcuts={keyHint}
        aria-label={ariaLabel}
        className={surface}
      >
        {keyHint ? <CardKeyHint char={keyHint} /> : null}
        {inner}
      </button>
    )
  }

  return (
    <div className={surface} aria-hidden={ariaLabel != null ? undefined : true} aria-label={ariaLabel}>
      {keyHint ? <CardKeyHint char={keyHint} /> : null}
      {inner}
    </div>
  )
}

export function MatchLabelCard({
  label,
  className,
  frameClassName,
  selected = false,
  matched = false,
  unmatchedLeading,
  matchedEmoji,
  matchedLeading,
  matchedSurfaceClassName,
  onClick,
  keyHint,
  layout = "default",
}: {
  label: string
  className?: string
  /** Category tint / 4px left border while unmatched (e.g. chaos “Match the Four”). */
  frameClassName?: string
  selected?: boolean
  matched?: boolean
  /** Illustration above the label while unmatched (e.g. category icon on the right column). */
  unmatchedLeading?: ReactNode
  /** Shown above the label when `matched` is true (unless `matchedLeading` is set). */
  matchedEmoji?: string
  /** Matched-state illustration slot; overrides `matchedEmoji` when both are set. */
  matchedLeading?: ReactNode
  /** Replaces default amber matched surface. */
  matchedSurfaceClassName?: string
  onClick?: () => void
  /** Shown in the top-right corner of the card (e.g. keyboard shortcut). */
  keyHint?: string
  layout?: "default" | "fluid"
}) {
  const surfaceBase = layout === "fluid" ? matchCardFluidSurfaceClass : matchCardSurfaceClass
  const isFluid = layout === "fluid"

  const canShowMatched = matched && (matchedEmoji != null || matchedLeading != null)
  if (canShowMatched) {
    const leading =
      matchedLeading ??
      (matchedEmoji != null ? (
        isFluid ? (
          <span aria-hidden>{matchedEmoji}</span>
        ) : (
          <span className="text-[3.25rem] leading-none sm:text-[3.75rem]" aria-hidden>
            {matchedEmoji}
          </span>
        )
      ) : null)
    const surface = cn(
      surfaceBase,
      isFluid && "@container",
      matchedSurfaceClassName ?? matchCardMatchedSurfaceClass,
      keyHint && "relative",
      className
    )
    return (
      <div className={surface}>
        {keyHint ? <CardKeyHint char={keyHint} /> : null}
        <MatchCardMatchedStack
          fluid={isFluid}
          leading={
            leading ?? (
              <span className="inline-block h-10 w-10 bg-black/25" aria-hidden />
            )
          }
          label={label}
        />
      </div>
    )
  }

  const labelTextClass = isFluid
    ? "text-[clamp(0.7rem,5.5cqw,1.125rem)] sm:text-[clamp(0.8rem,5cqw,1.2rem)]"
    : "text-[0.75rem] sm:text-sm"

  const surface = cn(
    surfaceBase,
    layout === "fluid" && "@container",
    frameClassName,
    frameClassName && onClick
      ? matchCardFrameSelectionSurface(selected, !!onClick)
      : matchCardSelectionSurface(selected, !!onClick),
    "relative text-center font-medium leading-snug",
    labelTextClass,
    onClick &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
    className
  )

  if (unmatchedLeading != null) {
    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={selected}
          aria-keyshortcuts={keyHint}
          className={surface}
        >
          {keyHint ? <CardKeyHint char={keyHint} /> : null}
          <MatchCardMatchedStack fluid={isFluid} leading={unmatchedLeading} label={label} />
        </button>
      )
    }
    return (
      <div className={surface}>
        {keyHint ? <CardKeyHint char={keyHint} /> : null}
        <MatchCardMatchedStack fluid={isFluid} leading={unmatchedLeading} label={label} />
      </div>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        aria-keyshortcuts={keyHint}
        className={surface}
      >
        {keyHint ? <CardKeyHint char={keyHint} /> : null}
        {label}
      </button>
    )
  }

  return (
    <div className={surface}>
      {keyHint ? <CardKeyHint char={keyHint} /> : null}
      {label}
    </div>
  )
}
