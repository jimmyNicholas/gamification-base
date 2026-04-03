"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type TwoColumnActivityStageLayoutProps = {
  /** Optional title/copy block rendered above the two-column stage. */
  topTitle?: ReactNode
  /**
   * Controls visual visibility of `topTitle` while keeping its wrapper mounted.
   * When `false`, the title area remains in the layout flow via `visibility: hidden`.
   */
  topTitleVisible?: boolean
  /**
   * When `true`, reserve vertical space for the title wrapper (even when hidden).
   * Defaults to `true` (title space is always reserved to avoid upward layout shift).
   * Set to `false` for pages that truly have no title area.
   */
  reserveTopTitleSpace?: boolean

  /** Left-hand column content (activity, copy, controls, etc.). */
  leftContent: ReactNode
  /** Right-hand column content, typically the quadrant/axes model. */
  rightContent: ReactNode

  /** Vertical alignment of the left column on `md+` breakpoints. */
  leftVerticalAlign?: "start" | "center"

  /** Optional overrides for the outer wrapper. */
  className?: string
  /** Optional overrides for the grid + internal padding container. */
  contentClassName?: string
  /** Optional overrides for the right-hand model frame wrapper. */
  rightFrameClassName?: string
}

/**
 * Shared two-column stage layout for recognition/reflection flows.
 *
 * - 1-column stack on mobile, 50/50 split on `md+`.
 * - Optional top title area that can be visually hidden while preserving layout height.
 * - Left column alignment toggle (`start` vs `center`) for different activity ergonomics.
 * - Right column wrapped in a shared "model frame" card.
 */
export function TwoColumnActivityStageLayout({
  topTitle,
  topTitleVisible = true,
  reserveTopTitleSpace,
  leftContent,
  rightContent,
  leftVerticalAlign = "center",
  className,
  contentClassName,
  rightFrameClassName,
}: TwoColumnActivityStageLayoutProps) {
  const shouldRenderTitleWrapper = reserveTopTitleSpace === false ? topTitle != null : true
  const shouldApplyLeftPaddingAndStretch = reserveTopTitleSpace === false && leftVerticalAlign === "start"

  return (
    <section className={cn("w-full", className)}>
      {shouldRenderTitleWrapper ? (
        <div
          className={cn(
            "mb-8 min-h-20 w-full max-w-3xl mx-auto text-left",
            // Preserve height when "hidden" without removing from layout flow.
            !topTitleVisible && "invisible"
          )}
        >
          {topTitle}
        </div>
      ) : null}

      {/* Content Area */}
      <div
        className={cn(
          "grid w-full gap-8 md:grid-cols-2",
          // Keep things comfortably readable on large screens; outer shells own max-width of the page.
          "items-stretch",
          contentClassName
        )}
      >
        {/* Left Column */}
        <div
          className={cn(
            "flex w-full justify-center",
            leftVerticalAlign === "center" ? "items-center" : "items-start"
          )}
        >
          {/* Only apply stretch + extra top/bottom padding when left-aligned. */}
          <div className={cn("w-full", shouldApplyLeftPaddingAndStretch && "h-full pt-5 pb-5")}>
            {leftContent}
          </div>
        </div>

        {/* Right Column */}  
        <div className="flex w-full items-stretch">
          <div
            className={cn(
              // Shared "model book" frame — softly elevated card with subtle border and tint.
              "relative w-full rounded-3xl",
              "p-4",
              "sm:p-5 md:p-6",
              rightFrameClassName
            )}
          >
            {rightContent}
          </div>
        </div>
      </div>
    </section>
  )
}

