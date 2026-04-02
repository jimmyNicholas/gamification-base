import type React from "react"

import type { ContinueRule } from "@/lib/storyboard-component-contracts"

export type CourseSection = {
  id: string
  title: string
  body: React.ReactNode
  continueLabel?: string
  continueRule?: ContinueRule
  continueDelayMs?: number
  continueSignalId?: string
  noBack?: boolean
  triggerCompletionXapiOnReferences?: boolean
}
