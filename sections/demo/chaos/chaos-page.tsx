"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { DemoStyleLayout, DEMO_MAIN_WIDE } from "@/sections/demo/demo-outline-layout"
import {
  demoActivityHeadingClassName,
  demoMintSelectionSurfaceClassName,
  demoPrimaryCtaNarrowClassName,
  demoStageChaosQ1ClassName,
  demoStageChaosQ2ClassName,
} from "@/sections/demo/demo-ui"
import { shuffleArray } from "@/sections/demo/shuffle-array"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { KeyboardKey } from "@/components/keyboard-key"

/** Q1 — four teaching-style options (copy not specified; plausible defaults). */
const Q1_OPTIONS = [
  "Structured & clear",
  "Flexible & adaptive",
  "Creative & lively",
  "Calm & supportive",
] as const

const Q2_SKILLS = [
  "Speaking",
  "Listening",
  "Reading",
  "Writing",
  "Vocabulary",
  "Grammar",
  "Pronunciation",
] as const

/** Normalised safe rectangle (% of container); options placed in quadrants with jitter. */
const SAFE = { minL: 6, maxL: 78, minT: 12, maxT: 72 }

type Quadrant = { minL: number; maxL: number; minT: number; maxT: number }

const QUADRANTS: Quadrant[] = [
  { minL: SAFE.minL, maxL: 48, minT: SAFE.minT, maxT: 48 },
  { minL: 52, maxL: SAFE.maxL, minT: SAFE.minT, maxT: 48 },
  { minL: SAFE.minL, maxL: 48, minT: 52, maxT: SAFE.maxT },
  { minL: 52, maxL: SAFE.maxL, minT: 52, maxT: SAFE.maxT },
]

