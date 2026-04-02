"use client"

import * as React from "react"

import { type ChanceQuadrant, getQuadrantColor } from "@/components/chance-wheel"
import { cn } from "@/lib/utils"

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return { r: parseInt(m[1]!, 16), g: parseInt(m[2]!, 16), b: parseInt(m[3]!, 16) }
}

function mixRgb(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  }
}

function toHex(c: { r: number; g: number; b: number }) {
  return `#${[c.r, c.g, c.b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
}

/** Diamond lattice card surface matching quadrant wheel colors ([`ChanceCardBack`](chance-card-back.tsx) structure). */
export function ChanceQuadrantPattern({ quadrant, className }: { quadrant: ChanceQuadrant; className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const patId = `card-q-${quadrant}-${uid}`
  const base = getQuadrantColor(quadrant)
  const rgb = parseHex(base) ?? { r: 37, g: 99, b: 235 }
  const cell = toHex(mixRgb(rgb, { r: 0, g: 0, b: 0 }, 0.18))
  const strokeOuter = toHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.42))
  const strokeInner = toHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.22))
  const frame = toHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.28))
  const dot = toHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.55))

  return (
    <div className={cn("relative overflow-hidden rounded-md border-2 border-black/80", className)} style={{ backgroundColor: base }}>
      <svg className="absolute inset-0 size-full" aria-hidden focusable="false">
        <defs>
          <pattern id={patId} width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill={cell} />
            <path
              d="M8 0 L16 8 L8 16 L0 8 Z"
              fill="none"
              stroke={strokeOuter}
              strokeWidth="0.35"
              opacity={0.65}
            />
            <path
              d="M8 0 L16 8 L8 16 L0 8 Z"
              fill="none"
              stroke={strokeInner}
              strokeWidth="0.25"
              opacity={0.45}
              transform="translate(8,8)"
            />
            <circle cx="8" cy="8" r="1.1" fill={dot} opacity={0.2} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
        <rect
          x="8%"
          y="10%"
          width="84%"
          height="80%"
          rx="2"
          fill="none"
          stroke={frame}
          strokeWidth="0.5"
          opacity={0.45}
        />
      </svg>
    </div>
  )
}
