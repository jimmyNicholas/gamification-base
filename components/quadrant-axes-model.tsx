"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"

type ModelMode = "placeholderHidden" | "matchReveal" | "book" | "singleAxisQuiz" | "axesAssessment" | "wireframe" | "controlled"

type AxisFocus = "horizontal" | "vertical"

type AxisIndex = 0 | 1 | 2 | 3 | 4

const AXIS_CENTER: AxisIndex = 2
const AXIS_MIN: AxisIndex = 0
const AXIS_MAX: AxisIndex = 4

export type QuadrantVisualState = "invisible" | "inactive" | "color" | "highlighted"
export type AxisVisualState = "invisible" | "inactiveGrey" | "inactiveColor" | "activeColor"

const QUADRANT_LABELS: Record<QuadrantId, string> = {
  Q1: "High agency + self-intact",
  Q2: "High agency + self-dissolved",
  Q3: "High fate + self-intact",
  Q4: "High fate + self-dissolved",
}

const QUADRANT_BACKFALLBACK: Record<QuadrantId, string> = {
  Q1: "Learners feel authorship and emotional safety. Activities invite control and clarity.",
  Q2: "Learners feel authorship, but the learner-self is fragile. Activities emphasize expression with less stability.",
  Q3: "Learners feel driven by external structure and outcomes. Activities support clarity through constraints.",
  Q4: "Learners feel driven by external chaos and uncertainty. Activities create strong reactions, but can reduce retention.",
}

const QUADRANT_THEME: Record<QuadrantId, { bg: string; border: string }> = {
  Q1: { bg: "bg-amber-50/90", border: "border-amber-500/70" },
  Q2: { bg: "bg-violet-50/90", border: "border-violet-500/70" },
  Q3: { bg: "bg-emerald-50/90", border: "border-emerald-500/70" },
  Q4: { bg: "bg-pink-50/90", border: "border-pink-500/70" },
}

const QUADRANT_LAYOUT: Record<QuadrantId, { row: 0 | 1; col: 0 | 1 }> = {
  // 2x2: top = self-intact, bottom = self-dissolved; left = agency, right = fate
  Q1: { row: 0, col: 0 }, // top-left
  Q3: { row: 0, col: 1 }, // top-right
  Q2: { row: 1, col: 0 }, // bottom-left
  Q4: { row: 1, col: 1 }, // bottom-right
}

const isAxisIndex = (v: number): v is AxisIndex => v >= 0 && v <= 4

function clampAxisIndex(v: number | undefined): AxisIndex | null {
  if (v == null) return null
  if (!Number.isFinite(v)) return null
  const rounded = Math.round(v)
  if (!Number.isFinite(rounded)) return null
  if (rounded <= AXIS_MIN) return AXIS_MIN
  if (rounded >= AXIS_MAX) return AXIS_MAX
  if (isAxisIndex(rounded)) return rounded
  return null
}

function axisIndexToPercent(index: AxisIndex): number {
  // 0..4 -> 0..100 (5 evenly spaced points)
  return (index / AXIS_MAX) * 100
}

function normalizeAxisState(state: AxisVisualState | QuadrantVisualState | undefined): AxisVisualState {
  // Backward compatibility for older callers that passed "color"/"highlighted"/"active".
  const s = state as string | undefined
  if (s === "color" || s === "highlighted" || s === "active") return "activeColor"
  if (state === "inactive") return "inactiveGrey"
  if (state === "invisible" || state === "inactiveGrey" || state === "inactiveColor" || state === "activeColor") return state
  return "invisible"
}

function inferHorizontalSide(index: number | undefined): "left" | "right" | null {
  if (index == null || !isAxisIndex(index)) return null
  if (index === AXIS_CENTER) return null
  return index <= 1 ? "left" : "right"
}

function inferVerticalSide(index: number | undefined): "top" | "bottom" | null {
  if (index == null || !isAxisIndex(index)) return null
  if (index === AXIS_CENTER) return null
  return index <= 1 ? "top" : "bottom"
}

function inferQuadrantFromAxes(horizontalIndex: number | undefined, verticalIndex: number | undefined): QuadrantId | null {
  const h = inferHorizontalSide(horizontalIndex)
  const v = inferVerticalSide(verticalIndex)
  if (!h || !v) return null

  if (h === "left" && v === "top") return "Q1"
  if (h === "left" && v === "bottom") return "Q2"
  if (h === "right" && v === "top") return "Q3"
  return "Q4"
}