function randRange(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function useQ1Placements() {
  const [placements] = React.useState(() => {
    const order = shuffleArray([...Q1_OPTIONS])
    const quadOrder = shuffleArray([0, 1, 2, 3])
    return order.map((label, i) => {
      const q = QUADRANTS[quadOrder[i]!]!
      return {
        label,
        left: randRange(q.minL, q.maxL - 26),
        top: randRange(q.minT, q.maxT - 14),
        rotate: randRange(-11, 11),
      }
    })
  })
  return placements
}

/** Inner bounds (% of box) for Q2 label centres — keeps pills away from edges after translate(-50%,-50%). */
const Q2_BOUNDS = { minX: 13, maxX: 87, minY: 14, maxY: 86 } as const

/** Speed halves about every this many seconds (frame-rate–independent damping). Larger = slower coast-down. */
const Q2_VEL_HALF_LIFE_S = 22
/** Below this (% coords / sec), velocity is snapped to zero. */
const Q2_VEL_EPS = 0.22
/** Axis-aligned hit box: full width as fraction of arena width (matches long labels better than a circle). */
const Q2_PILL_HIT_WIDTH_FRAC = 0.065
/** Full height as fraction of arena height. */
const Q2_PILL_HIT_HEIGHT_FRAC = 0.05
/** Minimum half-extents in px — tuned to match rendered pills (often dominates over frac×arena on desktop). */
const Q2_PILL_HALF_W_MIN_PX = 40
const Q2_PILL_HALF_H_MIN_PX = 32
/** Continue chip in the arena — slightly larger hit box than skill pills. */
const Q2_CONTINUE_HIT_WIDTH_FRAC = 0.2
const Q2_CONTINUE_HIT_HEIGHT_FRAC = 0.062
const Q2_CONTINUE_HALF_W_MIN_PX = 100
const Q2_CONTINUE_HALF_H_MIN_PX = 26
/** Pairwise collision solver iterations per frame (reduces tunneling when several overlap). */
const Q2_COLLISION_PASSES = 4
/** Below 1: wall bounces bleed speed so labels slow to a rest with damping. */
const Q2_WALL_RESTITUTION = 0.82
/** When all motion has damped to zero, brief impulses on Continue so overlaps can separate (cap applies). */
const Q2_CONTINUE_SETTLE_MAX_NUDGES = 12
const Q2_CONTINUE_SETTLE_SPEED = 2.0

type Vec2 = { x: number; y: number }

function pctToPx(p: Vec2, w: number, h: number) {
  return { x: (p.x / 100) * w, y: (p.y / 100) * h }
}

function pxToPct(p: { x: number; y: number }, w: number, h: number): Vec2 {
  return { x: (p.x / w) * 100, y: (p.y / h) * 100 }
}

function velPctToPx(v: Vec2, w: number, h: number) {
  return { x: (v.x / 100) * w, y: (v.y / 100) * h }
}

function velPxToPct(v: { x: number; y: number }, w: number, h: number): Vec2 {
  return { x: (v.x / w) * 100, y: (v.y / h) * 100 }
}

function clampQ2CentresToBounds(pos: Vec2[]) {
  for (const p of pos) {
    p.x = Math.min(Q2_BOUNDS.maxX, Math.max(Q2_BOUNDS.minX, p.x))
    p.y = Math.min(Q2_BOUNDS.maxY, Math.max(Q2_BOUNDS.minY, p.y))
  }
}

function resolveQ2PairwiseCollisions(
  pos: Vec2[],
  vels: Vec2[],
  aw: number,
  ah: number,
  halfWEach: number[],
  halfHEach: number[]
) {
  const n = pos.length

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const pi = pctToPx(pos[i]!, aw, ah)
      const pj = pctToPx(pos[j]!, aw, ah)
      const dx = pj.x - pi.x
      const dy = pj.y - pi.y
      const sumW = halfWEach[i]! + halfWEach[j]!
      const sumH = halfHEach[i]! + halfHEach[j]!
      const overlapX = sumW - Math.abs(dx)
      const overlapY = sumH - Math.abs(dy)
      if (overlapX <= 0 || overlapY <= 0) continue

      const vi = velPctToPx(vels[i]!, aw, ah)
      const vj = velPctToPx(vels[j]!, aw, ah)

      if (overlapX < overlapY) {
        const corr = overlapX * 0.5
        if (dx > 0) {
          pi.x -= corr
          pj.x += corr
        } else if (dx < 0) {
          pi.x += corr
          pj.x -= corr
        } else {
          const s = (i + j) % 2 === 0 ? 1 : -1
          pi.x -= corr * s
          pj.x += corr * s
        }
        const nx = dx >= 0 ? 1 : -1
        const velAlong = (vi.x - vj.x) * nx
        if (velAlong > 0) {
          vi.x -= velAlong * nx
          vj.x += velAlong * nx
        }
      } else {
        const corr = overlapY * 0.5
        if (dy > 0) {
          pi.y -= corr
          pj.y += corr
        } else if (dy < 0) {
          pi.y += corr
          pj.y -= corr
        } else {
          const s = (i + j) % 2 === 0 ? 1 : -1
          pi.y -= corr * s
          pj.y += corr * s
        }
        const ny = dy >= 0 ? 1 : -1
        const velAlong = (vi.y - vj.y) * ny
        if (velAlong > 0) {
          vi.y -= velAlong * ny
          vj.y += velAlong * ny
        }
      }

      pos[i] = pxToPct(pi, aw, ah)
      pos[j] = pxToPct(pj, aw, ah)
      vels[i] = velPxToPct(vi, aw, ah)
      vels[j] = velPxToPct(vj, aw, ah)
    }
  }
}

function randomQ2Velocity(): Vec2 {
  const angle = Math.random() * Math.PI * 2
  const speed = 28 + Math.random() * 36
  return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }
}

function randomQ2PositionInBounds(): Vec2 {
  return {
    x: randRange(Q2_BOUNDS.minX + 5, Q2_BOUNDS.maxX - 5),
    y: randRange(Q2_BOUNDS.minY + 5, Q2_BOUNDS.maxY - 5),
  }
}

function randomQ2Motion(): { positions: Vec2[]; velocities: Vec2[] } {
  const positions: Vec2[] = []
  const velocities: Vec2[] = []
  for (let i = 0; i < Q2_SKILLS.length; i++) {
    positions.push(randomQ2PositionInBounds())
    velocities.push(randomQ2Velocity())
  }
  return { positions, velocities }
}

