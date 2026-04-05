/**
 * xAPI (Experience API) Tracking - Mock Implementation
 *
 * This is a demonstration implementation showing what xAPI tracking
 * could look like. In production, statements would be sent to an LRS
 * (Learning Record Store) endpoint.
 */

export type xAPIVerb =
  | "progressed"
  | "completed"
  | "answered"
  | "selected"
  | "attempted"
  | "interacted"
  | "experienced"

export type xAPIActor = {
  objectType: "Agent"
  name: string
  mbox: string // email in mailto: format
}

export type xAPIVerb_Object = {
  id: string
  display: { "en-US": string }
}

export type xAPIObject = {
  objectType: "Activity"
  id: string
  definition: {
    name: { "en-US": string }
    description?: { "en-US": string }
    type?: string
  }
}

export type xAPIResult = {
  score?: {
    scaled?: number // 0-1
    raw?: number
    min?: number
    max?: number
  }
  success?: boolean
  completion?: boolean
  duration?: string // ISO 8601 duration format
  response?: string
}

export type xAPIContext = {
  contextActivities?: {
    parent?: xAPIObject[]
    grouping?: xAPIObject[]
    category?: xAPIObject[]
    other?: xAPIObject[]
  }
  extensions?: Record<string, unknown>
}

export type xAPIStatement = {
  id: string
  actor: xAPIActor
  verb: xAPIVerb_Object
  object: xAPIObject
  result?: xAPIResult
  context?: xAPIContext
  timestamp: string // ISO 8601 format
}

// In-memory storage for demo purposes
let statements: xAPIStatement[] = []
let sessionId: string | null = null
let sessionStartTime: number | null = null

/**
 * Initialize a new tracking session
 */
export function initializeSession(learnerName: string = "Demo Learner"): string {
  sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
  sessionStartTime = Date.now()
  statements = []

  // Track session start
  trackStatement({
    verb: "experienced",
    objectId: "https://gamification-base.example.com/course",
    objectName: "Gamification E-Learning Course",
    objectDescription: "Interactive course exploring game mechanics in learning",
  })

  return sessionId
}

/**
 * Get the current session ID
 */
export function getSessionId(): string | null {
  return sessionId
}

/**
 * Convert verb string to xAPI verb object
 */
function createVerb(verb: xAPIVerb): xAPIVerb_Object {
  const verbMap: Record<xAPIVerb, { id: string; display: string }> = {
    progressed: {
      id: "http://adlnet.gov/expapi/verbs/progressed",
      display: "progressed",
    },
    completed: {
      id: "http://adlnet.gov/expapi/verbs/completed",
      display: "completed",
    },
    answered: {
      id: "http://adlnet.gov/expapi/verbs/answered",
      display: "answered",
    },
    selected: {
      id: "http://adlnet.gov/expapi/verbs/selected",
      display: "selected",
    },
    attempted: {
      id: "http://adlnet.gov/expapi/verbs/attempted",
      display: "attempted",
    },
    interacted: {
      id: "http://adlnet.gov/expapi/verbs/interacted-with",
      display: "interacted",
    },
    experienced: {
      id: "http://adlnet.gov/expapi/verbs/experienced",
      display: "experienced",
    },
  }

  const verbData = verbMap[verb]
  return {
    id: verbData.id,
    display: { "en-US": verbData.display },
  }
}

/**
 * Create an xAPI actor (learner)
 */
function createActor(name: string = "Demo Learner"): xAPIActor {
  return {
    objectType: "Agent",
    name,
    mbox: `mailto:${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  }
}

/**
 * Track a generic xAPI statement
 */
export function trackStatement(params: {
  verb: xAPIVerb
  objectId: string
  objectName: string
  objectDescription?: string
  objectType?: string
  result?: xAPIResult
  context?: xAPIContext
  learnerName?: string
}): xAPIStatement {
  const statement: xAPIStatement = {
    id: `statement-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    actor: createActor(params.learnerName),
    verb: createVerb(params.verb),
    object: {
      objectType: "Activity",
      id: params.objectId,
      definition: {
        name: { "en-US": params.objectName },
        description: params.objectDescription
          ? { "en-US": params.objectDescription }
          : undefined,
        type: params.objectType,
      },
    },
    result: params.result,
    context: params.context,
    timestamp: new Date().toISOString(),
  }

  statements.push(statement)
  return statement
}

