"use client"

import { X } from "lucide-react"
import type { CoursePhase } from "@/components/course-nav-panel"
import { AdminNavigation } from "./admin-navigation"
import { AdminTracking } from "./admin-tracking"

type AdminPageProps = {
  currentPhase: CoursePhase
  onNavigate: (phase: CoursePhase) => void
  isOpen: boolean
  onClose: () => void
}

export function AdminPage({ currentPhase, onNavigate, isOpen, onClose }: AdminPageProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Panel — anchor left+right so width follows available space; avoid w-full max-w-7xl + right offset (negative left edge / clipping). */}
      <div
        className="fixed inset-y-0 left-0 right-0 z-50 overflow-y-auto bg-linear-to-br from-slate-50 to-slate-100 shadow-2xl transition-transform md:right-15"
        role="dialog"
        aria-modal="true"
        aria-label="Admin Panel"
      >
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black">Admin Panel</h1>
                <p className="mt-2 text-sm text-black/70">
                  Course navigation and learner tracking dashboard
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-md text-black/60 transition-colors hover:bg-black/10 hover:text-black"
                aria-label="Close admin panel"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
              {/* Left: Navigation */}
              <div className="rounded-lg border border-black/15 bg-white p-6 shadow-sm">
                <AdminNavigation
                  currentPhase={currentPhase}
                  onNavigate={onNavigate}
                  onClose={onClose}
                />
              </div>

              {/* Right: Tracking */}
              <div className="rounded-lg border border-black/15 bg-white p-6 shadow-sm">
                <AdminTracking />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
