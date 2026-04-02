"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Navy geometric repeat inspired by classic card backs — no pips or rank/suit. */
export function ChanceCardBack({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const patId = `card-back-${uid}`

  return (
    <div className={cn("relative overflow-hidden rounded-md border-2 border-black bg-[#152a45]", className)}>
      <svg className="absolute inset-0 size-full" aria-hidden focusable="false">
        <defs>
          <pattern id={patId} width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#1a365d" />
            {/* Diamond lattice */}
            <path
              d="M8 0 L16 8 L8 16 L0 8 Z"
              fill="none"
              stroke="#3b5b8a"
              strokeWidth="0.35"
              opacity={0.55}
            />
            <path
              d="M8 0 L16 8 L8 16 L0 8 Z"
              fill="none"
              stroke="#5a7dae"
              strokeWidth="0.25"
              opacity={0.25}
              transform="translate(8,8)"
            />
            <circle cx="8" cy="8" r="1.1" fill="#7dd3fc" opacity={0.12} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patId})`} />
        {/* Inner frame */}
        <rect
          x="8%"
          y="10%"
          width="84%"
          height="80%"
          rx="2"
          fill="none"
          stroke="#4a6fa5"
          strokeWidth="0.5"
          opacity={0.35}
        />
      </svg>
    </div>
  )
}
