"use client"

import * as React from "react"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import { QUADRANT_BOOK_CARDS } from "@/sections/demo/quadrants-axes/quadrants-axes-data"

export type QuadrantsBookPageProps = {
  onContinue?: () => void
}

export function QuadrantsBookPage({ onContinue }: QuadrantsBookPageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE} dataActivity="quadrants-book">
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-left">
          <h2 className={demoActivityHeadingClassName}>Quadrants Book</h2>
          <p className={demoActivityInstructionClassName}>
            Use the flip cards to learn what each quadrant means.
          </p>
          <div className="mt-4">
            {onContinue ? (
              <button
                type="button"
                className={`${demoPrimaryCtaConstrainedClassName} ${demoPrimaryCtaNativeFocusClassName} max-w-lg`}
                onClick={() => onContinue()}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white/30 p-6">
          <QuadrantAxesModel mode="book" bookCards={QUADRANT_BOOK_CARDS} />
        </div>
      </div>
    </DemoStyleLayout>
  )
}