/**
 * Track phase/section progression
 */
export function trackPhaseChange(from: string | null, to: string): void {
  trackStatement({
    verb: "progressed",
    objectId: `https://gamification-base.example.com/course/phase/${to}`,
    objectName: `Course Phase: ${to}`,
    objectDescription: from
      ? `Progressed from ${from} to ${to}`
      : `Started course at ${to}`,
    context: {
      contextActivities: {
        parent: [
          {
            objectType: "Activity",
            id: "https://gamification-base.example.com/course",
            definition: {
              name: { "en-US": "Gamification E-Learning Course" },
            },
          },
        ],
      },
      extensions: {
        "https://gamification-base.example.com/extensions/from-phase": from,
        "https://gamification-base.example.com/extensions/session-id": sessionId,
      },
    },
  })
}

/**
 * Track an interaction (click, selection, input)
 */
export function trackInteraction(params: {
  phase: string
  interactionType: string
  data: unknown
}): void {
  trackStatement({
    verb: "interacted",
    objectId: `https://gamification-base.example.com/course/phase/${params.phase}/interaction`,
    objectName: `${params.phase} Interaction`,
    objectDescription: `User interacted with ${params.interactionType}`,
    result: {
      response: JSON.stringify(params.data),
    },
    context: {
      extensions: {
        "https://gamification-base.example.com/extensions/interaction-type":
          params.interactionType,
        "https://gamification-base.example.com/extensions/session-id": sessionId,
      },
    },
  })
}

/**
 * Track time spent on a phase/activity
 */
export function trackTimeOnTask(params: {
  phase: string
  durationMs: number
}): void {
  // Convert milliseconds to ISO 8601 duration format
  const seconds = Math.floor(params.durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const duration = `PT${minutes}M${remainingSeconds}S`

  trackStatement({
    verb: "completed",
    objectId: `https://gamification-base.example.com/course/phase/${params.phase}`,
    objectName: `Course Phase: ${params.phase}`,
    result: {
      duration,
      completion: true,
    },
    context: {
      extensions: {
        "https://gamification-base.example.com/extensions/time-ms":
          params.durationMs,
        "https://gamification-base.example.com/extensions/session-id": sessionId,
      },
    },
  })
}

/**
 * Track an answer or response
 */
export function trackAnswer(params: {
  phase: string
  question: string
  answer: string
  correct?: boolean
}): void {
  trackStatement({
    verb: "answered",
    objectId: `https://gamification-base.example.com/course/phase/${params.phase}/question`,
    objectName: params.question,
    result: {
      response: params.answer,
      success: params.correct,
    },
    context: {
      extensions: {
        "https://gamification-base.example.com/extensions/session-id": sessionId,
      },
    },
  })
}

/**
 * Get all tracked statements
 */
export function getStatements(): xAPIStatement[] {
  return [...statements]
}

/**
 * Get summary statistics
 */
export function getSessionSummary() {
  if (!sessionStartTime) {
    return null
  }

  const now = Date.now()
  const totalDurationMs = now - sessionStartTime

  // Count statement types
  const statementCounts: Record<string, number> = {}
  statements.forEach((statement) => {
    const verb = statement.verb.display["en-US"]
    statementCounts[verb] = (statementCounts[verb] || 0) + 1
  })

  // Get phases visited
  const phasesVisited = new Set<string>()
  statements.forEach((statement) => {
    if (statement.object.id.includes("/phase/")) {
      const match = statement.object.id.match(/\/phase\/([^/]+)/)
      if (match) phasesVisited.add(match[1])
    }
  })

  return {
    sessionId,
    sessionStartTime: new Date(sessionStartTime).toISOString(),
    totalDurationMs,
    totalStatements: statements.length,
    statementCounts,
    phasesVisited: Array.from(phasesVisited),
  }
}

/**
 * Clear all statements (for demo reset)
 */
export function clearStatements(): void {
  statements = []
  sessionId = null
  sessionStartTime = null
}

/**
 * Export statements as JSON
 */
export function exportStatementsJSON(): string {
  return JSON.stringify(statements, null, 2)
}
