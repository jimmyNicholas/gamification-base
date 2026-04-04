"use client"

import * as React from "react"

import { QuadrantAxesModel } from "@/components/quadrant-axes-model"
import { AXIS_CENTER, type AxisIndex } from "@/components/discrete-axis-slider"
import { ReflectionLayout } from "@/sections/reflection/reflection-layout"
import {
  demoPrimaryCtaConstrainedClassName,
  demoPrimaryCtaNativeFocusClassName,
} from "@/sections/demo/demo-ui"
import { cn } from "@/lib/utils"
import { TwoColumnActivityStageLayout } from "@/layouts/TwoColumnActivityStageLayout"
import { QuadrantAxesModelV2 } from "@/components/quadrant-axes-model-v2"

export type AxisPageProps = {
  onContinue?: () => void
}

export function AxisPage({ onContinue }: AxisPageProps) {
  const [horizontalIndex, setHorizontalIndex] = React.useState<AxisIndex>(AXIS_CENTER)
  const [verticalIndex, setVerticalIndex] = React.useState<AxisIndex>(AXIS_CENTER)

  return (
    <ReflectionLayout dataActivity="axis-page">
      <TwoColumnActivityStageLayout
        reserveTopTitleSpace={true}
        leftVerticalAlign="start"
        leftContent={
          <div className="flex min-h-[min(52vh,420px)] w-full min-w-0 flex-col gap-4 self-stretch sm:gap-5 lg:min-h-0 lg:h-full px-10">
            <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
              <h2 className="text-left text-xl font-bold leading-snug sm:text-xl">You might have noticed that these four categories share some similarities and differences.</h2>
              <p>Each axis runs between two extremes. Agency and fate on one. Self-intact and self-dissolved on the other.</p>
              <p>In this section we&apos;ll look at each axis more closely. The strengths, the weaknesses, and how to use it as a quick diagnostic tool through common situations.</p>
            </div>

            {onContinue ? (
              <div className="mt-auto flex w-full flex-col items-center pt-2 sm:pt-4">
                <button
                  type="button"
                  className={cn(
                    demoPrimaryCtaConstrainedClassName,
                    demoPrimaryCtaNativeFocusClassName,
                    "w-full max-w-lg"
                  )}
                  onClick={() => onContinue()}
                >
                  Continue
                </button>
              </div>
            ) : null}
          </div>
        }
        rightContent={
          <div className="flex w-full min-w-0 justify-center">
          <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "color",
              clickable: true,
              index: horizontalIndex,
            }}
            verticalAxis={{
              state: "grey",
              clickable: false,
            }}
            onAxisIndexChange={(axis, index) => {
              if (axis !== "horizontal") return
              setHorizontalIndex(index)
            }}
            className="h-full w-full max-w-[620px] p-14"
          />
          </div>
        }
      />
    </ReflectionLayout>
  )
}

// *** AXIS QUIZ INTRO*** //
/* 
background: light blue #DBEAFE
left column: 
- heading: You might have noticed that these four categories share some similarities and differences.
- body: Each axis runs between two extremes. Agency and fate on one. Self-intact and self-dissolved on the other.
- body: In this section we'll look at each axis more closely. The strengths, the weaknesses, and how to use it as a quick diagnostic tool through common situations.
- button: Continue

right column:
<div className="flex w-full min-w-0 justify-center">
    <QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "black",
              clickable: false,
            }}
            verticalAxis={{
              state: "black",
              clickable: false,
            }}
            className="h-full w-full max-w-[620px] p-14"
          />
</div>

onContinue: AXIS INTRO AGENCY/FATE
*/

// *** AXIS INTRO AGENCY/FATE *** //
/* 
background: light blue #DBEAFE
left column: 
- heading: Agency and Fate
- body: How much does the outcome depend on the student's skill and preparation versus randomness and chance?
- body: Agency rewards effort and builds pride, but exposes weaker students and can cause withdrawal in low-confidence rooms.
- body: Fate levels the field and reduces anxiety, but feels meaningless if students can't see a communicative purpose behind the randomness.
- body: High agency increases performance anxiety and makes proficiency gaps visible. High fate reduces anxiety and equalises the room regardless of level.
- button: Continue

right column:
<QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "color",
              clickable: false,
            }}
            verticalAxis={{
              state: "grey",
              clickable: false,
            }}
            className="h-full w-full max-w-[620px] p-14"
          />
onContinue: AXIS QUIZ SELF-INTACT/SELF-DISSOLVED
*/

