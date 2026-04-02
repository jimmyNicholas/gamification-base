"use client"

import { ANIMAL_MATCH_DEMO } from "@/sections/demo/competition-activity/animal-match-demo"
import { CustomTimedMatch } from "@/sections/demo/competition-activity/custom-timed-match"

import type { CourseSection } from "@/sections/types"

export const bodySection: CourseSection = {
  id: "section-1-body",
  title: "Section 1: Body",
  body: <CustomTimedMatch {...ANIMAL_MATCH_DEMO} />,
  continueRule: "always",
  continueLabel: "Continue",
}
