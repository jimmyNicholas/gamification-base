"use client"

import Image from "next/image"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  demoMimicryScenePromptClassName,
  demoPrimaryCtaNarrowClassName,
  demoStageMimicryFrameClassName,
  demoUiEyebrowClassName,
  demoUiHelperTextClassName,
} from "@/sections/demo/demo-ui"
import { MimicryLayout } from "@/sections/demo/mimicry/mimicry-layout"
import { getBackgroundById } from "@/sections/demo/mimicry/mimicry-assets"
import { getSceneById, type MimicryScene, type MimicrySceneId } from "@/sections/demo/mimicry/mimicry-scenario"

const BG_MS = 400
const FG_DELAY_MS = 200

/** Art is authored at 3200×1800 (16:9); keyed by scenario scene id. */
const SCENE_ART: Partial<Record<MimicrySceneId, string>> = {
  judyIntro: "/assets/mimicry/scene-1.jpeg",
  weddingHats: "/assets/mimicry/scene-2.jpeg",
  hatAffirmation: "/assets/mimicry/scene-2.jpeg",
  cafeConfront: "/assets/mimicry/scene-3.jpeg",
}

const FRAME_W = 3600
const FRAME_H = 1800

const choiceButtonClassName =
  "min-h-12 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-left text-sm font-medium leading-snug text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors hover:bg-black/[0.03] sm:text-base"

const hatTileClassName =
  "flex aspect-square h-[min(26vw,120px)] w-[min(26vw,120px)] shrink-0 items-center justify-center rounded-xl border-2 border-black/20 bg-white p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] outline-none transition-[background-color,border-color,box-shadow,transform] hover:border-blue-950/45 hover:bg-blue-950/[0.09] hover:shadow-[0_4px_14px_rgba(30,58,138,0.18)] focus-visible:ring-2 focus-visible:ring-blue-900/35 focus-visible:ring-offset-2 sm:h-[min(22vw,132px)] sm:w-[min(22vw,132px)] sm:p-3 md:h-[118px] md:w-[118px] lg:h-[132px] lg:w-[132px]"

function sceneImageSrc(scene: MimicryScene): string {
  const local = SCENE_ART[scene.id as MimicrySceneId]
  if (local) return local
  const bg = getBackgroundById(scene.backgroundId)
  return bg.imageSrc ?? ""
}

export type MimicryPageProps = {
  onContinue?: (payload?: { hatLabel: string | null; hatImageSrc: string | null }) => void
}

