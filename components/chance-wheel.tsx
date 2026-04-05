"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Quadrant labels match the 2×2 grid: 1 NW, 2 NE, 3 SW, 4 SE (screen coords, SVG y-down). */
export type ChanceQuadrant = 1 | 2 | 3 | 4

const QUADRANT_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04"] as const

/** Wedge index order matches SVG paths: NW, NE, SE, SW → labels 1, 2, 4, 3. */
const QUADRANT_TO_WEDGE: Record<ChanceQuadrant, 0 | 1 | 2 | 3> = {
  1: 0,
  2: 1,
  3: 3,
  4: 2,
}

export function getQuadrantColor(q: ChanceQuadrant): string {
  return QUADRANT_COLORS[QUADRANT_TO_WEDGE[q]] ?? "#2563eb"
}

/** Rotation (deg) mod 360 so the center of quadrant `q` sits under the top pointer. */
function targetRotationMod360(q: ChanceQuadrant): number {
  switch (q) {
    case 1:
      return 45
    case 2:
      return 315
    case 3:
      return 135
    case 4:
      return 225
    default:
      return 0
  }
}

function pickQuadrant(): ChanceQuadrant {
  return (Math.floor(Math.random() * 4) + 1) as ChanceQuadrant
}

function ChanceWheelSvg({ labelType = "letters" }: { labelType?: "none" | "numbers" | "letters" }) {
  return (
    <svg viewBox="-1 -1 2 2" className="size-full overflow-visible rounded-full" aria-hidden>
      {(
        [
          [1, 0],
          [2, 1],
          [4, 2],
          [3, 3],
        ] as const
      ).map(([label, colorIdx]) => {
        const i = colorIdx
        const startDeg = 180 + i * 90
        const endDeg = startDeg + 90
        const sr = (Math.PI / 180) * startDeg
        const er = (Math.PI / 180) * endDeg
        const x1 = Math.cos(sr)
        const y1 = Math.sin(sr)
        const x2 = Math.cos(er)
        const y2 = Math.sin(er)
        const large = 0
        const color = QUADRANT_COLORS[i] ?? "#333"
        return (
          <path
            key={`w-${label}`}
            d={`M 0 0 L ${x1} ${y1} A 1 1 0 ${large} 1 ${x2} ${y2} Z`}
            fill={color}
            stroke="#0f172a"
            strokeWidth={0.02}
          />
        )
      })}
      {labelType !== "none"
        ? (
            [
              [1, 0],
              [2, 1],
              [4, 2],
              [3, 3],
            ] as const
          ).map(([numLabel, colorIdx]) => {
            const i = colorIdx
            const letterLabels = ["A", "B", "C", "D"] as const
            const displayLabel = labelType === "numbers" ? numLabel : letterLabels[i]
            const mid = (180 + i * 90 + 45) * (Math.PI / 180)
            const tx = Math.cos(mid) * 0.55
            const ty = Math.sin(mid) * 0.55
            return (
              <text
                key={`t-${displayLabel}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-bold"
                style={{ fontSize: 0.28 }}
              >
                {displayLabel}
              </text>
            )
          })
        : null}
    </svg>
  )
}

/** Non-interactive wheel for thumbnails (e.g. Match the Four summary card). */
export function ChanceWheelPreview({
  rotationDeg = 0,
  className,
  labelType = "letters",
}: {
  rotationDeg?: number
  className?: string
  labelType?: "none" | "numbers" | "letters"
}) {
  return (
    <div className={cn("relative aspect-square w-full max-w-full", className)} aria-hidden>
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-0.5 border-x-[5px] border-b-[9px] border-x-transparent border-b-black/80"
        aria-hidden
      />
      <div
        className="relative size-full rounded-full border-2 border-black shadow-sm"
        style={{ transform: `rotate(${rotationDeg}deg)` }}
      >
        <ChanceWheelSvg labelType={labelType} />
      </div>
    </div>
  )
}

function playTickSound() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.value = 620
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  } catch {
    /* ignore */
  }
}

type ChanceWheelProps = {
  disabled: boolean
  /** Called after animation ends with the resolved quadrant (random, fair). */
  onComplete: (quadrant: ChanceQuadrant) => void
  className?: string
  ariaLabel?: string
  /** Label type to show on the wheel: "none", "numbers" (1-4), or "letters" (A-D). */
  labelType?: "none" | "numbers" | "letters"
}

export function ChanceWheel({
  disabled,
  onComplete,
  className,
  ariaLabel = "Spin the wheel",
  labelType = "letters",
}: ChanceWheelProps) {
  const [rotation, setRotation] = React.useState(0)
  const [spinning, setSpinning] = React.useState(false)
  const rotationRef = React.useRef(0)
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  React.useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  const startSpin = React.useCallback(() => {
    if (disabled || spinning) return
    const outcome = pickQuadrant()
    const current = rotationRef.current
    const currentNorm = ((current % 360) + 360) % 360
    const targetNorm = targetRotationMod360(outcome)
    const minFullTurns = 720
    const extraTurns = minFullTurns + 360 * Math.floor(2 + Math.random() * 2)
    let delta = (targetNorm - currentNorm + 360) % 360
    if (delta === 0) delta = 360
    const finalRotation = current + extraTurns + delta

    setSpinning(true)
    tickRef.current = setInterval(() => playTickSound(), 120)

    const durationMs = 2800 + Math.random() * 400
    const start = performance.now()
    const startAngle = current

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = easeOutCubic(t)
      const angle = startAngle + (finalRotation - startAngle) * eased
      setRotation(angle)
      rotationRef.current = angle
      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        if (tickRef.current) {
          clearInterval(tickRef.current)
          tickRef.current = null
        }
        const snapped = finalRotation
        setRotation(snapped)
        rotationRef.current = snapped
        setSpinning(false)
        onComplete(outcome)
      }
    }
    requestAnimationFrame(frame)
  }, [disabled, spinning, onComplete])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        startSpin()
      }
    },
    [startSpin]
  )

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center gap-2",
        className
      )}
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <div className="relative aspect-square h-full max-h-full w-auto max-w-full min-h-0 min-w-[11rem]">
          {/* Pointer at top */}
          <div
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 border-x-[7px] border-b-[12px] border-x-transparent border-b-black/80"
            aria-hidden
          />
          <button
            type="button"
            disabled={disabled || spinning}
            onClick={startSpin}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
            className={cn(
              "relative size-full rounded-full border-2 border-black shadow-sm outline-none transition-opacity",
              "disabled:pointer-events-none disabled:opacity-50",
              "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
              !disabled && !spinning && "cursor-pointer hover:opacity-95 active:scale-[0.99]"
            )}
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <ChanceWheelSvg labelType={labelType} />
          </button>
        </div>
      </div>
      {spinning ? (
        <p className="shrink-0 text-xs text-black/60">Spinning…</p>
      ) : (<p className="shrink-0 text-xs text-black/60">Not spinning…</p>)}
    </div>
  )
}
