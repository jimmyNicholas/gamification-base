"use client"

import { cn } from "@/lib/utils"
import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoActivityInstructionClassName,
  demoPrimaryCtaNarrowClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"

import { VIDEO_GROUNDING_EMBED_URL } from "./video-grounding-constants"

export type VideoGroundingPageProps = {
  onContinue?: () => void
}

/** §2.7 — Video Grounding (after Match the Four). */
export function VideoGroundingPage({ onContinue }: VideoGroundingPageProps) {
  const videoTitle = "Understanding the Psychology of Fun: The 4 Types of Play"

  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE}>
      <div className="flex w-full flex-col gap-8 sm:gap-10">
        <div className="flex w-full flex-col gap-8 lg:grid lg:grid-cols-[6fr_4fr] lg:items-start lg:gap-10 xl:gap-14">
          <div className="flex min-w-0 flex-col gap-3 text-left">
            <h2 className={cn(demoActivityHeadingClassName, "text-left")}>Four categories of play.</h2>
            <p className={cn(demoActivityInstructionClassName, "text-left")}>
              A French sociologist named Roger Caillois identified them in his book &apos;Man, Play and Games&apos;. You
              will explore each one properly in the next section. For now, you have already felt them as your student
              does. Take these feelings with you into the next sections.
            </p>
            <p className={cn(demoActivityInstructionClassName, "text-left")}>
              Caillois called them agon, alea, mimicry, and ilinx. You do not need to remember those words because
              Competition, Chance, Roleplay, and Chaos will do just fine.
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-[min(100%,340px)] flex-col gap-3 lg:mx-0 lg:max-w-none">
            <h3 className="text-center text-base font-semibold text-black sm:text-lg lg:text-right">{videoTitle}</h3>
            <div className="relative aspect-9/16 w-full overflow-hidden rounded-xl border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <iframe
                title={videoTitle}
                src={VIDEO_GROUNDING_EMBED_URL}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {onContinue ? (
          <div className="flex w-full justify-center px-2">
            <button
              type="button"
              className={cn(demoPrimaryCtaNarrowClassName, demoPrimaryCtaNativeFocusClassName, "max-w-lg")}
              onClick={() => onContinue()}
            >
              Continue
            </button>
          </div>
        ) : null}
      </div>
    </DemoStyleLayout>
  )
}