// *** AXIS QUIZ AGENCY/FATE *** //
/*
background: light blue #DBEAFE
Heading: "Read each situation. Place your answer on the grid below."
Body: "You have a strong intermediate class preparing for a Cambridge exam. They are motivated and competitive. You want to run a speaking game. How much should skill and effort determine the outcome?"
button: "Submit" onSubmit: show answer and continue button
Body: 
    if agency side, "Yes. High agency fits here. The students are confident, prepared, and the competitive stakes match their goal."
    if fate side, "Consider the room. These students are motivated and exam-focused. Would fate serve them better than effort here? Have another look."
button: "Continue" onContinue: show next situation

Body: "It is the first week of a new term. Students do not know each other yet. You want to run an icebreaker but you do not want stronger students to stand out. How much should performance determine the outcome?"
button: "Submit" onSubmit: show answer, continue button and axis activated message
Body:
     if fate side, "Yes. Fate works here. Nobody is disadvantaged, nobody dominates, and the focus stays on connection rather than performance."
     if agency side, "Think about what this group needs right now. Would rewarding skill help or hurt the room at this stage? Have another look."

     Axis activated message: "You have activated your first axis. You will use it in the next section."
button: "Continue" onContinue: AXIS INTRO SELF-INTACT/SELF-DISSOLVED

<QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "color",
              clickable: true,
              index: horizontalIndex,
            }}
            verticalAxis={{
              state: "grey",
              clickable: false,
            }}
            onAxisIndexChange={(axis, index) => {
              if (axis !== "horizontal") return
              setHorizontalIndex(index)
            }}
            className="h-full w-full max-w-[620px] p-14"
          />
*/

// *** AXIS INTRO SELF-INTACT/SELF-DISSOLVED *** //
/*
background: light blue #DBEAFE
Heading: "Self-intact and Self-dissolved"
Body: "How much of the student's real identity is present in the activity versus temporarily suspended through character, role, or cognitive overwhelm?"
Body: "Self-intact produces authentic, meaningful language and real communicative investment, but requires psychological safety that may not yet exist."
Body: "Self-dissolution lowers the cost of errors and unlocks fluency in over-monitors, but feels threatening rather than liberating if introduced before trust is established."
Body: "Self-dissolved activities create an illusion of distance from performance. For roleplay this is conscious. For chaos it is involuntary. Both suspend self-monitoring through different mechanisms."
button: "Continue"

right column:
<QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "grey",
              clickable: false,
            }}
            verticalAxis={{
              state: "color",
              clickable: false,
            }}
            className="h-full w-full max-w-[620px] p-14"
          />

           
  */

// *** AXIS QUIZ SELF-INTACT/SELF-DISSOLVED *** //
/*
Heading: "Read each situation. Place your answer on the grid below."
Body: "A student has recently arrived from overseas and is visibly anxious in class. They participate when called on but never volunteer. You want them to contribute in today's discussion activity. How much should they be asked to step outside themselves?"
button: "Submit" onSubmit: show answer, continue button and axis activated message
Body:
    if self-intact side, "Yes. Self-intact is right here. This student needs to feel safe as themselves before they can step outside that safety."
    if self-dissolved side, "Consider what this student needs right now. Would asking them to become someone else help or add pressure at this stage? Have another look."
button: "Continue" onContinue: show next situation

Body: "You are working on a unit about conflict resolution. Students need to practise difficult conversations. Complaints, disagreements, confrontation. Most of them find this uncomfortable as themselves. How much would stepping into a character help them engage?"
button: "Submit" onSubmit: show answer, continue button and axis activated message
Body:
    if self-dissolved side, "Yes. Self-dissolution works here. The character gives students permission to have the difficult conversation without personal risk."
    if self-intact side, "Think about what the character does for the student. Does it protect them or expose them in this context? Have another look."
button: "Continue" onContinue: AXIS INTRO BOTH

<QuadrantAxesModelV2
            mode="axisDiagnostic"
            horizontalAxis={{
              state: "grey",
              clickable: false,
            }}
            verticalAxis={{
              state: "color",
                clickable: true,
                index: verticalIndex,
            }}
            onAxisIndexChange={(axis, index) => {
              if (axis !== "vertical") return
              setVerticalIndex(index)
            }}
            className="h-full w-full max-w-[620px] p-14"
          />

*/

