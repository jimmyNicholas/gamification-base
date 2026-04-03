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
   * When `true`, always reserve vertical space for the title wrapper (even when hidden).
   * Defaults to `true` when `topTitle` is provided.
   * Set to `false` for pages that never show a title area.
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
  leftVerticalAlign = "start",
  className,
  contentClassName,
  rightFrameClassName,
}: TwoColumnActivityStageLayoutProps) {
  const shouldReserveTitleSpace = reserveTopTitleSpace ?? Boolean(topTitle)
  const shouldRenderTitleWrapper = shouldReserveTitleSpace || topTitle != null

  return (
    <section className={cn("w-full", className)}>
      {shouldRenderTitleWrapper ? (
        <div
          className={cn(
            "mb-8 w-full max-w-3xl text-left",
            // Preserve height when "hidden" without removing from layout flow.
            !topTitleVisible && "invisible"
          )}
        >
          {topTitle}
        </div>
      ) : null}

      <div
        className={cn(
          "grid w-full gap-8 md:grid-cols-2",
          // Keep things comfortably readable on large screens; outer shells own max-width of the page.
          "items-stretch",
          contentClassName
        )}
      >
        <div
          className={cn(
            "flex w-full",
            leftVerticalAlign === "center" ? "items-center" : "items-start"
          )}
        >
          <div className="w-full">{leftContent}</div>
        </div>

        <div className="flex w-full items-stretch">
          <div
            className={cn(
              // Shared "model book" frame — softly elevated card with subtle border and tint.
              "relative w-full rounded-3xl border border-black/10 bg-white/70",
              "p-4 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-sm",
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

