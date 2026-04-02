"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Vec2 = { x: number; y: number }

const BOUNDS = { minX: 14, maxX: 86, minY: 16, maxY: 84 } as const
/** Larger = gentler coast-down before velocity snaps to zero. */
const VEL_HALF_LIFE_S = 22
const VEL_EPS = 0.22
const COLLISION_PASSES = 3
/** Below 1: wall hits bleed energy so pills can settle instead of staying hot. */
const WALL_RESTITUTION = 0.78
const PILL_HIT_WIDTH_FRAC = 0.14
const PILL_HIT_HEIGHT_FRAC = 0.1
const PILL_HALF_W_MIN_PX = 22
const PILL_HALF_H_MIN_PX = 12

function randRange(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function randomVelocity(): Vec2 {
  const angle = Math.random() * Math.PI * 2
  const speed = 20 + Math.random() * 32
  return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }
}

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

function clampCentres(pos: Vec2[]) {
  for (const p of pos) {
    p.x = Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, p.x))
    p.y = Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, p.y))
  }
}

function resolvePairwiseCollisions(
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

function initialMotion(n: number): { positions: Vec2[]; velocities: Vec2[] } {
  const positions: Vec2[] = []
  const velocities: Vec2[] = []
  for (let i = 0; i < n; i++) {
    positions.push({
      x: randRange(BOUNDS.minX + 6, BOUNDS.maxX - 6),
      y: randRange(BOUNDS.minY + 6, BOUNDS.maxY - 6),
    })
    velocities.push(randomVelocity())
  }
  return { positions, velocities }
}

/** Matches Chaos Q2 unselected skill buttons, scaled for the card. */
const microQ2PillClassName = cn(
  "pointer-events-none absolute z-10 max-w-[min(92%,9rem)] whitespace-nowrap rounded-full border-2 border-black/35 bg-white/95 text-black",
  "px-3 py-1.5 text-[0.7rem] font-semibold leading-snug shadow-[0_4px_18px_rgba(0,0,0,0.12)]",
  "sm:px-3.5 sm:py-2 sm:text-xs"
)

/** Sized to 90% of parent; same surface as `MatchEmojiCard` (`bg-white`), no inner frame border. */
const microArenaShellClassName =
  "relative aspect-4/3 w-[90%] max-h-[90%] min-h-0 min-w-0 overflow-hidden rounded-xl bg-white"

const microArenaOuterClassName = "flex h-full w-full min-h-0 items-center justify-center"

export type ChaosSkillsMicroArenaProps = {
  skills: readonly string[]
  className?: string
}

export function ChaosSkillsMicroArena({ skills, className }: ChaosSkillsMicroArenaProps) {
  const arenaRef = React.useRef<HTMLDivElement>(null)
  const velRef = React.useRef<Vec2[]>([])
  const [positions, setPositions] = React.useState<Vec2[]>([])
  const skillsKey = skills.join("\0")

  React.useEffect(() => {
    if (skills.length === 0) {
      velRef.current = []
      setPositions([])
      return
    }
    const { positions: pos, velocities: vel } = initialMotion(skills.length)
    velRef.current = vel
    setPositions(pos)
  }, [skillsKey, skills.length])

  const lastRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (skills.length === 0) return

    lastRef.current = null
    let raf = 0
    const motionStoppedRef = { current: false }

    const loop = (now: number) => {
      if (lastRef.current === null) lastRef.current = now
      const dt = Math.min(0.05, (now - lastRef.current) / 1000)
      lastRef.current = now

      const arena = arenaRef.current
      const aw = Math.max(1, arena?.clientWidth ?? 160)
      const ah = Math.max(1, arena?.clientHeight ?? 120)

      const pillHalfW = Math.max(PILL_HALF_W_MIN_PX, (aw * PILL_HIT_WIDTH_FRAC) / 2)
      const pillHalfH = Math.max(PILL_HALF_H_MIN_PX, (ah * PILL_HIT_HEIGHT_FRAC) / 2)
      const halfWEach = Array.from({ length: skills.length }, () => pillHalfW)
      const halfHEach = Array.from({ length: skills.length }, () => pillHalfH)

      setPositions((prev) => {
        if (prev.length !== skills.length) return prev
        const pos = prev.map((p) => ({ ...p }))
        const vel = velRef.current
        while (vel.length < pos.length) vel.push(randomVelocity())
        vel.length = pos.length

        const damp = Math.pow(0.5, dt / VEL_HALF_LIFE_S)

        for (let i = 0; i < pos.length; i++) {
          let x = pos[i]!.x + vel[i]!.x * dt
          let y = pos[i]!.y + vel[i]!.y * dt
          let vx = vel[i]!.x
          let vy = vel[i]!.y

          const hwPct = (pillHalfW / aw) * 100
          const hhPct = (pillHalfH / ah) * 100

          if (x < BOUNDS.minX + hwPct) {
            x = BOUNDS.minX + hwPct
            vx = Math.abs(vx) * WALL_RESTITUTION
          } else if (x > BOUNDS.maxX - hwPct) {
            x = BOUNDS.maxX - hwPct
            vx = -Math.abs(vx) * WALL_RESTITUTION
          }
          if (y < BOUNDS.minY + hhPct) {
            y = BOUNDS.minY + hhPct
            vy = Math.abs(vy) * WALL_RESTITUTION
          } else if (y > BOUNDS.maxY - hhPct) {
            y = BOUNDS.maxY - hhPct
            vy = -Math.abs(vy) * WALL_RESTITUTION
          }

          vx *= damp
          vy *= damp
          if (Math.abs(vx) < VEL_EPS) vx = 0
          if (Math.abs(vy) < VEL_EPS) vy = 0

          vel[i] = { x: vx, y: vy }
          pos[i] = { x, y }
        }

        for (let p = 0; p < COLLISION_PASSES; p++) {
          resolvePairwiseCollisions(pos, vel, aw, ah, halfWEach, halfHEach)
          clampCentres(pos)
        }

        velRef.current = vel
        motionStoppedRef.current = vel.every((v) => v.x === 0 && v.y === 0)
        return pos
      })

      if (!motionStoppedRef.current) {
        raf = requestAnimationFrame(loop)
      }
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [skills.length, skillsKey])

  if (skills.length === 0) return null

  return (
    <div className={cn(microArenaOuterClassName, className)} aria-hidden>
      <div ref={arenaRef} className={microArenaShellClassName}>
        {skills.map((skill, i) => {
          const { x, y } = positions[i] ?? { x: 50, y: 50 }
          return (
            <span
              key={`${skillsKey}-${i}-${skill}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className={microQ2PillClassName}
            >
              {skill}
            </span>
          )
        })}
      </div>
    </div>
  )
}
