"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MediaBlockProps = {
  heading: string
  videoTitle: string
  videoUrl: string
  readingFallback?: string
  className?: string
}

export function MediaBlock({
  heading,
  videoTitle,
  videoUrl,
  readingFallback,
  className,
}: MediaBlockProps) {
  const [showFallback, setShowFallback] = React.useState(false)

  return (
    <section className={cn("rounded-xl border border-white/15 bg-black/25 p-4 text-white/90", className)}>
      <h3 className="text-lg font-semibold text-white">{heading}</h3>
      <p className="mt-2 text-sm text-white/80">{videoTitle}</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-white/15 bg-black/30">
        <iframe
          title={videoTitle}
          src={videoUrl}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {readingFallback ? (
        <div className="mt-3">
          <Button variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10" onClick={() => setShowFallback((prev) => !prev)}>
            {showFallback ? "Hide reading fallback" : "Show reading fallback"}
          </Button>
          {showFallback ? (
            <p className="mt-3 rounded-lg border border-white/15 bg-black/20 p-3 text-sm text-white/80">{readingFallback}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
