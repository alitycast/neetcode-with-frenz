import type { CSSProperties } from 'react'
import problemsData from '../data/problems.json'
import { participants } from '../data/participants'
import { isParticipantConfigured, type Problem } from '../types'
import { accentClasses, getParticipantAccent } from '../utils/participantColors'

const problems = problemsData as Problem[]

interface SparkleProps {
  className?: string
  style?: CSSProperties
}

export function Sparkle({ className = '', style }: SparkleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1.5c.4 4.2 1.4 7 3 8.9 1.6 1.9 4 2.9 7.5 3.1-3.5.2-5.9 1.2-7.5 3.1-1.6 1.9-2.6 4.7-3 8.9-.4-4.2-1.4-7-3-8.9-1.6-1.9-4-2.9-7.5-3.1 3.5-.2 5.9-1.2 7.5-3.1 1.6-1.9 2.6-4.7 3-8.9z"
        fill="currentColor"
      />
    </svg>
  )
}

// Roberts' R2 low-discrepancy sequence: an even, non-repeating scatter
// across the viewport without resorting to Math.random (positions stay
// stable across re-renders as completion data changes).
const R2_A = 0.7548776662466927
const R2_B = 0.5698402909980532

const starLayout = participants.flatMap((_, participantIndex) =>
  problems.map((_, problemIndex) => {
    const i = participantIndex * problems.length + problemIndex
    return {
      participantIndex,
      problemIndex,
      top: `${((0.5 + R2_A * i) % 1) * 100}%`,
      left: `${((0.5 + R2_B * i) % 1) * 100}%`,
      size: 2 + (i % 3),
      delay: `${(i % 10) * 0.4}s`,
      duration: `${3.5 + (i % 6) * 0.5}s`,
    }
  }),
)

interface StarfieldBackgroundProps {
  completionByParticipant: Record<string, Set<string>>
}

/**
 * One star per (participant, problem) pair - a sky that fills in as the
 * group collectively solves the NeetCode 150, rather than purely decorative.
 */
export function StarfieldBackground({ completionByParticipant }: StarfieldBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {starLayout.map((star, i) => {
        const participant = participants[star.participantIndex]
        const problem = problems[star.problemIndex]
        const isLit =
          isParticipantConfigured(participant) &&
          Boolean(completionByParticipant[participant.name]?.has(problem.slug))
        const accent = accentClasses[getParticipantAccent(star.participantIndex)]

        return (
          <span
            key={i}
            className={
              isLit
                ? `absolute rounded-full ${accent.dot} motion-safe:animate-[sparkle-twinkle_4s_ease-in-out_infinite]`
                : 'absolute rounded-full bg-slate-500'
            }
            style={{
              top: star.top,
              left: star.left,
              width: isLit ? star.size + 1 : star.size,
              height: isLit ? star.size + 1 : star.size,
              opacity: isLit ? 0.85 : 0.15,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        )
      })}
    </div>
  )
}

interface CelebrationBurstProps {
  className?: string
}

const BURST_ANGLES = [-60, -20, 20, 60, 100]

export function CelebrationBurst({ className = '' }: CelebrationBurstProps) {
  return (
    <span className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {BURST_ANGLES.map((angle, i) => {
        const radians = (angle * Math.PI) / 180
        const distance = 16
        const x = Math.cos(radians) * distance
        const y = Math.sin(radians) * distance
        return (
          <Sparkle
            key={i}
            className={`absolute top-1/2 left-1/2 h-2.5 w-2.5 ${
              ['text-blush', 'text-lavender', 'text-mint', 'text-butter', 'text-blush'][i]
            } motion-safe:animate-[burst-dot_0.7s_ease-out_forwards]`}
            style={
              {
                '--burst-x': `${x}px`,
                '--burst-y': `${y}px`,
                animationDelay: `${i * 40}ms`,
              } as CSSProperties
            }
          />
        )
      })}
    </span>
  )
}
