"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import {
  getStatements,
  getSessionSummary,
  clearStatements,
  exportStatementsJSON,
  type xAPIStatement,
} from "@/lib/xapi-tracking"
import {
  getCompleteSessionData,
  clearXAPISession,
} from "@/lib/xapi-session"
import {
  clearDemoMatchOutcomesSession,
  DEMO_OUTCOMES_CLEAR_EVENT,
  loadDemoMatchOutcomesFromSession,
} from "@/lib/demo-match-outcomes-session"
import { QUADRANT_PLAY_CATEGORY_TILES } from "@/sections/demo/quadrants-axes/quadrants-axes-data"
import type { DemoMatchOutcomes } from "@/sections/demo/match-the-four/demo-match-outcomes"

/** Must match correct answers in `sections/analysis/axis-page.tsx` (Agency=left, Fate=right, Self-intact=top, Self-dissolved=bottom). */
const AXIS_EXPECTED_LABEL = {
  agencyQ1: "Agency",
  agencyQ2: "Fate",
  selfQ1: "Self-intact",
  selfQ2: "Self-dissolved",
} as const

function axisQuestionStatus(
  choice: string | null,
  expected: string
): "correct" | "incorrect" | null {
  if (choice === null) return null
  return choice === expected ? "correct" : "incorrect"
}

function formatAxisPercentCorrect(o: DemoMatchOutcomes): string {
  const pairs: Array<[string | null, string]> = [
    [o.axisAgencyQ1Choice, AXIS_EXPECTED_LABEL.agencyQ1],
    [o.axisAgencyQ2Choice, AXIS_EXPECTED_LABEL.agencyQ2],
    [o.axisSelfQ1Choice, AXIS_EXPECTED_LABEL.selfQ1],
    [o.axisSelfQ2Choice, AXIS_EXPECTED_LABEL.selfQ2],
  ]
  const answered = pairs.filter(([c]) => c !== null) as Array<[string, string]>
  if (answered.length === 0) return "—"
  const correct = answered.filter(([c, exp]) => c === exp).length
  return `${Math.round((100 * correct) / answered.length)}%`
}

function hasDemoSectionData(o: DemoMatchOutcomes): boolean {
  return (
    o.competitionTimeMs !== null ||
    o.competitionAnimalEmoji !== null ||
    o.competitionReplayCount > 0 ||
    o.chanceQuestionNumber !== null ||
    o.chanceAnswer !== null ||
    o.roleplayHatLabel !== null ||
    o.roleplayHatImageSrc !== null ||
    o.roleplayTomResponse !== null ||
    o.chaosQ1Answer !== null ||
    o.chaosQ2Skills.length > 0
  )
}

function hasRecognitionSectionData(o: DemoMatchOutcomes): boolean {
  return (
    o.recognitionMatchMistakes > 0 ||
    o.recognitionCardFlips > 0 ||
    o.recognitionReflectionUsed
  )
}

function hasAxisSectionData(o: DemoMatchOutcomes): boolean {
  return (
    o.axisAgencyQ1Choice !== null ||
    o.axisAgencyQ2Choice !== null ||
    o.axisSelfQ1Choice !== null ||
    o.axisSelfQ2Choice !== null
  )
}

function hasAssessmentSectionData(o: DemoMatchOutcomes): boolean {
  return o.assessmentSituationResults.some((r) => r != null)
}

function hasReflectionSectionData(o: DemoMatchOutcomes): boolean {
  return o.reflectionFinalTextUsed
}

type CollapsibleSectionProps = {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-black/15 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-black/[0.02]"
      >
        <h4 className="text-sm font-semibold text-black">{title}</h4>
        {isOpen ? (
          <ChevronDown className="size-4 text-black/60" />
        ) : (
          <ChevronRight className="size-4 text-black/60" />
        )}
      </button>
      {isOpen && <div className="border-t border-black/5 p-4">{children}</div>}
    </div>
  )
}

