"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AxisIndex = 0 | 1 | 2 | 3 | 4

export const AXIS_CENTER: AxisIndex = 2

type DiscreteAxisSliderProps = {
  axis: "horizontal" | "vertical"
  valueIndex: AxisIndex
  onChange: (next: AxisIndex) => void
  className?: string
  disabled?: boolean
}

function stepAriaLabel(axis: DiscreteAxisSliderProps["axis"], idx: AxisIndex) {
  if (idx === AXIS_CENTER) return "Center (neutral)"
  if (axis === "horizontal") return idx <= 1 ? "Agency side" : "Fate side"
  return idx <= 1 ? "Self-intact side" : "Self-dissolved side"
}

export function DiscreteAxisSlider({
  axis,
  valueIndex,
  onChange,
  className,
  disabled,
}: DiscreteAxisSliderProps) {
  const steps: AxisIndex[] = [0, 1, 2, 3, 4]

  return (
    <div className={cn(axis === "horizontal" ? "flex items-center gap-2" : "flex flex-col items-center gap-2", className)}>
      {steps.map((idx) => {
        const isActive = idx === valueIndex
        const isCenter = idx === AXIS_CENTER
        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            aria-label={stepAriaLabel(axis, idx)}
            aria-pressed={isActive}
            className={cn(
              axis === "horizontal" ? "size-8" : "size-7",
              "rounded-full border border-black/15 bg-white/50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
              isActive ? "bg-blue-600/15 border-blue-600/50" : "hover:bg-white/75",
              isCenter ? "opacity-60" : "opacity-100",
              disabled ? "cursor-not-allowed opacity-50 hover:bg-white/50" : "cursor-pointer"
            )}
            onClick={() => onChange(idx)}
          >
            <span className="sr-only">{idx}</span>
          </button>
        )
      })}
    </div>
  )
}