export type ChaosPageProps = {
  /** After Q2 — leaves Chaos for Recognition (carries Q1 choice and Q2 skill picks into match outcomes). */
  onContinue?: (payload?: { chaosQ1Answer: string | null; chaosSkills: readonly string[] }) => void
}

export function ChaosPage({ onContinue }: ChaosPageProps) {
  const q1Placements = useQ1Placements()
  const [step, setStep] = React.useState<0 | 1>(0)
  const [q1Choice, setQ1Choice] = React.useState<string | null>(null)
  const [q2Selected, setQ2Selected] = React.useState<Set<string>>(() => new Set())

  const [q2Positions, setQ2Positions] = React.useState<Vec2[]>(() =>
    Q2_SKILLS.map(() => ({ x: 50, y: 50 }))
  )
  const q2VelRef = React.useRef<Vec2[]>(Q2_SKILLS.map(() => ({ x: 0, y: 0 })))
  const q2ArenaRef = React.useRef<HTMLDivElement | null>(null)
  const q2PrevSelSizeRef = React.useRef(0)
  const q2ContinueSettleNudgesRef = React.useRef(0)
  const rafRef = React.useRef<number>(0)
  const lastRef = React.useRef<number | null>(null)

  const toggleQ2Skill = React.useCallback((skill: string) => {
    setQ2Selected((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }, [])

  const handleContinue = React.useCallback(() => {
    if (step !== 1 || q2Selected.size === 0 || !onContinue) return
    onContinue({ chaosQ1Answer: q1Choice, chaosSkills: Array.from(q2Selected).sort() })
  }, [step, q2Selected, onContinue, q1Choice])

  // Enable Enter/Spacebar for Continue button in Q2 (but NOT for toggling skills)
  useKeyboardNavigation({
    onSubmit: step === 1 && q2Selected.size > 0 && onContinue ? handleContinue : undefined,
    enableSubmitKeys: step === 1, // Only enable Enter/Space in Q2, and only for Continue
  })

  // Keyboard controls for Q1 - number keys 1-4 for the randomly positioned options
  React.useEffect(() => {
    if (step !== 0) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return

      const key = event.key
      let optionIndex = -1

      if (key === '1') optionIndex = 0
      else if (key === '2') optionIndex = 1
      else if (key === '3') optionIndex = 2
      else if (key === '4') optionIndex = 3

      if (optionIndex !== -1 && q1Placements[optionIndex]) {
        event.preventDefault()
        const placement = q1Placements[optionIndex]!
        setQ1Choice(placement.label)
        setQ2Selected(new Set())
        setStep(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [step, q1Placements])

  // Keyboard controls for Q2 - number keys 1-7 for skills
  React.useEffect(() => {
    if (step !== 1) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return

      const key = event.key
      let skillIndex = -1

      if (key === '1') skillIndex = 0
      else if (key === '2') skillIndex = 1
      else if (key === '3') skillIndex = 2
      else if (key === '4') skillIndex = 3
      else if (key === '5') skillIndex = 4
      else if (key === '6') skillIndex = 5
      else if (key === '7') skillIndex = 6

      if (skillIndex !== -1 && Q2_SKILLS[skillIndex]) {
        event.preventDefault()
        toggleQ2Skill(Q2_SKILLS[skillIndex]!)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [step, toggleQ2Skill])

  React.useEffect(() => {
    if (step !== 1) {
      q2PrevSelSizeRef.current = 0
      return
    }
    const sz = q2Selected.size
    const prev = q2PrevSelSizeRef.current
    q2PrevSelSizeRef.current = sz

    if (sz > 0 && prev === 0) {
      q2ContinueSettleNudgesRef.current = 0
      setQ2Positions((p) => {
        if (p.length > Q2_SKILLS.length) return p
        q2VelRef.current = [...q2VelRef.current.slice(0, Q2_SKILLS.length), randomQ2Velocity()]
        return [...p.slice(0, Q2_SKILLS.length), randomQ2PositionInBounds()]
      })
      return
    }
    if (sz === 0 && prev > 0) {
      setQ2Positions((p) => {
        if (p.length <= Q2_SKILLS.length) return p
        q2VelRef.current = q2VelRef.current.slice(0, Q2_SKILLS.length)
        return p.slice(0, Q2_SKILLS.length)
      })
    }
  }, [step, q2Selected.size])

  React.useEffect(() => {
    if (step !== 1) return

    q2ContinueSettleNudgesRef.current = 0
    const { positions, velocities } = randomQ2Motion()
    q2VelRef.current = velocities
    setQ2Positions(positions)
    lastRef.current = null

    const loop = (now: number) => {
      if (lastRef.current === null) lastRef.current = now
      const dt = Math.min(0.05, (now - lastRef.current) / 1000)
      lastRef.current = now

      const damp = Math.pow(0.5, dt / Q2_VEL_HALF_LIFE_S)
      const vel = q2VelRef.current

      const arena = q2ArenaRef.current
      const aw = arena?.clientWidth ?? 800
      const ah = arena?.clientHeight ?? 600
      const pillHalfW = Math.max(Q2_PILL_HALF_W_MIN_PX, (aw * Q2_PILL_HIT_WIDTH_FRAC) / 2)
      const pillHalfH = Math.max(Q2_PILL_HALF_H_MIN_PX, (ah * Q2_PILL_HIT_HEIGHT_FRAC) / 2)
      const continueHalfW = Math.max(Q2_CONTINUE_HALF_W_MIN_PX, (aw * Q2_CONTINUE_HIT_WIDTH_FRAC) / 2)
      const continueHalfH = Math.max(Q2_CONTINUE_HALF_H_MIN_PX, (ah * Q2_CONTINUE_HIT_HEIGHT_FRAC) / 2)

      setQ2Positions((prev) => {
        const pos = prev.map((p) => ({ x: p.x, y: p.y }))
        const n = pos.length
        while (vel.length < n) vel.push(randomQ2Velocity())
        if (vel.length > n) vel.length = n

        const halfWEach = Array.from({ length: n }, (_, i) =>
          i < Q2_SKILLS.length ? pillHalfW : continueHalfW
        )
        const halfHEach = Array.from({ length: n }, (_, i) =>
          i < Q2_SKILLS.length ? pillHalfH : continueHalfH
        )

        for (let i = 0; i < n; i++) {
          let x = pos[i]!.x + vel[i]!.x * dt
          let y = pos[i]!.y + vel[i]!.y * dt
          let vx = vel[i]!.x
          let vy = vel[i]!.y

          if (x < Q2_BOUNDS.minX) {
            x = Q2_BOUNDS.minX
            vx = Math.abs(vx) * Q2_WALL_RESTITUTION
          } else if (x > Q2_BOUNDS.maxX) {
            x = Q2_BOUNDS.maxX
            vx = -Math.abs(vx) * Q2_WALL_RESTITUTION
          }
          if (y < Q2_BOUNDS.minY) {
            y = Q2_BOUNDS.minY
            vy = Math.abs(vy) * Q2_WALL_RESTITUTION
          } else if (y > Q2_BOUNDS.maxY) {
            y = Q2_BOUNDS.maxY
            vy = -Math.abs(vy) * Q2_WALL_RESTITUTION
          }

          vx *= damp
          vy *= damp
          if (Math.abs(vx) < Q2_VEL_EPS) vx = 0
          if (Math.abs(vy) < Q2_VEL_EPS) vy = 0

          vel[i] = { x: vx, y: vy }
          pos[i] = { x, y }
        }

        for (let p = 0; p < Q2_COLLISION_PASSES; p++) {
          resolveQ2PairwiseCollisions(pos, vel, aw, ah, halfWEach, halfHEach)
          clampQ2CentresToBounds(pos)
        }

        return pos
      })

      const allStopped = vel.every((v) => v.x === 0 && v.y === 0)
      if (allStopped) {
        const nudgeCap = q2ContinueSettleNudgesRef.current
        if (
          vel.length > Q2_SKILLS.length &&
          nudgeCap < Q2_CONTINUE_SETTLE_MAX_NUDGES
        ) {
          q2ContinueSettleNudgesRef.current = nudgeCap + 1
          const c = vel.length - 1
          const s = Q2_CONTINUE_SETTLE_SPEED
          vel[c] = {
            x: (Math.random() - 0.5) * 2 * s,
            y: (Math.random() - 0.5) * 2 * s,
          }
          rafRef.current = requestAnimationFrame(loop)
          return
        }
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [step])

  const showContinueInArena = q2Selected.size > 0

  return (
    <DemoStyleLayout mainClassName={DEMO_MAIN_WIDE}>
      <div className="flex w-full flex-col items-center gap-8">
        {step === 0 && (
          <div className="flex w-full flex-col gap-6">
            <h2 className={demoActivityHeadingClassName}>How would you describe your teaching?</h2>

            <div className={demoStageChaosQ1ClassName}>
              {q1Placements.map((p, idx) => {
                const selected = q1Choice === p.label
                return (
                  <button
                    key={p.label}
                    type="button"
                    style={{
                      left: `${p.left}%`,
                      top: `${p.top}%`,
                      transform: `rotate(${p.rotate}deg)`,
                    }}
                    className={cn(
                      "absolute max-w-[min(48%,26rem)] rounded-2xl border px-5 py-4 text-left text-base font-semibold leading-snug shadow-[0_4px_18px_rgba(0,0,0,0.1)] transition-[background-color,border-color,box-shadow,transform] sm:px-6 sm:py-5 sm:text-lg md:px-8 md:py-6 md:text-xl",
                      selected
                        ? demoMintSelectionSurfaceClassName
                        : "z-1 border-2 border-black/25 bg-white text-black hover:border-black/45 hover:bg-black/3"
                    )}
                    onClick={() => {
                      setQ1Choice(p.label)
                      setQ2Selected(new Set())
                      setStep(1)
                    }}
                    aria-label={`${p.label} - Press ${idx + 1}`}
                  >
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-gray-500/80 text-sm font-semibold text-white">
                      {idx + 1}
                    </span>
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex w-full flex-col gap-6">
            <h2 className="text-center text-2xl font-bold leading-snug text-black sm:text-3xl md:text-4xl">
              Which skills do you find most enjoyable to teach?
            </h2>

            <div ref={q2ArenaRef} className={demoStageChaosQ2ClassName}>
              {Q2_SKILLS.map((skill, i) => {
                const { x, y } = q2Positions[i]!
                const selected = q2Selected.has(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className={cn(
                      "absolute whitespace-nowrap rounded-full border-2 px-6 py-3.5 text-base font-semibold leading-snug shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-[background-color,border-color,box-shadow] sm:px-8 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl",
                      selected
                        ? "z-20 border-black bg-[#b8caf5] text-black ring-2 ring-black/25"
                        : "z-10 border-black/35 bg-white/95 text-black hover:border-black/50 hover:bg-white"
                    )}
                    onClick={() => toggleQ2Skill(skill)}
                    aria-label={`${skill} - Press ${i + 1}`}
                  >
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md bg-gray-500/80 text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    {skill}
                  </button>
                )
              })}
              {showContinueInArena &&
                onContinue &&
                q2Positions.length > Q2_SKILLS.length && (
                  <button
                    type="button"
                    style={{
                      left: `${q2Positions[Q2_SKILLS.length]!.x}%`,
                      top: `${q2Positions[Q2_SKILLS.length]!.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className={cn(
                      demoPrimaryCtaNarrowClassName,
                      "absolute z-30 w-max max-w-[min(92%,22rem)] min-w-[min(88vw,12rem)] shrink-0"
                    )}
                    onClick={handleContinue}
                  >
                    Continue <KeyboardKey keyLabel="ENTER" className="ml-2" />
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </DemoStyleLayout>
  )
}