function inferQuadrantPairForSingleAxis(focusAxis: AxisFocus, valueIndex: number | undefined): QuadrantId[] {
  if (valueIndex == null) return []
  if (!isAxisIndex(valueIndex)) return []
  if (valueIndex === AXIS_CENTER) return []

  if (focusAxis === "horizontal") {
    return valueIndex <= 1 ? ["Q1", "Q2"] : ["Q3", "Q4"]
  }
  return valueIndex <= 1 ? ["Q1", "Q3"] : ["Q2", "Q4"]
}

type BookCard = { front: string; back: string }

/** Simple emoji + label, or a full custom tile (e.g. Match the Four outcome previews). */
export type MatchRevealCard =
  | { label: string; icon: React.ReactNode }
  | { fullTile: React.ReactNode }

export type MatchRevealTilePalette = "theme" | "plainWhite" | "neutralGrey"

export type QuadrantAxesModelProps = {
  mode: ModelMode
  className?: string
  revealedQuadrants?: ReadonlySet<QuadrantId> | QuadrantId[]

  // Used by single-axis quiz + A+.
  horizontalIndex?: number
  verticalIndex?: number
  focusAxis?: AxisFocus

  // Used by book mode.
  bookCards?: Partial<Record<QuadrantId, BookCard>>
  // Used by match-reveal mode.
  matchRevealCards?: Partial<Record<QuadrantId, MatchRevealCard>>
  /** Per display cell, which quadrant key to read from `matchRevealCards` (shuffle without moving axes). */
  matchRevealContentSource?: Partial<Record<QuadrantId, QuadrantId>>
  /** Tile chrome for match-reveal highlights (`theme` = quadrant colors). */
  matchRevealTilePalette?: MatchRevealTilePalette
  /**
   * Recognition left column: tiles toggle selection on click (`selected` is a display cell id, Q1–Q4).
   */
  matchRevealSelection?: { selected: QuadrantId | null; onSelect: (cell: QuadrantId) => void }
  /**
   * Recognition right column: when true, each grey tile uses that cell’s quadrant border colour.
   */
  matchRevealCategoryBorders?: boolean

  // Used by the "controlled" (wireframe debugging) mode.
  quadrantStates?: Partial<Record<QuadrantId, QuadrantVisualState>>
  axisStates?: Partial<{ horizontal: AxisVisualState; vertical: AxisVisualState }>
  showAxisLabels?: boolean
  onAxisToggle?: (axis: "horizontal" | "vertical") => void
  onAxisIndexChange?: (axis: "horizontal" | "vertical", index: AxisIndex) => void
}

