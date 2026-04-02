"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type NarrativeScreenProps = {
  title: string
  body?: string
  prompt?: string
  className?: string
  align?: "left" | "center"
}

export function NarrativeScreen({
  title,
  body,
  prompt,
  className,
  align = "left",
}: NarrativeScreenProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-white/15 bg-black/25 p-4 text-white/90 shadow-sm",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {body ? <p className="mt-2 text-sm leading-relaxed text-white/85">{body}</p> : null}
      {prompt ? <p className="mt-3 text-sm leading-relaxed text-white/75">{prompt}</p> : null}
    </section>
  )
}
