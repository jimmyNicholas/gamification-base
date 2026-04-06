"use client"

import * as React from "react"

import { DemoStyleLayout } from "@/sections/demo/demo-outline-layout"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

export type ReflectionPageProps = {
  onContinue?: () => void
  /** Fires once when the learner enters text in the reflection box (for session analytics). */
  onReflectionTextUsed?: () => void
}

const REFLECTION_PROMPTS = [
  "Which of the four categories do you currently underutilise, and what would it take to reach for it more often?",
  "Think about a class you teach regularly. Which axis do you find hardest to read in the moment?",
  "Which of the four situations felt most familiar? What does that tell you about where you spend most of your teaching energy?",
]

export function ReflectionPage({ onContinue, onReflectionTextUsed }: ReflectionPageProps) {
  const [reflectionTracked, setReflectionTracked] = React.useState(false)
  const [canContinue, setCanContinue] = React.useState(false)

  const handleReflectionChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value
      if (!reflectionTracked && text.trim().length > 0) {
        onReflectionTextUsed?.()
        setReflectionTracked(true)
      }
    },
    [reflectionTracked, onReflectionTextUsed]
  )

  // Enable continue button after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCanContinue(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Enable Enter/Spacebar to continue (only when button is enabled and onContinue exists)
  useKeyboardNavigation({
    onSubmit: canContinue && onContinue ? onContinue : undefined,
  })

  return (
    <DemoStyleLayout dataActivity="reflection">
      <div className="flex max-h-screen w-full max-w-7xl flex-col items-center justify-center gap-8 px-6 py-12 sm:py-16">
        {/* Heading */}
        <h1 className="text-center text-2xl font-bold leading-tight text-black sm:text-3xl md:text-4xl lg:text-5xl">
          Take it to your classroom.
        </h1>

        {/* Two column layout */}
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16 bg-white/70 p-4 rounded-xl">
          {/* Left: Prompts */}
          <div className="flex w-full flex-col gap-6 sm:gap-8 lg:flex-1">
            {REFLECTION_PROMPTS.map((prompt, index) => (
              <p key={index} className="text-left text-base leading-relaxed text-black/90 sm:text-lg md:text-xl lg:text-lg xl:text-xl">
                {prompt}
              </p>
            ))}
          </div>

          {/* Right: Instruction, Textarea, Button */}
          <div className="flex w-full flex-col gap-6 lg:flex-1">
            {/* Instruction */}
            <p className="text-center text-sm leading-relaxed text-black/70 sm:text-base lg:text-left">
              There is no right answer. This is for you. You can type here or just sit with the question.
            </p>

            {/* Textarea */}
            <textarea
              aria-label="Reflection space"
              className="min-h-[160px] w-full resize-y rounded-xl border border-black/10 bg-white/60 p-4 text-sm text-black/90 outline-none placeholder:text-black/30 focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[200px] sm:p-5 sm:text-base lg:min-h-[240px]"
              placeholder="These notes are just for you. Nothing you write here is saved or assessed. We only record whether you used this space, not what you said. You can type here or skip entirely."
              onChange={handleReflectionChange}
            />

            {/* Continue button */}
            {onContinue ? (
              <button
                type="button"
                className={`${demoPrimaryCtaConstrainedClassName} ${demoPrimaryCtaNativeFocusClassName} mx-auto lg:mx-0`}
                onClick={() => onContinue()}
                disabled={!canContinue}
                style={{
                  opacity: canContinue ? 1 : 0.5,
                  cursor: canContinue ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </DemoStyleLayout>
  )
}

