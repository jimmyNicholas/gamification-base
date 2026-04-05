"use client"

import { useCallback, useState } from "react"

import { RecogLayout } from "@/sections/recog/recog-layout"
import {
  demoPrimaryCtaNarrowClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { cn } from "@/lib/utils"

export type RecognitionReflectionPageProps = {
  onContinue?: () => void
  onReflectionUsed?: () => void
}

/** Optional mini-reflection after Four Categories; before post-recognition flipcards. */
export function RecognitionReflectionPage({ onContinue, onReflectionUsed }: RecognitionReflectionPageProps) {
  const [reflectionText, setReflectionText] = useState("")
  const [reflectionTracked, setReflectionTracked] = useState(false)

  const handleReflectionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value
      setReflectionText(text)
      if (!reflectionTracked && text.trim().length > 0) {
        onReflectionUsed?.()
        setReflectionTracked(true)
      }
    },
    [reflectionTracked, onReflectionUsed]
  )

  return (
    <RecogLayout dataActivity="recognition-mini-reflection">
      <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-6 px-4 py-8 text-black sm:gap-8 sm:px-6 sm:py-10 lg:px-8">
        <h3 className="text-left text-lg font-bold leading-snug sm:text-xl">
          Before you go deeper. Let&apos;s take a moment to think.
        </h3>
        <p className="text-left text-base font-medium leading-snug text-black sm:text-lg">
          Which of the four did you recognise most from your own classroom?
        </p>
        <label className="sr-only" htmlFor="recognition-mini-reflection">
          Reflection (optional)
        </label>
        <textarea
          id="recognition-mini-reflection"
          name="recognition-mini-reflection"
          autoComplete="off"
          value={reflectionText}
          onChange={handleReflectionChange}
          className="min-h-[200px] w-full resize-y rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-relaxed text-black/90 outline-none placeholder:text-black/55 focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[220px] sm:text-base"
          placeholder="These notes are just for you. Nothing you write here is saved or assessed. We only record whether you used this space, not what you said. You can type here or skip entirely."
        />
        {onContinue ? (
          <div className="flex w-full flex-col items-stretch pt-1">
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
    </RecogLayout>
  )
}
