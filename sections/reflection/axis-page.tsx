"use client"

import * as React from "react"

import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import { QUADRANT_BOOK_CARDS } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { cn } from "@/lib/utils"

const REFLECTION_AXIS_SURFACE = "#dbeafe"

export type AxisPageProps = {
  onContinue?: () => void
}

export function AxisPage({ onContinue }: AxisPageProps) {
  return (
    <div
      className="min-h-screen w-full text-black"
      style={{ backgroundColor: REFLECTION_AXIS_SURFACE }}
      data-activity="axis-page"
    >
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[50%_50%]">
        <div className="flex min-h-[min(40vh,320px)] flex-col justify-center gap-6 px-6 py-10 sm:px-10 md:min-h-0">
          <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">Heading placeholder</h2>
          {onContinue ? (
            <div>
              <button
                type="button"
                className={cn(
                  demoPrimaryCtaConstrainedClassName,
                  demoPrimaryCtaNativeFocusClassName,
                  "max-w-lg"
                )}
                onClick={() => onContinue()}
              >
                Continue
              </button>
            </div>
          ) : null}
        </div>
        <div className="flex min-h-0 min-w-0 items-center justify-center px-6 py-10 sm:px-8 md:py-10">
          <div className="flex w-full max-w-[620px] flex-col items-center justify-center rounded-2xl border border-black/10 bg-white/50 p-4 shadow-sm sm:p-6">
            <QuadrantAxesModel mode="book" bookCards={QUADRANT_BOOK_CARDS} />
          </div>
        </div>
      </div>
    </div>
  )
}
