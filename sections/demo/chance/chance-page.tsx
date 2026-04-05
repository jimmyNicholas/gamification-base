"use client"

import { CustomChanceEngine } from "@/components/custom-chance-engine"
import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"

export type ChancePageProps = {
  onContinue?: (payload?: { answer: string; questionNumber: number }) => void
}

export function ChancePage({ onContinue }: ChancePageProps) {
  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE}>
      <div className="flex w-full max-w-4xl flex-col items-center gap-6">
        <CustomChanceEngine className="w-full" onContinueAfterResult={onContinue} />
      </div>
    </DemoStyleLayout>
  )
}
