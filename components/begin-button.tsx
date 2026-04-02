"use client"

import { Button } from "@/components/ui/button"

export function BeginButton() {
  return (
    <Button
      size="lg"
      className="bg-amber-500 text-white hover:bg-amber-600"
      onClick={() => {
        console.log("begin")
      }}
    >
      Begin
    </Button>
  )
}