export function AdminTracking() {
  const [statements, setStatements] = useState<xAPIStatement[]>([])
  const [summary, setSummary] = useState<ReturnType<typeof getSessionSummary>>(
    null
  )
  const [sessionData, setSessionData] = useState<ReturnType<
    typeof getCompleteSessionData
  > | null>(null)

  const refreshData = () => {
    const stmts = getStatements()
    const sum = getSessionSummary()
    const outcomes = loadDemoMatchOutcomesFromSession()
    const complete = getCompleteSessionData(outcomes)

    setStatements(stmts)
    setSummary(sum)
    setSessionData(complete)
  }

  useEffect(() => {
    refreshData()
    // Refresh every 2 seconds to show live updates
    const interval = setInterval(refreshData, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleExport = () => {
    const json = exportStatementsJSON()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `xapi-statements-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (
      confirm(
        "Are you sure you want to clear all tracking data? This cannot be undone."
      )
    ) {
      clearStatements()
      clearXAPISession()
      clearDemoMatchOutcomesSession()
      window.dispatchEvent(new Event(DEMO_OUTCOMES_CLEAR_EVENT))
      refreshData()
    }
  }

  const formatAssessmentPercent = (
    results: DemoMatchOutcomes["assessmentSituationResults"]
  ) => {
    const filled = results.filter((r): r is NonNullable<typeof r> => r != null)
    if (filled.length === 0) return "—"
    const matches = filled.filter((r) => r.chosen === r.ideal).length
    return `${Math.round((100 * matches) / filled.length)}%`
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  const outcomes = sessionData?.outcomes

  const hasAnyData =
    outcomes &&
    (hasDemoSectionData(outcomes) ||
      hasRecognitionSectionData(outcomes) ||
      hasAxisSectionData(outcomes) ||
      hasAssessmentSectionData(outcomes) ||
      hasReflectionSectionData(outcomes))

  const canClearSession =
    statements.length > 0 ||
    (outcomes &&
      (hasDemoSectionData(outcomes) ||
        hasRecognitionSectionData(outcomes) ||
        hasAxisSectionData(outcomes) ||
        hasAssessmentSectionData(outcomes) ||
        hasReflectionSectionData(outcomes)))

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-black">Learner Tracking</h3>
        <p className="text-sm text-black/70">
          xAPI integration proof - Session analytics and interaction data
        </p>
      </div>

      {/* Session Summary - Collapsible */}
      <CollapsibleSection title="Session Summary" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-black/60">Total Duration</p>
            <p className="text-lg font-bold text-black">
              {summary?.totalDurationMs
                ? formatDuration(summary.totalDurationMs)
                : "0s"}
            </p>
          </div>
          <div>
            <p className="text-xs text-black/60">Total Statements</p>
            <p className="text-lg font-bold text-black">
              {summary?.totalStatements || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-black/60">Phases Visited</p>
            <p className="text-lg font-bold text-black">
              {summary?.phasesVisited.length || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-black/60">Session ID</p>
            <p className="truncate text-xs font-mono text-black/80">
              {summary?.sessionId || "Not started"}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Time on Task - Collapsible */}
      {sessionData && sessionData.phaseSummary.length > 0 && (
        <CollapsibleSection title="Time on Task (by Phase)" defaultOpen={true}>
          <div className="flex flex-col gap-2">
            {sessionData.phaseSummary.map((phase, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-black/5 pb-2 last:border-0"
              >
                <span className="text-sm text-black/80">{phase.phase}</span>
                <span className="text-sm font-semibold text-black">
                  {phase.durationFormatted}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Answers Given - Reorganized by Section - Collapsible */}
      {hasAnyData && (
        <CollapsibleSection title="Answers Given" defaultOpen={true}>
          <div className="flex flex-col gap-4">
            {/* Demonstration — only if this run recorded demo-phase answers */}
            {hasDemoSectionData(outcomes) && (
            <div>
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                Demonstration
              </h5>
              <div className="flex flex-col gap-1.5 text-sm">
                {outcomes.competitionTimeMs !== null && (
                  <div>
                    <span className="text-black/60">Competition Time: </span>
                    <span className="font-semibold text-black">
                      {(outcomes.competitionTimeMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                )}
                {outcomes.competitionReplayCount > 0 && (
                  <div>
                    <span className="text-black/60">Competition Replays: </span>
                    <span className="font-semibold text-black">
                      {outcomes.competitionReplayCount}
                    </span>
                  </div>
                )}
                {outcomes.chanceQuestionNumber !== null && (
                  <div>
                    <span className="text-black/60">Chance Question: </span>
                    <span className="font-semibold text-black">
                      Question {outcomes.chanceQuestionNumber}
                    </span>
                  </div>
                )}
                {outcomes.chanceAnswer !== null && (
                  <div>
                    <span className="text-black/60">Chance Answer: </span>
                    <span className="font-semibold text-black">
                      {outcomes.chanceAnswer}
                    </span>
                  </div>
                )}
                {outcomes.roleplayHatLabel !== null && (
                  <div>
                    <span className="text-black/60">Mimicry Hat Choice: </span>
                    <span className="font-semibold text-black">
                      {outcomes.roleplayHatLabel}
                    </span>
                  </div>
                )}
                {outcomes.roleplayTomResponse !== null && (
                  <div>
                    <span className="text-black/60">Mimicry Tom Response: </span>
                    <span className="font-semibold text-black">
                      {outcomes.roleplayTomResponse}
                    </span>
                  </div>
                )}
                {outcomes.chaosQ1Answer !== null && (
                  <div>
                    <span className="text-black/60">Chaos Q1 Answer: </span>
                    <span className="font-semibold text-black">
                      {outcomes.chaosQ1Answer}
                    </span>
                  </div>
                )}
                {outcomes.chaosQ2Skills.length > 0 && (
                  <div>
                    <span className="text-black/60">Chaos Q2 Answers: </span>
                    <span className="font-semibold text-black">
                      {outcomes.chaosQ2Skills.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Recognition */}
            {hasRecognitionSectionData(outcomes) && (
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                  Recognition
                </h5>
                <div className="flex flex-col gap-1.5 text-sm">
                  {outcomes.recognitionMatchMistakes > 0 && (
                    <div>
                      <span className="text-black/60">Match Mistakes: </span>
                      <span className="font-semibold text-black">
                        {outcomes.recognitionMatchMistakes}
                      </span>
                    </div>
                  )}
                  {outcomes.recognitionReflectionUsed && (
                    <div>
                      <span className="text-black/60">Reflection Box Used: </span>
                      <span className="font-semibold text-black">
                        Yes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Axis (Analysis) */}
            {hasAxisSectionData(outcomes) && (
            <div>
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                Axis
              </h5>
              <div className="flex flex-col gap-1.5 text-sm">
                {(
                  [
                    ["Agency ↔ Fate Q1", outcomes.axisAgencyQ1Choice, AXIS_EXPECTED_LABEL.agencyQ1],
                    ["Agency ↔ Fate Q2", outcomes.axisAgencyQ2Choice, AXIS_EXPECTED_LABEL.agencyQ2],
                    ["Self-intact ↔ Self-dissolved Q1", outcomes.axisSelfQ1Choice, AXIS_EXPECTED_LABEL.selfQ1],
                    ["Self-intact ↔ Self-dissolved Q2", outcomes.axisSelfQ2Choice, AXIS_EXPECTED_LABEL.selfQ2],
                  ] as const
                ).map(([label, choice, expected], idx) => {
                  const status = axisQuestionStatus(choice, expected)
                  if (status === null) return null
                  return (
                    <div key={idx}>
                      <span className="text-black/60">{label}: </span>
                      <span className="font-semibold text-black">{status}</span>
                    </div>
                  )
                })}
                <div>
                  <span className="text-black/60">% correct (of answered): </span>
                  <span className="font-semibold text-black">
                    {formatAxisPercentCorrect(outcomes)}
                  </span>
                </div>
              </div>
            </div>
            )}

            {/* Assessment */}
            {hasAssessmentSectionData(outcomes) && (
            <div>
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                Assessment
              </h5>
              <div className="flex flex-col gap-1.5 text-sm">
                {[0, 1, 2, 3].map((i) => {
                  const row = outcomes.assessmentSituationResults[i]
                  if (!row) return null
                  const chosenPlay = QUADRANT_PLAY_CATEGORY_TILES[row.chosen].label
                  const idealPlay = QUADRANT_PLAY_CATEGORY_TILES[row.ideal].label
                  return (
                    <div key={i}>
                      <span className="text-black/60">Situation {i + 1}: </span>
                      <span className="font-semibold text-black">
                        {`${chosenPlay} (ideal ${idealPlay})`}
                      </span>
                    </div>
                  )
                })}
                <div>
                  <span className="text-black/60">% correct (ideal match, of completed): </span>
                  <span className="font-semibold text-black">
                    {formatAssessmentPercent(outcomes.assessmentSituationResults)}
                  </span>
                </div>
              </div>
            </div>
            )}

            {/* Reflection */}
            {hasReflectionSectionData(outcomes) && (
            <div>
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                Reflection
              </h5>
              <div className="flex flex-col gap-1.5 text-sm">
                <div>
                  <span className="text-black/60">Reflection box used: </span>
                  <span className="font-semibold text-black">
                    Yes
                  </span>
                </div>
              </div>
            </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Interaction Counts - Removed since we're tracking specific items above */}

      {/* xAPI Statements - Collapsible, Starts Collapsed */}
      <CollapsibleSection title={`xAPI Statements (${statements.length})`} defaultOpen={false}>
        <div className="max-h-64 overflow-y-auto rounded border border-black/10 bg-black/[0.02] p-3">
          <pre className="text-xs font-mono text-black/80">
            {JSON.stringify(statements.slice(-5), null, 2)}
          </pre>
        </div>
        <p className="mt-2 text-xs text-black/60">
          Showing last 5 statements. Export JSON to see all.
        </p>
      </CollapsibleSection>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          disabled={statements.length === 0}
        >
          Export to JSON
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={!canClearSession}
        >
          Clear Session
        </Button>
      </div>
    </div>
  )
}