export function MimicryPage({ onContinue }: MimicryPageProps) {
  const [sceneId, setSceneId] = React.useState<MimicrySceneId>("judyIntro")
  const [lineIndex, setLineIndex] = React.useState(0)
  const [freeformText, setFreeformText] = React.useState("")
  const [chosenHatLabel, setChosenHatLabel] = React.useState<string | null>(null)
  const [chosenHatImageSrc, setChosenHatImageSrc] = React.useState<string | null>(null)

  const [outgoingSrc, setOutgoingSrc] = React.useState<string | null>(null)
  const [outgoingFadeOut, setOutgoingFadeOut] = React.useState(false)
  const [incomingFadeIn, setIncomingFadeIn] = React.useState(true)
  const prevSceneIdRef = React.useRef<MimicrySceneId>(sceneId)

  const scene = getSceneById(sceneId)
  const lines = scene?.lines ?? []
  const interaction = scene?.interaction ?? "choices"
  const atLineEnd = scene && lineIndex >= lines.length
  /** Choices appear on the last dialogue beat (same step as the final line), not after an extra CONTINUE. */
  const atChoice = Boolean(
    scene &&
      interaction === "choices" &&
      scene.choices.length > 0 &&
      lines.length > 0 &&
      lineIndex === lines.length - 1
  )
  /** Same step as the last line (like choices), not after an extra CONTINUE. */
  const atFreeform = Boolean(
    scene &&
      interaction === "freeform" &&
      scene.freeform &&
      (lines.length === 0 ? lineIndex >= lines.length : lineIndex === lines.length - 1)
  )
  const canSubmitFreeform = freeformText.trim().length > 0
  const currentLine = !atLineEnd && lines[lineIndex] ? lines[lineIndex] : undefined

  const imageSrc = scene ? sceneImageSrc(scene) : ""
  const imageAlt = scene ? `${getBackgroundById(scene.backgroundId).label} — roleplay scene` : ""

  React.useEffect(() => {
    if (sceneId === prevSceneIdRef.current) return
    const prev = getSceneById(prevSceneIdRef.current)
    prevSceneIdRef.current = sceneId
    if (!prev) return
    const prevSrc = sceneImageSrc(prev)
    if (prevSrc === imageSrc) return
    setOutgoingFadeOut(false)
    setIncomingFadeIn(false)
    setOutgoingSrc(prevSrc)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOutgoingFadeOut(true)
        setIncomingFadeIn(true)
      })
    })
  }, [sceneId, imageSrc])

  React.useEffect(() => {
    if (!outgoingSrc || !outgoingFadeOut) return
    const t = window.setTimeout(() => {
      setOutgoingSrc(null)
      setOutgoingFadeOut(false)
    }, BG_MS + 40)
    return () => window.clearTimeout(t)
  }, [outgoingSrc, outgoingFadeOut])

  const goNextLine = () => {
    if (!scene) return
    if (lineIndex < lines.length - 1) setLineIndex((i) => i + 1)
  }

  const pickChoice = (nextId: string, choiceLabel?: string, choiceImageSrc?: string) => {
    if (nextId === "hatAffirmation") {
      setChosenHatLabel(choiceLabel ?? null)
      setChosenHatImageSrc(choiceImageSrc ?? null)
    }
    setSceneId(nextId as MimicrySceneId)
    setLineIndex(0)
    setFreeformText("")
  }

  const onLastLineContinue = () => {
    if (!scene) return
    if (scene.continueToSceneId) {
      setSceneId(scene.continueToSceneId as MimicrySceneId)
      setLineIndex(0)
      setFreeformText("")
      return
    }
    setLineIndex(lines.length)
  }

  const onFreeformContinue = () => {
    if (!scene?.freeform || freeformText.trim().length === 0) return
    if (onContinue) {
      onContinue({ hatLabel: chosenHatLabel, hatImageSrc: chosenHatImageSrc })
      return
    }
    pickChoice(scene.freeform.nextSceneId)
  }

  React.useEffect(() => {
    setFreeformText("")
  }, [sceneId])

  React.useEffect(() => {
    if (sceneId === "judyIntro") {
      setChosenHatLabel(null)
      setChosenHatImageSrc(null)
    }
  }, [sceneId])

  React.useEffect(() => {
    const s = getSceneById(sceneId)
    if (s?.interaction !== "autoAdvance" || !s.autoAdvance) return
    const delay = s.autoAdvance.delayMs ?? 3200
    const next = s.autoAdvance.nextSceneId
    const t = window.setTimeout(() => {
      setSceneId(next as MimicrySceneId)
      setLineIndex(0)
    }, delay)
    return () => window.clearTimeout(t)
  }, [sceneId])

  if (!scene) {
    return (
      <MimicryLayout>
        <p className="text-black">Unknown scene.</p>
      </MimicryLayout>
    )
  }

  const isCafeScene = scene.id === "cafeConfront"
  const isHatAffirmation = scene.interaction === "autoAdvance"
  const fgMotionClass =
    "transition-[opacity,transform] duration-[400ms] ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:delay-0"

  return (
    <MimicryLayout>
      <div className="flex w-full max-w-6xl flex-col items-center gap-3">
        <div className={demoStageMimicryFrameClassName}>
          <div
            className="relative w-full shrink-0 lg:absolute lg:inset-0 lg:h-full lg:aspect-auto"
            style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
          >
            {outgoingSrc && (
              <div
                className={cn(
                  "absolute inset-0 z-1 transition-opacity motion-reduce:transition-none",
                  outgoingFadeOut ? "opacity-0" : "opacity-100"
                )}
                style={{ transitionDuration: `${BG_MS}ms` }}
              >
                <Image
                  src={outgoingSrc}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 90vw, min(120rem, 85vw)"
                />
              </div>
            )}
            {imageSrc ? (
              <div
                className={cn(
                  "absolute inset-0 z-2 transition-opacity motion-reduce:transition-none",
                  incomingFadeIn ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDuration: `${BG_MS}ms` }}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 90vw, min(120rem, 85vw)"
                  priority
                />
              </div>
            ) : (
              <div
                className="absolute inset-0 z-2"
                style={{ background: getBackgroundById(scene.backgroundId).cssBackground }}
                aria-hidden
              />
            )}
          </div>

          <div
            className={cn(
              "relative z-10 w-full shrink-0 border-t border-black/10 bg-white p-4 sm:p-5",
              !isCafeScene &&
                "lg:absolute lg:inset-x-auto lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:border-t-0 lg:bg-transparent lg:p-0 lg:right-[max(1rem,4.5%)]",
              !isCafeScene &&
                !isHatAffirmation &&
                "lg:w-[min(42%,400px)] lg:max-w-none xl:w-[min(40%,480px)] 2xl:w-[min(38%,520px)]",
              !isCafeScene &&
                isHatAffirmation &&
                "lg:w-auto lg:max-w-[min(42%,400px)] xl:max-w-[min(40%,480px)] 2xl:max-w-[min(38%,520px)]",
              isCafeScene &&
                "lg:absolute lg:inset-x-4 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:border-t-0 lg:bg-transparent lg:p-0 xl:inset-x-8"
            )}
          >
            <div
              className={cn(
                fgMotionClass,
                "flex w-full flex-col gap-3 sm:gap-4",
                isHatAffirmation && "lg:w-fit lg:max-w-full",
                incomingFadeIn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                "motion-reduce:translate-y-0"
              )}
              style={{ transitionDelay: `${FG_DELAY_MS}ms` }}
            >
              <div
                className={cn(
                  "w-full",
                  isHatAffirmation && "md:w-fit",
                  "max-md:p-0",
                  "md:rounded-xl md:border md:border-black/10 md:bg-white md:p-6 md:shadow-[0_6px_20px_rgba(0,0,0,0.12)]",
                  isCafeScene && "md:mx-auto md:max-w-[min(76.8%,44.8rem)]"
                )}
                role="region"
                aria-label="Mimicry dialogue"
              >
                <div
                  className={cn(
                    "flex flex-col gap-4 sm:gap-5",
                    isCafeScene && "w-full",
                    !isCafeScene && !isHatAffirmation && "w-full",
                    !isCafeScene && isHatAffirmation && "w-full md:w-fit"
                  )}
                >
                    {isHatAffirmation && (
                      <div
                        className="flex w-full flex-col items-center gap-3 sm:gap-4"
                        role="status"
                        aria-live="polite"
                      >
                        <p className={cn(demoMimicryScenePromptClassName, "text-center")}>
                          You chose the {chosenHatLabel ?? "hat"}.
                        </p>
                        {chosenHatImageSrc && (
                          <div className={cn(hatTileClassName, "pointer-events-none shrink-0")} aria-hidden>
                            <Image
                              src={chosenHatImageSrc}
                              alt=""
                              width={192}
                              height={192}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        )}
                        <p className={cn(demoMimicryScenePromptClassName, "text-center")}>Nice choice!</p>
                      </div>
                    )}

                    {currentLine && (
                      <div className="flex flex-col gap-2">
                        <p
                          className={cn(
                            "text-left text-base leading-snug text-black sm:text-lg sm:leading-snug md:text-xl md:leading-snug",
                            currentLine.kind === "thought" && "text-black/90",
                            isCafeScene && "whitespace-pre-line"
                          )}
                        >
                          {currentLine.text}
                        </p>
                      </div>
                    )}

                    {atChoice && scene.prompt && (
                      <p className={cn(demoMimicryScenePromptClassName, "text-left")}>{scene.prompt}</p>
                    )}

                    {atChoice && (
                      <div className="flex flex-col gap-2">
                        {!scene.prompt && (
                          <p className={demoUiEyebrowClassName}>Your move</p>
                        )}
                        <div
                          className={cn(
                            "flex gap-3",
                            scene.choices.some((c) => c.imageSrc)
                              ? "flex-row flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4"
                              : "flex-col gap-2"
                          )}
                          role={scene.choices.some((c) => c.imageSrc) ? "group" : undefined}
                          aria-label={scene.choices.some((c) => c.imageSrc) ? "Choose a hat" : undefined}
                        >
                          {scene.choices.map((c) =>
                            c.imageSrc ? (
                              <button
                                key={c.id}
                                type="button"
                                className={hatTileClassName}
                                onClick={() => pickChoice(c.nextSceneId, c.label, c.imageSrc)}
                                aria-label={c.label}
                              >
                                <Image
                                  src={c.imageSrc}
                                  alt=""
                                  width={192}
                                  height={192}
                                  className="h-full w-full object-contain"
                                />
                              </button>
                            ) : (
                              <button
                                key={c.id}
                                type="button"
                                className={choiceButtonClassName}
                                onClick={() => pickChoice(c.nextSceneId, c.label)}
                              >
                                {c.label}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {atFreeform && scene.freeform && (
                      <div className="flex flex-col gap-3">
                        {scene.prompt && (
                          <p className={cn(demoMimicryScenePromptClassName, "text-left")}>{scene.prompt}</p>
                        )}
                        <label className="sr-only" htmlFor="mimicry-freeform">
                          {scene.freeform.placeholder}
                        </label>
                        <textarea
                          id="mimicry-freeform"
                          rows={4}
                          placeholder={scene.freeform.placeholder}
                          value={freeformText}
                          onChange={(e) => setFreeformText(e.target.value)}
                          className="min-h-[120px] w-full resize-y rounded-xl border border-black/20 bg-white px-3 py-2.5 text-base leading-snug text-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] outline-none placeholder:text-black/55 focus-visible:border-black/40 focus-visible:ring-2 focus-visible:ring-black/15"
                        />
                        <p className={demoUiHelperTextClassName}>{scene.freeform.footnote}</p>
                        <Button
                          type="button"
                          size="lg"
                          className={demoPrimaryCtaNarrowClassName}
                          disabled={!canSubmitFreeform}
                          onClick={onFreeformContinue}
                        >
                          CONTINUE
                        </Button>
                      </div>
                    )}

                    {!atLineEnd && lineIndex < lines.length - 1 && (
                      <Button type="button" size="lg" className={demoPrimaryCtaNarrowClassName} onClick={goNextLine}>
                        CONTINUE
                      </Button>
                    )}

                    {!atLineEnd &&
                      lineIndex === lines.length - 1 &&
                      lines.length > 0 &&
                      !atChoice &&
                      interaction !== "freeform" && (
                        <Button type="button" size="lg" className={demoPrimaryCtaNarrowClassName} onClick={onLastLineContinue}>
                          CONTINUE
                        </Button>
                      )}

                    {scene.id === "complete" && atChoice && onContinue && (
                      <Button
                        type="button"
                        size="lg"
                        className="h-13 w-full rounded-full border-2 border-black/25 bg-white px-8 text-sm font-bold tracking-[0.08em] text-black uppercase shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:bg-black/4 sm:h-14 sm:text-base"
                        onClick={() =>
                          onContinue({
                            hatLabel: chosenHatLabel,
                            hatImageSrc: chosenHatImageSrc,
                          })
                        }
                      >
                        Continue
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MimicryLayout>
  )
}
