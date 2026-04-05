/**
 * xAPI Session Tracking Extension
 *
 * Extends the existing DemoMatchOutcomes session storage pattern
 * with xAPI metadata tracking.
 */

import type { DemoMatchOutcomes } from "@/sections/demo/match-the-four/demo-match-outcomes"

export type PhaseTimestamp = {
  phase: string
  enteredAt: number // timestamp in ms
  exitedAt?: number // timestamp in ms
  durationMs?: number
}

export type xAPISessionMetadata = {
  sessionId: string
  sessionStartTime: number // timestamp in ms
  phaseHistory: PhaseTimestamp[]
  interactionCounts: Record<string, number>
  totalInteractions: number
}

const XAPI_SESSION_KEY = "gamification-base:xapi-session"

/**
 * Initialize xAPI session tracking
 */
export function initializeXAPISession(sessionId: string): xAPISessionMetadata {
  const metadata: xAPISessionMetadata = {
    sessionId,
    sessionStartTime: Date.now(),
    phaseHistory: [],
    interactionCounts: {},
    totalInteractions: 0,
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(XAPI_SESSION_KEY, JSON.stringify(metadata))
  }

  return metadata
}

/**
 * Load xAPI session metadata from storage
 */
export function loadXAPISessionMetadata(): xAPISessionMetadata | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.sessionStorage.getItem(XAPI_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as xAPISessionMetadata
  } catch {
    return null
  }
}

/**
 * Save xAPI session metadata to storage
 */
export function saveXAPISessionMetadata(
  metadata: xAPISessionMetadata
): void {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(XAPI_SESSION_KEY, JSON.stringify(metadata))
  } catch (error) {
    console.error("Failed to save xAPI session metadata:", error)
  }
}

/**
 * Track entering a new phase
 */
export function trackPhaseEntry(phase: string): void {
  const metadata = loadXAPISessionMetadata()
  if (!metadata) return

  // Close out the previous phase if one exists
  if (metadata.phaseHistory.length > 0) {
    const lastPhase = metadata.phaseHistory[metadata.phaseHistory.length - 1]
    if (lastPhase && !lastPhase.exitedAt) {
      const now = Date.now()
      lastPhase.exitedAt = now
      lastPhase.durationMs = now - lastPhase.enteredAt
    }
  }

  // Add the new phase
  metadata.phaseHistory.push({
    phase,
    enteredAt: Date.now(),
  })

  saveXAPISessionMetadata(metadata)
}

/**
 * Track an interaction in the current phase
 */
export function trackPhaseInteraction(
  phase: string,
  interactionType: string = "click"
): void {
  const metadata = loadXAPISessionMetadata()
  if (!metadata) return

  const key = `${phase}:${interactionType}`
  metadata.interactionCounts[key] = (metadata.interactionCounts[key] || 0) + 1
  metadata.totalInteractions += 1

  saveXAPISessionMetadata(metadata)
}

/**
 * Get time spent in current phase
 */
export function getCurrentPhaseDuration(): number | null {
  const metadata = loadXAPISessionMetadata()
  if (!metadata || metadata.phaseHistory.length === 0) return null

  const lastPhase = metadata.phaseHistory[metadata.phaseHistory.length - 1]
  if (!lastPhase) return null

  if (lastPhase.durationMs !== undefined) {
    return lastPhase.durationMs
  }

  return Date.now() - lastPhase.enteredAt
}

/**
 * Get total session duration
 */
export function getTotalSessionDuration(): number | null {
  const metadata = loadXAPISessionMetadata()
  if (!metadata) return null

  return Date.now() - metadata.sessionStartTime
}

/**
 * Get summary of phase timings
 */
export function getPhaseSummary(): Array<{
  phase: string
  durationMs: number
  durationFormatted: string
}> {
  const metadata = loadXAPISessionMetadata()
  if (!metadata) return []

  return metadata.phaseHistory
    .filter((p) => p.durationMs !== undefined)
    .map((p) => ({
      phase: p.phase,
      durationMs: p.durationMs!,
      durationFormatted: formatDuration(p.durationMs!),
    }))
}

/**
 * Format duration in ms to readable string
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${seconds}s`
  }

  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Get interaction summary
 */
export function getInteractionSummary(): Array<{
  phase: string
  type: string
  count: number
}> {
  const metadata = loadXAPISessionMetadata()
  if (!metadata) return []

  return Object.entries(metadata.interactionCounts).map(([key, count]) => {
    const [phase, type] = key.split(":")
    return {
      phase: phase || "unknown",
      type: type || "unknown",
      count,
    }
  })
}

/**
 * Clear xAPI session (for demo reset)
 */
export function clearXAPISession(): void {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(XAPI_SESSION_KEY)
}

/**
 * Combine demo outcomes with xAPI metadata for complete session view
 */
export function getCompleteSessionData(
  demoOutcomes: DemoMatchOutcomes | null
): {
  outcomes: DemoMatchOutcomes | null
  xapiMetadata: xAPISessionMetadata | null
  phaseSummary: ReturnType<typeof getPhaseSummary>
  interactionSummary: ReturnType<typeof getInteractionSummary>
  totalDuration: number | null
} {
  const metadata = loadXAPISessionMetadata()

  return {
    outcomes: demoOutcomes,
    xapiMetadata: metadata,
    phaseSummary: getPhaseSummary(),
    interactionSummary: getInteractionSummary(),
    totalDuration: getTotalSessionDuration(),
  }
}