export function QuadrantAxesModel({
  mode,
  className,
  revealedQuadrants,
  horizontalIndex,
  verticalIndex,
  focusAxis = "horizontal",
  bookCards,
  matchRevealCards,
  matchRevealContentSource,
  matchRevealTilePalette = "theme",
  matchRevealSelection,
  matchRevealCategoryBorders = false,
  quadrantStates,
  axisStates,
  showAxisLabels,
  onAxisToggle,
  onAxisIndexChange,
}: QuadrantAxesModelProps) {
  const uid = React.useId().replace(/:/g, "")

  const controlledHorizontalAxisState: AxisVisualState = normalizeAxisState(axisStates?.horizontal)
  const controlledVerticalAxisState: AxisVisualState = normalizeAxisState(axisStates?.vertical)

  const controlledAxisLabelsOpacity = mode === "controlled" ? (showAxisLabels ? 1 : 0) : 1

  const horizontalAxisOpacity =
    controlledHorizontalAxisState === "invisible" ? 0 : controlledHorizontalAxisState === "inactiveGrey" ? 0.35 : 1
  const verticalAxisOpacity =
    controlledVerticalAxisState === "invisible" ? 0 : controlledVerticalAxisState === "inactiveGrey" ? 0.35 : 1

  const horizontalAxisStroke =
    mode === "controlled" && controlledHorizontalAxisState === "inactiveGrey" ? "#9ca3af" : "#5b2dd6"
  const verticalAxisStroke =
    mode === "controlled" && controlledVerticalAxisState === "inactiveGrey" ? "#9ca3af" : "#7b4a12"

  const horizontalAxisStrokeWidth = 3.2
  const verticalAxisStrokeWidth = 3.2

  const horizontalMarkerFill = "#5b2dd6"
  const verticalMarkerFill = "#7b4a12"

  const axisLineClassName = (state: AxisVisualState, axis: "horizontal" | "vertical") => {
    const base = axis === "horizontal" ? "h-[5px] w-full" : "w-[5px] h-full"
    if (state === "inactiveGrey") return cn(base, "bg-black/30")
    if (state === "inactiveColor" || state === "activeColor") return cn(base, axis === "horizontal" ? "bg-[#5b2dd6]" : "bg-[#7b4a12]")
    // invisible: hide line, but reveal on hover to make it discoverable
    return cn(base, "bg-black/20 opacity-0 group-hover:opacity-40")
  }

  const horizontalMarkerIndex = clampAxisIndex(horizontalIndex) ?? AXIS_CENTER
  const verticalMarkerIndex = clampAxisIndex(verticalIndex) ?? AXIS_CENTER

  const markerCircleOpacity = (state: AxisVisualState) => (state === "activeColor" ? 1 : 0)

  const snapAxisIndexFromRatio = React.useCallback((ratio: number): AxisIndex => {
    const clampedRatio = Math.max(0, Math.min(1, ratio))
    const snapped = Math.round(clampedRatio * AXIS_MAX)
    return clampAxisIndex(snapped) ?? AXIS_CENTER
  }, [])

  const handleHorizontalAxisClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onAxisIndexChange) {
        const rect = event.currentTarget.getBoundingClientRect()
        if (rect.width > 0) {
          const ratio = (event.clientX - rect.left) / rect.width
          onAxisIndexChange("horizontal", snapAxisIndexFromRatio(ratio))
          return
        }
      }
      onAxisToggle?.("horizontal")
    },
    [onAxisIndexChange, onAxisToggle, snapAxisIndexFromRatio]
  )

  const handleVerticalAxisClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onAxisIndexChange) {
        const rect = event.currentTarget.getBoundingClientRect()
        if (rect.height > 0) {
          const ratio = (event.clientY - rect.top) / rect.height
          onAxisIndexChange("vertical", snapAxisIndexFromRatio(ratio))
          return
        }
      }
      onAxisToggle?.("vertical")
    },
    [onAxisIndexChange, onAxisToggle, snapAxisIndexFromRatio]
  )

  const revealedSet: Set<QuadrantId> = React.useMemo(() => {
    if (Array.isArray(revealedQuadrants)) return new Set(revealedQuadrants)
    if (revealedQuadrants instanceof Set) return revealedQuadrants
    return new Set()
  }, [revealedQuadrants])

  const quadrantHighlightSet: Set<QuadrantId> = React.useMemo(() => {
    if (mode === "placeholderHidden") return new Set()
    if (mode === "matchReveal") return revealedSet
    if (mode === "book") return new Set()
    if (mode === "singleAxisQuiz") {
      const valueIndex = focusAxis === "horizontal" ? horizontalIndex : verticalIndex
      return new Set(inferQuadrantPairForSingleAxis(focusAxis, valueIndex))
    }
    if (mode === "axesAssessment") {
      const q = inferQuadrantFromAxes(horizontalIndex, verticalIndex)
      return q ? new Set([q]) : new Set()
    }
    return new Set()
  }, [mode, revealedSet, focusAxis, horizontalIndex, verticalIndex])

  const axisVisibility = React.useMemo(() => {
    if (mode === "placeholderHidden" || mode === "matchReveal" || mode === "wireframe") return { horizontal: 0, vertical: 0 }
    if (mode === "controlled") return { horizontal: horizontalAxisOpacity, vertical: verticalAxisOpacity }
    if (mode === "singleAxisQuiz") {
      return focusAxis === "horizontal" ? { horizontal: 1, vertical: 0.25 } : { horizontal: 0.25, vertical: 1 }
    }
    // book, axesAssessment
    return { horizontal: 1, vertical: 1 }
  }, [mode, focusAxis, horizontalAxisOpacity, verticalAxisOpacity])

  const showQuadrantTiles = mode !== "placeholderHidden"

  const [flipped, setFlipped] = React.useState<Partial<Record<QuadrantId, boolean>>>({})

  // Keep flips stable within the book step (session refresh resilience not required yet).
  React.useEffect(() => {
    if (mode !== "book") setFlipped({})
  }, [mode])

  const onToggleFlip = (q: QuadrantId) => {
    if (mode !== "book") return
    setFlipped((prev) => ({ ...prev, [q]: !prev[q] }))
  }

  const bookCard = (q: QuadrantId): BookCard => {
    const fallback: BookCard = {
      front: QUADRANT_LABELS[q]!,
      back: QUADRANT_BACKFALLBACK[q]!,
    }
    return { ...fallback, ...(bookCards?.[q] ?? {}) }
  }

  const quadrantsInOrder: QuadrantId[] = ["Q1", "Q3", "Q2", "Q4"] // CSS grid read order: top-left, top-right, bottom-left, bottom-right

  return (
    <div
      className={cn("relative w-full max-w-88", className)}
      style={{ aspectRatio: "1 / 1" }}
      aria-label="Quadrants and axes model"
    >
      {mode === "controlled" ? (
        <>
          <button
            type="button"
            className={cn(
              "group absolute left-[50px] right-[50px] top-1/2 -translate-y-1/2 rounded-md p-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            )}
            aria-label="Horizontal axis"
            onClick={handleHorizontalAxisClick}
          >
            <div className="relative w-full">
              <div className={cn("rounded-full", axisLineClassName(controlledHorizontalAxisState, "horizontal"))} />
              {horizontalMarkerIndex != null && controlledHorizontalAxisState === "activeColor" ? (
                <div
                  className="pointer-events-none absolute top-1/2"
                  style={{
                    left: `${axisIndexToPercent(horizontalMarkerIndex)}%`,
                    transform: "translate(-50%, -50%)",
                    width: 14,
                    height: 14,
                    borderRadius: 9999,
                    background: horizontalMarkerFill,
                    opacity: markerCircleOpacity(controlledHorizontalAxisState),
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3px rgba(0,0,0,0.12)",
                  }}
                  aria-hidden
                />
              ) : null}
              {showAxisLabels ? (
                <>
                  <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[60px] whitespace-nowrap rounded-md bg-white/80 px-2 py-1 text-[14px] leading-none font-semibold text-black/70 shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-[2px]">
                    Agency
                  </div>
                  <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-[48px] whitespace-nowrap rounded-md bg-white/80 px-2 py-1 text-[14px] leading-none font-semibold text-black/70 shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-[2px]">
                    Fate
                  </div>
                </>
              ) : null}
            </div>
          </button>

          <button
            type="button"
            className={cn(
              "group absolute top-[50px] bottom-[50px] left-1/2 -translate-x-1/2 rounded-md p-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            )}
            aria-label="Vertical axis"
            onClick={handleVerticalAxisClick}
          >
            <div className="relative h-full">
              <div className={cn("rounded-full", axisLineClassName(controlledVerticalAxisState, "vertical"))} />
              {verticalMarkerIndex != null && controlledVerticalAxisState === "activeColor" ? (
                <div
                  className="pointer-events-none absolute left-1/2"
                  style={{
                    top: `${axisIndexToPercent(verticalMarkerIndex)}%`,
                    transform: "translate(-50%, -50%)",
                    width: 14,
                    height: 14,
                    borderRadius: 9999,
                    background: verticalMarkerFill,
                    opacity: markerCircleOpacity(controlledVerticalAxisState),
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3px rgba(0,0,0,0.12)",
                  }}
                  aria-hidden
                />
              ) : null}
              {showAxisLabels ? (
                <>
                  <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[35px] whitespace-nowrap rounded-md bg-white/80 px-2 py-1 text-[14px] leading-none font-semibold text-black/70 shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-[2px]">
                    Self-intact
                  </div>
                  <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[35px] whitespace-nowrap rounded-md bg-white/80 px-2 py-1 text-[14px] leading-none font-semibold text-black/70 shadow-[0_1px_0_rgba(0,0,0,0.08)] backdrop-blur-[2px]">
                    Self-dissolved
                  </div>
                </>
              ) : null}
            </div>
          </button>
        </>
      ) : (
        <svg
          className={cn("pointer-events-none absolute inset-0")}
          viewBox="-14 -14 128 128"
          preserveAspectRatio="none"
          aria-hidden
          style={{ overflow: "visible" }}
        >
          {/* Horizontal axis (Agency <-> Fate) */}
          <g opacity={axisVisibility.horizontal}>
            <line
              x1="-2"
              y1="50"
              x2="102"
              y2="50"
              stroke={horizontalAxisStroke}
              strokeWidth={horizontalAxisStrokeWidth}
            />
            {horizontalMarkerIndex != null && controlledHorizontalAxisState === "activeColor" ? (
              <circle
                cx={-2 + (104 * horizontalMarkerIndex) / AXIS_MAX}
                cy="50"
                r="4.6"
                fill={horizontalMarkerFill}
                opacity={markerCircleOpacity(controlledHorizontalAxisState)}
              />
            ) : null}
            <text
              x="-11"
              y="50"
              fontSize="6.6"
              fontWeight="700"
              fill="black"
              textAnchor="end"
              dominantBaseline="middle"
              opacity={controlledAxisLabelsOpacity}
            >
              Agency
            </text>
            <text
              x="111"
              y="50"
              fontSize="6.6"
              fontWeight="700"
              fill="black"
              textAnchor="start"
              dominantBaseline="middle"
              opacity={controlledAxisLabelsOpacity}
            >
              Fate
            </text>
          </g>

          {/* Vertical axis (Self-intact <-> Self-dissolved) */}
          <g opacity={axisVisibility.vertical}>
            <line
              x1="50"
              y1="-2"
              x2="50"
              y2="102"
              stroke={verticalAxisStroke}
              strokeWidth={verticalAxisStrokeWidth}
            />
            {verticalMarkerIndex != null && controlledVerticalAxisState === "activeColor" ? (
              <circle
                cx="50"
                cy={-2 + (104 * verticalMarkerIndex) / AXIS_MAX}
                r="4.6"
                fill={verticalMarkerFill}
                opacity={markerCircleOpacity(controlledVerticalAxisState)}
              />
            ) : null}
            <text
              x="50"
              y="-11"
              fontSize="6.6"
              fontWeight="700"
              fill="black"
              textAnchor="middle"
              dominantBaseline="central"
              opacity={controlledAxisLabelsOpacity}
            >
              Self-intact
            </text>
            <text
              x="50"
              y="111"
              fontSize="6.6"
              fontWeight="700"
              fill="black"
              textAnchor="middle"
              dominantBaseline="central"
              opacity={controlledAxisLabelsOpacity}
            >
              Self-dissolved
            </text>
          </g>
        </svg>
      )}

      <div
        className={cn(
          "grid h-full w-full min-h-0 grid-cols-2 grid-rows-2 gap-5 p-[50px]",
          mode === "placeholderHidden" ? "opacity-0" : "opacity-100"
        )}
        style={{ padding: 50 }}
      >
        {quadrantsInOrder.map((q) => {
          const { bg: themeBg, border: themeBorder } = QUADRANT_THEME[q]!
          const isHighlighted = quadrantHighlightSet.has(q)
          const sourceQ = matchRevealContentSource?.[q] ?? q
          const matchRevealCard = mode === "matchReveal" ? matchRevealCards?.[sourceQ] : undefined
          const isMatchRevealSelected = matchRevealSelection?.selected === q

          const isWireframe = mode === "wireframe"
          const isControlled = mode === "controlled"
          const quadState: QuadrantVisualState = quadrantStates?.[q] ?? "inactive"

          const defaultMatchRevealHighlight = cn("border-2 bg-white/10", themeBorder, themeBg)
          const matchRevealHighlightTile =
            matchRevealTilePalette === "plainWhite"
              ? cn(
                  "border-2 border-black bg-white",
                  isMatchRevealSelected && "ring-2 ring-blue-600 ring-offset-2"
                )
              : matchRevealTilePalette === "neutralGrey"
                ? matchRevealCategoryBorders
                  ? cn("border-2 bg-neutral-200", themeBorder)
                  : "border-2 border-neutral-500 bg-neutral-200"
                : defaultMatchRevealHighlight

          const baseTile = cn(
            "relative flex items-center justify-center rounded-2xl",
            isWireframe
              ? "border border-black/10 bg-transparent"
              : isControlled
                ? quadState === "invisible"
                  ? "border border-transparent bg-transparent"
                  : quadState === "inactive"
                    ? "border border-black/10 bg-black/5"
                    : quadState === "color"
                      ? cn("border", themeBorder, themeBg)
                      : cn("border-2", themeBorder, themeBg, "ring-1 ring-black/10")
                : mode === "matchReveal" && isHighlighted
                  ? matchRevealHighlightTile
                  : cn(
                      "border-2 bg-white/10",
                      themeBorder,
                      mode === "placeholderHidden" ? "bg-transparent" : mode === "matchReveal" ? "bg-transparent" : themeBg
                    )
          )

          const tileOpacity =
            mode === "wireframe"
              ? "opacity-100"
              : mode === "controlled"
                ? quadState === "invisible"
                  ? "opacity-0"
                  : "opacity-100"
                : mode === "matchReveal"
                  ? showQuadrantTiles && isHighlighted
                    ? "opacity-100"
                    : "opacity-0"
                  : isHighlighted
                    ? "opacity-100"
                    : "opacity-35"

          const isClickable = mode === "book"
          const isMatchRevealSelectable = mode === "matchReveal" && matchRevealSelection != null

          const tileClassName = cn(
            baseTile,
            tileOpacity,
            "transition-[opacity,box-shadow]",
            isClickable || isMatchRevealSelectable ? "cursor-pointer" : "cursor-default",
            mode === "matchReveal" && isHighlighted && "min-h-0 h-full max-h-full",
            isMatchRevealSelectable &&
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          )

          const gridStyle = { gridColumn: QUADRANT_LAYOUT[q]!.col + 1, gridRow: QUADRANT_LAYOUT[q]!.row + 1 }

          if (isMatchRevealSelectable) {
            return (
              <button
                key={q}
                type="button"
                className={cn(tileClassName, "h-full min-h-0 w-full p-0 font-inherit")}
                style={gridStyle}
                aria-pressed={isMatchRevealSelected}
                aria-label={`Outcome tile ${q}`}
                onClick={() => matchRevealSelection!.onSelect(q)}
              >
                {mode === "matchReveal" && isHighlighted && matchRevealCard ? (
                  "fullTile" in matchRevealCard ? (
                    <div className="flex max-h-full min-h-0 w-full max-w-full flex-col items-center justify-center overflow-auto p-3 text-center text-black">
                      {matchRevealCard.fullTile}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-center",
                        matchRevealTilePalette === "neutralGrey" ? "text-neutral-900" : "text-black"
                      )}
                    >
                      <div className="text-[4rem] leading-none" aria-hidden>
                        {matchRevealCard.icon}
                      </div>
                      <div
                        className={cn(
                          "font-medium leading-snug sm:text-[1.75rem]",
                          matchRevealTilePalette === "neutralGrey" ? "text-[1.5rem] text-neutral-900" : "text-[1.75rem] text-black"
                        )}
                      >
                        {matchRevealCard.label}
                      </div>
                    </div>
                  )
                ) : null}
              </button>
            )
          }

          return (
            <div
              key={q}
              className={tileClassName}
              style={gridStyle}
              role={isClickable ? "button" : undefined}
              aria-label={mode === "book" ? `${QUADRANT_LABELS[q]}` : undefined}
              onClick={isClickable ? () => onToggleFlip(q) : undefined}
            >
              {mode === "book" ? (
                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                  <div className={cn("text-sm font-bold leading-snug text-black", isHighlighted ? "opacity-100" : "opacity-90")}>
                    {flipped[q] ? bookCard(q).back : bookCard(q).front}
                  </div>
                </div>
              ) : mode === "matchReveal" && isHighlighted && matchRevealCard ? (
                "fullTile" in matchRevealCard ? (
                  <div className="flex max-h-full min-h-0 w-full max-w-full flex-col items-center justify-center overflow-auto p-3 text-center text-black">
                    {matchRevealCard.fullTile}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-center",
                      matchRevealTilePalette === "neutralGrey" ? "text-neutral-900" : "text-black"
                    )}
                  >
                    <div className="text-[4rem] leading-none" aria-hidden>
                      {matchRevealCard.icon}
                    </div>
                    <div
                      className={cn(
                        "font-medium leading-snug sm:text-[1.75rem]",
                        matchRevealTilePalette === "neutralGrey" ? "text-[1.5rem] text-neutral-900" : "text-[1.75rem] text-black"
                      )}
                    >
                      {matchRevealCard.label}
                    </div>
                  </div>
                )
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

