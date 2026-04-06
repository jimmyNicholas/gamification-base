"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { QuadrantId } from "@/lib/storyboard-component-contracts"
import { QUADRANT_PLAY_CATEGORY_TILES } from "@/sections/demo/quadrants-axes/quadrants-axes-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuadrantCardState = "invisible" | "transparent" | "grey" | "black-white" | "activeColor" | "inactiveColor"
export type AxisState = "invisible" | "grey" | "color" | "black"
export type AxisIndex = 0 | 1 | 2 | 3 | 4

export type CardContent =
  | { icon: React.ReactNode; label: string }
  | { fullTile: React.ReactNode }
  | { icon: React.ReactNode; label: string; back: React.ReactNode }

export type AxisConfig = {
  /** Visual state of the axis line and label. Defaults to "color". */
  state?: AxisState
  /** Position along the axis, 0–4. Default 2 (centre). */
  index?: AxisIndex
  /** When true, renders notch markers and fires `onAxisIndexChange` on click. */
  clickable?: boolean
}

export type QuadrantAxesModelV2Props = {
  mode: "matchReveal" | "flipCard" | "axisDiagnostic" | "axesAssessment"
  className?: string

  // --- Cards ---
  /** Content rendered inside each quadrant tile. Falls back to the default icon + label. */
  cards?: Partial<Record<QuadrantId, CardContent>>
  /** Visual state per quadrant. Defaults to "activeColor" for all. */
  cardState?: Partial<Record<QuadrantId, QuadrantCardState>>
  /** Allow clicking a card to flip it to its back face (flipCard mode). */
  cardFlippable?: boolean
  /** Controlled flip state (flipCard mode). Combine with `onCardFlip`. */
  cardFlipped?: Partial<Record<QuadrantId, boolean>>
  /** Called when a card is clicked in flipCard mode. */
  onCardFlip?: (q: QuadrantId) => void
  /** Extra content rendered at the bottom of the front face (flipCard mode). */
  cardFrontExtra?: Partial<Record<QuadrantId, React.ReactNode>>
  /** Called when a card is clicked (matchReveal / general interaction). */
  onCardClick?: (q: QuadrantId) => void

  // --- Drag-and-drop (flipCard mode) ---
  /**
   * When set, clicking a card places this activity id (fires `onActivityDrop`).
   * Omit/null to flip on click instead.
   */
  selectedActivityId?: string | null
  /** Called when an activity is placed onto a quadrant (click or drag). */
  onActivityDrop?: (q: QuadrantId, activityId: string) => void

  // --- Axes ---
  horizontalAxis?: AxisConfig
  verticalAxis?: AxisConfig
  /** Called when the user clicks a clickable axis to set a new index. */
  onAxisIndexChange?: (axis: "horizontal" | "vertical", index: AxisIndex) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AXIS_MAX: AxisIndex = 4
const AXIS_CENTER: AxisIndex = 2

const QUADRANT_LAYOUT: Record<QuadrantId, { row: 0 | 1; col: 0 | 1 }> = {
  Q1: { row: 0, col: 0 },
  Q3: { row: 0, col: 1 },
  Q2: { row: 1, col: 0 },
  Q4: { row: 1, col: 1 },
}

/** Grid read order (top-left, top-right, bottom-left, bottom-right). */
const QUADRANT_ORDER: QuadrantId[] = ["Q1", "Q3", "Q2", "Q4"]

const QUADRANT_THEME: Record<QuadrantId, { activeBg: string; activeBorder: string; inactiveBg: string; inactiveBorder: string }> = {
  Q1: {
    activeBg: "bg-amber-50/90",
    activeBorder: "border-amber-500/70",
    inactiveBg: "bg-amber-50/60",
    inactiveBorder: "border-amber-500/40",
  },
  Q2: {
    activeBg: "bg-violet-50/90",
    activeBorder: "border-violet-500/70",
    inactiveBg: "bg-violet-50/60",
    inactiveBorder: "border-violet-500/40",
  },
  Q3: {
    activeBg: "bg-emerald-50/90",
    activeBorder: "border-emerald-500/70",
    inactiveBg: "bg-emerald-50/60",
    inactiveBorder: "border-emerald-500/40",
  },
  Q4: {
    activeBg: "bg-pink-50/90",
    activeBorder: "border-pink-500/70",
    inactiveBg: "bg-pink-50/60",
    inactiveBorder: "border-pink-500/40",
  },
}

const FLIP_CARD_SURFACE: Record<QuadrantId, string> = {
  Q1: "rounded-2xl border border-amber-400/90 bg-[#fffbeb] shadow-[0_1px_0_rgba(0,0,0,0.04)]",
  Q2: "rounded-2xl border border-violet-400/75 bg-violet-50/95 shadow-[0_1px_0_rgba(0,0,0,0.04)]",
  Q3: "rounded-2xl border border-teal-500/60 bg-emerald-50/95 shadow-[0_1px_0_rgba(0,0,0,0.04)]",
  Q4: "rounded-2xl border border-rose-400/80 bg-pink-50/95 shadow-[0_1px_0_rgba(0,0,0,0.04)]",
}

const AXIS_COLOR: Record<"horizontal" | "vertical", { color: string; grey: string; markerFill: string; black: string }> = {
  horizontal: { color: "#5b2dd6", grey: "#9ca3af", markerFill: "#5b2dd6", black: "#000000" },
  vertical: { color: "#7b4a12", grey: "#9ca3af", markerFill: "#7b4a12", black: "#000000" },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clampAxisIndex(v: number | undefined): AxisIndex {
  if (v == null || !Number.isFinite(v)) return AXIS_CENTER
  const r = Math.round(v)
  if (r <= 0) return 0
  if (r >= AXIS_MAX) return AXIS_MAX
  return r as AxisIndex
}

function snapFromRatio(ratio: number): AxisIndex {
  return clampAxisIndex(Math.round(Math.max(0, Math.min(1, ratio)) * AXIS_MAX))
}

function resolveAxisStroke(state: AxisState, axis: "horizontal" | "vertical"): string {
  if (state === "grey") return AXIS_COLOR[axis].grey
  if (state === "black") return AXIS_COLOR[axis].black
  return AXIS_COLOR[axis].color
}

function resolveAxisOpacity(state: AxisState): number {
  if (state === "invisible") return 0
  if (state === "black") return 0.85
  return 1
}

/** For axisDiagnostic: infer which pair of quadrants to highlight from the active axis + index. */
function inferHighlightedQuadrants(
  focusAxis: "horizontal" | "vertical" | "both",
  hIndex: AxisIndex,
  vIndex: AxisIndex
): Set<QuadrantId> {
  if (focusAxis === "both") {
    const h = hIndex < AXIS_CENTER ? "left" : hIndex > AXIS_CENTER ? "right" : null
    const v = vIndex < AXIS_CENTER ? "top" : vIndex > AXIS_CENTER ? "bottom" : null
    if (!h || !v) return new Set()
    const q =
      h === "left" && v === "top" ? "Q1"
      : h === "left" && v === "bottom" ? "Q2"
      : h === "right" && v === "top" ? "Q3"
      : "Q4"
    return new Set([q])
  }
  if (focusAxis === "horizontal") {
    if (hIndex === AXIS_CENTER) return new Set()
    return hIndex < AXIS_CENTER ? new Set(["Q1", "Q2"]) : new Set(["Q3", "Q4"])
  }
  // vertical
  if (vIndex === AXIS_CENTER) return new Set()
  return vIndex < AXIS_CENTER ? new Set(["Q1", "Q3"]) : new Set(["Q2", "Q4"])
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuadrantAxesModelV2({
  mode,
  className,
  cards,
  cardState,
  cardFlippable = true,
  cardFlipped: cardFlippedControlled,
  onCardFlip,
  cardFrontExtra,
  onCardClick,
  selectedActivityId = null,
  onActivityDrop,
  horizontalAxis,
  verticalAxis,
  onAxisIndexChange,
}: QuadrantAxesModelV2Props) {
  // --- Axis config resolution ---
  const hState: AxisState = horizontalAxis?.state ?? "invisible"
  const vState: AxisState = verticalAxis?.state ?? "invisible"
  const hIndex = clampAxisIndex(horizontalAxis?.index)
  const vIndex = clampAxisIndex(verticalAxis?.index)
  const hClickable = horizontalAxis?.clickable ?? false
  const vClickable = verticalAxis?.clickable ?? false

  // --- Internal flip state (uncontrolled) ---
  const [internalFlipped, setInternalFlipped] = React.useState<Partial<Record<QuadrantId, boolean>>>({})
  const flipped = cardFlippedControlled ?? internalFlipped

  const handleFlip = React.useCallback(
    (q: QuadrantId) => {
      if (onCardFlip) {
        onCardFlip(q)
      } else {
        setInternalFlipped((prev) => ({ ...prev, [q]: !prev[q] }))
      }
    },
    [onCardFlip]
  )

  // Reset internal flip when leaving flipCard mode
  React.useEffect(() => {
    if (mode !== "flipCard") setInternalFlipped({})
  }, [mode])

  // --- Axis click handlers ---
  const handleAxisClick = React.useCallback(
    (axis: "horizontal" | "vertical", event: React.MouseEvent<HTMLButtonElement>) => {
      if (!onAxisIndexChange) return
      const rect = event.currentTarget.getBoundingClientRect()
      const ratio =
        axis === "horizontal"
          ? (event.clientX - rect.left) / rect.width
          : (event.clientY - rect.top) / rect.height
      onAxisIndexChange(axis, snapFromRatio(ratio))
    },
    [onAxisIndexChange]
  )

  // --- Quadrant highlight set (axisDiagnostic / axesAssessment) ---
  const highlightedQuadrants: Set<QuadrantId> = React.useMemo(() => {
    if (mode === "axisDiagnostic") {
      const focusAxis = hClickable && vClickable ? "both" : hClickable ? "horizontal" : "vertical"
      return inferHighlightedQuadrants(focusAxis, hIndex, vIndex)
    }
    if (mode === "axesAssessment") {
      return inferHighlightedQuadrants("both", hIndex, vIndex)
    }
    return new Set()
  }, [mode, hClickable, vClickable, hIndex, vIndex])

  // --- Layout ---
  const isFlipCard = mode === "flipCard"
  const isAxisMode = mode === "axisDiagnostic" || mode === "axesAssessment"

  const gridPadding = { padding: 0 } //isFlipCard ? undefined : { padding: 50 }
  const gridClassName = cn(
    "grid h-full w-full min-h-0 grid-cols-2 grid-rows-2",
    isFlipCard ? "gap-4 p-3 sm:gap-5 sm:p-4" : "gap-5"
  )

  return (
    <div
      className={cn("relative w-full max-w-[620px] p-8", className)}
      style={{ aspectRatio: "1 / 1" }}
      aria-label="Quadrants and axes model"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Axes SVG                                                            */}
      {/* ------------------------------------------------------------------ */}
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="-14 -14 128 128"
        preserveAspectRatio="none"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        {/* Horizontal axis */}
        <g opacity={resolveAxisOpacity(hState)}>
          <line
            x1="-2" y1="50" x2="102" y2="50"
            stroke={resolveAxisStroke(hState, "horizontal")}
            strokeWidth={3.2}
          />
          {hClickable && hState !== "invisible"
            ? ([0, 1, 2, 3, 4] as AxisIndex[]).map((idx) => {
                const isSelected = idx === hIndex
                const isCenter = idx === AXIS_CENTER
                return (
                  <circle
                    key={idx}
                    cx={-2 + (104 * idx) / AXIS_MAX}
                    cy="50"
                    r={isSelected ? 4.2 : 3.2}
                    fill={AXIS_COLOR.horizontal.markerFill}
                    opacity={isSelected ? (isCenter ? 0.6 : 1) : 0.35}
                    stroke={isSelected ? "white" : undefined}
                    strokeWidth={isSelected ? 1.2 : 0}
                  />
                )
              })
            : null}
          {hState !== "invisible" && (
            <>
              <text x="-11" y="50" fontSize="6.6" fontWeight="700" fill={resolveAxisStroke(hState, "horizontal")} textAnchor="end" dominantBaseline="middle">Agency</text>
              <text x="111" y="50" fontSize="6.6" fontWeight="700" fill={resolveAxisStroke(hState, "horizontal")} textAnchor="start" dominantBaseline="middle">Fate</text>
            </>
          )}
        </g>

        {/* Vertical axis */}
        <g opacity={resolveAxisOpacity(vState)}>
          <line
            x1="50" y1="-2" x2="50" y2="102"
            stroke={resolveAxisStroke(vState, "vertical")}
            strokeWidth={3.2}
          />
          {vClickable && vState !== "invisible"
            ? ([0, 1, 2, 3, 4] as AxisIndex[]).map((idx) => {
                const isSelected = idx === vIndex
                const isCenter = idx === AXIS_CENTER
                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy={-2 + (104 * idx) / AXIS_MAX}
                    r={isSelected ? 4.2 : 3.2}
                    fill={AXIS_COLOR.vertical.markerFill}
                    opacity={isSelected ? (isCenter ? 0.6 : 1) : 0.35}
                    stroke={isSelected ? "white" : undefined}
                    strokeWidth={isSelected ? 1.2 : 0}
                  />
                )
              })
            : null}
          {vState !== "invisible" && (
            <>
              <text x="50" y="-11" fontSize="6.6" fontWeight="700" fill={resolveAxisStroke(vState, "vertical")} textAnchor="middle" dominantBaseline="central">Self-intact</text>
              <text x="50" y="111" fontSize="6.6" fontWeight="700" fill={resolveAxisStroke(vState, "vertical")} textAnchor="middle" dominantBaseline="central">Self-dissolved</text>
            </>
          )}
        </g>
      </svg>

      {/* ------------------------------------------------------------------ */}
      {/* Clickable axis hit areas                                            */}
      {/* ------------------------------------------------------------------ */}
      {hClickable && onAxisIndexChange && (
        <button
          type="button"
          className="absolute left-0 right-0 top-1/2 z-30 -translate-y-1/2 rounded-md py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Set horizontal axis position"
          onClick={(e) => handleAxisClick("horizontal", e)}
        />
      )}
      {vClickable && onAxisIndexChange && (
        <button
          type="button"
          className="absolute top-0 bottom-0 left-1/2 z-30 -translate-x-1/2 rounded-md px-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Set vertical axis position"
          onClick={(e) => handleAxisClick("vertical", e)}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Quadrant grid                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className={gridClassName} style={gridPadding}>
        {QUADRANT_ORDER.map((q) => {
          const theme = QUADRANT_THEME[q]
          const state: QuadrantCardState = cardState?.[q] ?? "activeColor"
          const isHighlighted = highlightedQuadrants.has(q)
          const content = cards?.[q]
          const isFlipped = flipped[q] ?? false
          const dropActive = isFlipCard && onActivityDrop != null
          const isClickable =
            (isFlipCard && (cardFlippable || (dropActive && selectedActivityId != null))) ||
            onCardClick != null

          // --- Tile chrome ---
          const tileBase = cn(
            "relative flex items-center justify-center rounded-2xl transition-[opacity,box-shadow]",
            isFlipCard
              ? FLIP_CARD_SURFACE[q]
              : state === "transparent"
                ? "border-2 border-transparent bg-transparent"
                : state === "grey"
                  ? "border-2 border-neutral-400 bg-neutral-200"
                  : state === "black-white"
                    ? "border-2 border-black bg-white"
                    : state === "inactiveColor"
                      ? cn("border-2", theme.inactiveBorder, theme.inactiveBg)
                      : cn("border-2", theme.activeBorder, theme.activeBg)
          )

          const tileOpacity =
            isFlipCard
              ? "opacity-100"
              : isAxisMode
                ? isHighlighted ? "opacity-100" : "opacity-35"
                : state === "invisible"
                  ? "opacity-0"
                  : "opacity-100"

          const tileClassName = cn(
            tileBase,
            tileOpacity,
            isFlipCard ? "min-h-0 h-full max-h-full" : undefined,
            isClickable ? "cursor-pointer" : "cursor-default",
            dropActive && selectedActivityId
              ? "ring-2 ring-blue-600 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              : undefined
          )

          const gridStyle = {
            gridColumn: QUADRANT_LAYOUT[q].col + 1,
            gridRow: QUADRANT_LAYOUT[q].row + 1,
          }

          const handleClick = () => {
            if (dropActive && selectedActivityId) {
              onActivityDrop!(q, selectedActivityId)
              return
            }
            if (isFlipCard && cardFlippable) {
              handleFlip(q)
              return
            }
            onCardClick?.(q)
          }

          const defaultContent = (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-3 py-5 text-center">
              <span className="text-[3.25rem] leading-none sm:text-[4rem]" aria-hidden>
                {QUADRANT_PLAY_CATEGORY_TILES[q].icon}
              </span>
              <span className="font-serif text-[1.35rem] font-medium lowercase leading-snug text-black sm:text-[1.65rem]">
                {QUADRANT_PLAY_CATEGORY_TILES[q].label}
              </span>
              {cardFrontExtra?.[q] && (
                <div className="mt-2 w-full max-w-[95%] border-t border-black/15 pt-2 text-left text-[0.7rem] leading-snug text-black/85 sm:text-xs">
                  {cardFrontExtra[q]}
                </div>
              )}
            </div>
          )

          const resolvedContent = content
            ? "fullTile" in content
              ? <div className="flex max-h-full min-h-0 w-full max-w-full flex-col items-center justify-center overflow-auto p-3 text-center text-black">{content.fullTile}</div>
              : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-center text-black">
                  <div className="text-[4rem] leading-none" aria-hidden>{content.icon}</div>
                  <div className="text-[1.75rem] font-medium leading-snug">{content.label}</div>
                  {cardFrontExtra?.[q] && (
                <div >
                  {cardFrontExtra[q]}
                </div>
              )}
                </div>
              )
            : defaultContent

          const flipCardBack = isFlipCard && isFlipped
            ? <div className="flex h-full min-h-0 w-full flex-col justify-center overflow-auto p-3 text-left text-xs leading-relaxed text-black/90 sm:p-4 sm:text-sm">
                {content && "back" in content ? content.back : null}
              </div>
            : null

          // Number badge for flip cards (1=Q1, 3=Q2, 2=Q3, 4=Q4)
          const numberBadge = isFlipCard ? (
            <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-gray-500/80 text-sm font-semibold text-white">
              {q === "Q1" ? "1" : q === "Q3" ? "2" : q === "Q2" ? "3" : "4"}
            </span>
          ) : null

          return (
            <div
              key={q}
              className={tileClassName}
              style={{ ...gridStyle}}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={`Quadrant ${q}`}
              onClick={isClickable ? handleClick : undefined}
              onKeyDown={
                isClickable
                  ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick() } }
                  : undefined
              }
              onDragOver={dropActive ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move" } : undefined}
              onDrop={
                dropActive
                  ? (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const id = e.dataTransfer.getData("text/plain").trim()
                      if (id) onActivityDrop!(q, id)
                    }
                  : undefined
              }
            >
              {numberBadge}
              {isFlipCard && isFlipped ? flipCardBack : resolvedContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}