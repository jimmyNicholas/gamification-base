"use client"

import { RecogLayout } from "@/sections/recog/recog-layout"
import {
  demoPrimaryCtaNarrowClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { cn } from "@/lib/utils"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

export type RecognitionCategoriesPageProps = {
  onContinue?: () => void
}

/** Caillois context + TikTok embed after Match the Four. */
export function RecognitionCategoriesPage({ onContinue }: RecognitionCategoriesPageProps) {
  // Enable Enter/Spacebar to continue
  useKeyboardNavigation({
    onSubmit: onContinue,
  })

  return (
    <RecogLayout dataActivity="recognition-categories">
      <div className="flex w-full min-w-0 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto grid h-full min-h-[min(500px,70vh)] min-w-0 w-full max-w-6xl grid-cols-1 gap-6 text-black sm:gap-8 lg:min-h-0 lg:grid-cols-2 lg:items-stretch lg:gap-6 xl:gap-8">
          <div className="flex min-w-0 flex-col items-start justify-center gap-8 self-start lg:self-stretch px-2 sm:px-4 lg:px-8">
            <h3 className="text-left text-lg font-bold leading-snug sm:text-xl">The Four Categories of Play.</h3>
            <p className="text-left text-sm leading-relaxed text-black/80 sm:text-base">
              A French sociologist named Roger Caillois identified them in his book &apos;Man, Play and Games&apos;. You will explore each one properly in the next section. For now, you have already felt them as your student does. Take these feelings with you into the next sections.
            </p>
            <p className="text-left text-sm leading-relaxed text-black/80 sm:text-base">
              Caillois called them agon, alea, mimicry, and ilinx. You do not need to remember those words because Competition, Chance, Roleplay, and Chaos will do just fine.
            </p>
            {onContinue ? (
              <div className="flex w-full max-w-lg flex-col items-center gap-5 self-center px-2 text-center">
                <button
                  type="button"
                  className={cn(
                    demoPrimaryCtaNarrowClassName,
                    demoPrimaryCtaNativeFocusClassName,
                    "max-w-full"
                  )}
                  onClick={() => onContinue()}
                >
                  Continue
                </button>
              </div>
            ) : null}
          </div>
          <div className="relative h-full min-h-[min(500px,70vh)] w-full min-w-0 overflow-hidden rounded-xl border border-black/15 bg-black/4 lg:min-h-0">
            <iframe
              title="TikTok video"
              className="h-full min-h-[500px] w-full border-0 lg:min-h-0"
              src="https://www.tiktok.com/embed/v2/6954424802610269446"
              allow="fullscreen"
            />
          </div>
        </div>
      </div>
    </RecogLayout>
  )
}
