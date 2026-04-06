"use client"

import * as React from "react"

import { DemoStyleLayout } from "@/sections/demo/demo-outline-layout"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"

export type ReferencesPageProps = {
  onContinue?: () => void
}

const REFERENCES = [
  {
    text: "Caillois, R. (2001). Man, play and games. University of Illinois Press.",
  },
  {
    text: "McDonald, P. D. (2020). The principle of division in Roger Caillois's Man, Play and Games. Games and Culture, 15(8), 855-873.",
    url: "https://doi.org/10.1177/1555412019853080",
  },
  {
    text: "erynbroughtabook. (2021, April 9). Understanding the psychology of fun: The 4 types of play [Video]. TikTok. Retrieved March 27, 2026, from",
    url: "https://www.tiktok.com/@erynbroughtabook/video/6954424802610269446",
  },
]

const PACKAGES = [
  { name: "Next.js", version: "16.2.1", description: "React framework" },
  { name: "React", version: "19.2.4", description: "UI library" },
  { name: "Tailwind CSS", version: "4", description: "Utility-first CSS framework" },
  { name: "Lucide React", version: "1.7.0", description: "Icon library" },
  { name: "Base UI", version: "1.3.0", description: "Accessible component primitives" },
]

const AI_USAGE = [
  {
    section: "Development",
    description: "This project was built with the assistance of Cursor and Claude Code.",
  },
  {
    section: "Introduction & Mimicry Scenario",
    description: "Characters and hats were generated in RISE 360",
  },
]

const ADOBE_IMAGES = [
  {
    title: "Apartment",
    description: "Two-floor apartment with wooden elements",
    artist: "Dariusz Jarzabek",
    source: "Adobe Stock",
    assetId: "319415634",
    isAI: false,
  },
  {
    title: "Mountain",
    description: "Stunning mountain vista wedding ceremony with floral arch and white chairs",
    artist: "Aklima",
    source: "Adobe Stock",
    assetId: "1954022093",
    isAI: true,
    note: "Editorial use must not be misleading or deceptive",
  },
  {
    title: "Cafe",
    description: "A stylish cafe with wood tables and a counter, natural light, and greenery",
    artist: "happy_finch",
    source: "Adobe Stock",
    assetId: "864986555",
    isAI: true,
    note: "Editorial use must not be misleading or deceptive",
  },
]

export function ReferencesPage({ onContinue }: ReferencesPageProps) {
  return (
    <DemoStyleLayout dataActivity="references">
      <div className="flex max-h-screen w-full max-w-7xl flex-col items-start gap-8 px-6 py-12 sm:py-16 overflow-y-auto">
        {/* Heading */}
        <h1 className="text-left text-2xl font-bold leading-tight text-black sm:text-3xl md:text-4xl lg:text-5xl">
          References & Acknowledgments
        </h1>

        {/* References Section */}
        <section className="w-full">
          <h2 className="mb-4 text-xl font-semibold text-black sm:text-2xl">References</h2>
          <div className="flex flex-col gap-3 bg-white/70 p-6 rounded-xl">
            {REFERENCES.map((ref, index) => (
              <p key={index} className="text-left text-sm leading-relaxed text-black/90 sm:text-base">
                {ref.text}
                {ref.url && (
                  <>
                    {" "}
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {ref.url}
                    </a>
                  </>
                )}
              </p>
            ))}
          </div>
        </section>

        {/* Packages Section */}
        <section className="w-full">
          <h2 className="mb-4 text-xl font-semibold text-black sm:text-2xl">Software Packages</h2>
          <div className="bg-white/70 p-6 rounded-xl">
            <p className="mb-4 text-sm text-black/70 sm:text-base">
              This project was built using the following open-source software:
            </p>
            <div className="flex flex-col gap-2">
              {PACKAGES.map((pkg, index) => (
                <div key={index} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="font-semibold text-black text-sm sm:text-base">
                    {pkg.name} v{pkg.version}
                  </span>
                  <span className="text-black/70 text-sm sm:text-base">— {pkg.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Usage Section */}
        <section className="w-full">
          <h2 className="mb-4 text-xl font-semibold text-black sm:text-2xl">AI & Generated Content</h2>
          <div className="flex flex-col gap-4 bg-white/70 p-6 rounded-xl">
            {AI_USAGE.map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <h3 className="font-semibold text-black text-base sm:text-lg">{item.section}</h3>
                <p className="text-black/90 text-sm sm:text-base">{item.description}</p>
              </div>
            ))}

            {/* Adobe Stock Images */}
            <div className="mt-4">
              <h3 className="mb-3 font-semibold text-black text-base sm:text-lg">
                Background Images (Adobe Stock)
              </h3>
              <div className="flex flex-col gap-4">
                {ADOBE_IMAGES.map((image, index) => (
                  <div key={index} className="flex flex-col gap-1 border-l-2 border-black/20 pl-4">
                    <p className="font-medium text-black text-sm sm:text-base">
                      <strong>Image:</strong> {image.title}
                    </p>
                    <p className="text-black/90 text-sm">{image.description}</p>
                    <p className="text-black/70 text-sm">
                      <strong>By:</strong> {image.artist}
                    </p>
                    <p className="text-black/70 text-sm">
                      <strong>Source:</strong> {image.source}
                    </p>
                    <p className="text-black/70 text-sm">
                      <strong>Asset ID:</strong> {image.assetId}
                    </p>
                    {image.isAI && (
                      <p className="text-black/90 text-sm italic">Generated with AI</p>
                    )}
                    {image.note && (
                      <p className="text-black/70 text-sm italic">{image.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Continue button */}
        {onContinue ? (
          <button
            type="button"
            className={`${demoPrimaryCtaConstrainedClassName} ${demoPrimaryCtaNativeFocusClassName} mx-auto`}
            onClick={() => onContinue()}
          >
            Course Complete
          </button>
        ) : null}
      </div>
    </DemoStyleLayout>
  )
}
