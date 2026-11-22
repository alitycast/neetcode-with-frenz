import { useEffect, useId, useRef } from 'react'

const MESSAGES = [
  'do it scared',
  'we got this! ✨',
  'one problem at a time',
  'progress > perfection',
  'you can do hard things',
  'just start',
]

const PREFIX = '✨ · ˚ * '
const SUFFIX = ' * ˚ · ✨'

const CHAIN_LENGTH = 16
const EASE = 0.18
const IDLE_FADE_DELAY_MS = 500
const IDLE_FADE_DURATION_MS = 3200
const PHRASE_ROTATE_INTERVAL_MS = 6000
const TEXT_TAIL_PADDING = 6
const AMBIENT_FRACTIONS = [0.12, 0.28, 0.46, 0.64, 0.8, 0.94]

const TAP_MOVE_THRESHOLD_PX = 10
const TAP_MAX_DURATION_MS = 300
const TAP_BURST_ANGLES = [-60, -20, 20, 60, 100]
const TAP_BURST_DISTANCE = 14
const TAP_BURST_ANIMATION = 'tap-spark 0.55s ease-out forwards'

interface Point {
  x: number
  y: number
}

/**
 * A shooting star whose tail is one continuously-reshaped SVG path (a chain
 * of points easing toward the pointer, each lagging the one before it). The
 * motivational phrase rides that same path via <textPath>, so the browser's
 * own text layout bends and rotates each glyph to the path's tangent - no
 * per-letter math, no bubble/label element.
 *
 * Desktop uses plain mousemove, unchanged. Touch/pen input is handled
 * separately via Pointer Events so a quick tap (no drag) gets a small spark
 * burst instead of the full trail, and lifting a finger fades the trail
 * immediately rather than waiting out the idle delay.
 */
export function CursorTrail() {
  const pathId = useId()
  const groupRef = useRef<SVGGElement>(null)
  const corePathRef = useRef<SVGPathElement>(null)
  const glowPathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGCircleElement>(null)
  const haloRef = useRef<SVGCircleElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const phraseTspanRef = useRef<SVGTSpanElement>(null)
  const ambientRefs = useRef<(SVGTextElement | null)[]>([])
  const tapBurstRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) return

    const group = groupRef.current
    const corePath = corePathRef.current
    const glowPath = glowPathRef.current
    const head = headRef.current
    const halo = haloRef.current
    const textEl = textRef.current
    const textPathEl = textPathRef.current
    const phraseTspan = phraseTspanRef.current
    if (!group || !corePath || !glowPath || !head || !halo || !textEl || !textPathEl || !phraseTspan) {
      return
    }

    const nodes: Point[] = Array.from({ length: CHAIN_LENGTH }, () => ({ x: -200, y: -200 }))
    let target: Point | null = null
    let lastMoveTime = 0
    let lastPhraseChangeTime = 0
    let phraseIndex = 0
    let currentAlpha = 0
    let rafId = 0
    let running = false

    phraseTspan.textContent = MESSAGES[phraseIndex]

    const resetNodesTo = (x: number, y: number) => {
      for (const node of nodes) {
        node.x = x
        node.y = y
      }
    }

    const advance = (x: number, y: number) => {
      const wasSettled = performance.now() - lastMoveTime > IDLE_FADE_DELAY_MS + IDLE_FADE_DURATION_MS
      target = { x, y }
      lastMoveTime = performance.now()

      if (wasSettled) {
        phraseIndex = (phraseIndex + 1) % MESSAGES.length
        phraseTspan.textContent = MESSAGES[phraseIndex]
        lastPhraseChangeTime = performance.now()
      }
      if (!running) {
        running = true
        rafId = requestAnimationFrame(tick)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (nodes[0].x === -200) resetNodesTo(event.clientX, event.clientY)
      advance(event.clientX, event.clientY)
    }

    // --- touch / pen, via Pointer Events - desktop mouse is untouched above ---
    let activePointerId: number | null = null
    let pointerDownX = 0
    let pointerDownY = 0
    let pointerDownTime = 0
    let isDragging = false

    const triggerTapBurst = (x: number, y: number) => {
      TAP_BURST_ANGLES.forEach((angle, i) => {
        const dot = tapBurstRefs.current[i]
        if (!dot) return
        const radians = (angle * Math.PI) / 180
        dot.setAttribute('cx', String(x + Math.cos(radians) * TAP_BURST_DISTANCE))
        dot.setAttribute('cy', String(y + Math.sin(radians) * TAP_BURST_DISTANCE))
        dot.style.animation = 'none'
        void dot.getBoundingClientRect()
        dot.style.animation = TAP_BURST_ANIMATION
      })
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || activePointerId !== null) return
      activePointerId = event.pointerId
      pointerDownX = event.clientX
      pointerDownY = event.clientY
      pointerDownTime = performance.now()
      isDragging = false
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerId !== activePointerId) return
      const dx = event.clientX - pointerDownX
      const dy = event.clientY - pointerDownY

      if (!isDragging) {
        if (Math.hypot(dx, dy) <= TAP_MOVE_THRESHOLD_PX) return
        isDragging = true
        resetNodesTo(event.clientX, event.clientY)
      }
      advance(event.clientX, event.clientY)
    }

    const endTouch = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerId !== activePointerId) return
      const duration = performance.now() - pointerDownTime
      const moved = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY)

      if (!isDragging && moved <= TAP_MOVE_THRESHOLD_PX && duration <= TAP_MAX_DURATION_MS) {
        triggerTapBurst(event.clientX, event.clientY)
      } else if (isDragging) {
        // skip the idle wait and start the gentle fade right away
        lastMoveTime = performance.now() - IDLE_FADE_DELAY_MS
      }
      activePointerId = null
      isDragging = false
    }

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick)

      if (target) {
        nodes[0].x += (target.x - nodes[0].x) * EASE
        nodes[0].y += (target.y - nodes[0].y) * EASE
        for (let i = 1; i < nodes.length; i++) {
          nodes[i].x += (nodes[i - 1].x - nodes[i].x) * EASE
          nodes[i].y += (nodes[i - 1].y - nodes[i].y) * EASE
        }
      }

      const idleTime = now - lastMoveTime
      const targetAlpha =
        idleTime < IDLE_FADE_DELAY_MS
          ? 1
          : Math.max(0, 1 - (idleTime - IDLE_FADE_DELAY_MS) / IDLE_FADE_DURATION_MS)
      currentAlpha += (targetAlpha - currentAlpha) * 0.08

      if (now - lastPhraseChangeTime > PHRASE_ROTATE_INTERVAL_MS && idleTime < IDLE_FADE_DELAY_MS) {
        phraseIndex = (phraseIndex + 1) % MESSAGES.length
        phraseTspan.textContent = MESSAGES[phraseIndex]
        lastPhraseChangeTime = now
      }

      if (currentAlpha < 0.01) {
        group.style.opacity = '0'
        if (targetAlpha === 0) {
          running = false
          cancelAnimationFrame(rafId)
        }
        return
      }
      group.style.opacity = String(currentAlpha)

      // tail -> head order so textPath reads chronologically (oldest ink first)
      let d = `M ${nodes[nodes.length - 1].x} ${nodes[nodes.length - 1].y}`
      for (let i = nodes.length - 2; i > 0; i--) {
        const midX = (nodes[i].x + nodes[i - 1].x) / 2
        const midY = (nodes[i].y + nodes[i - 1].y) / 2
        d += ` Q ${nodes[i].x} ${nodes[i].y} ${midX} ${midY}`
      }
      d += ` L ${nodes[0].x} ${nodes[0].y}`
      corePath.setAttribute('d', d)
      glowPath.setAttribute('d', d)

      head.setAttribute('cx', String(nodes[0].x))
      head.setAttribute('cy', String(nodes[0].y))
      halo.setAttribute('cx', String(nodes[0].x))
      halo.setAttribute('cy', String(nodes[0].y))

      const totalLength = corePath.getTotalLength()
      const textLength = textEl.getComputedTextLength()
      const startOffset = Math.max(0, totalLength - textLength - TEXT_TAIL_PADDING)
      textPathEl.setAttribute('startOffset', String(startOffset))

      for (let i = 0; i < AMBIENT_FRACTIONS.length; i++) {
        const el = ambientRefs.current[i]
        if (!el) continue
        const point = corePath.getPointAtLength(totalLength * AMBIENT_FRACTIONS[i])
        const twinkle = 0.3 + 0.5 * Math.abs(Math.sin(now / 600 + i * 1.3))
        el.setAttribute('x', String(point.x))
        el.setAttribute('y', String(point.y))
        el.setAttribute('opacity', String(twinkle))
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerup', endTouch, { passive: true })
    window.addEventListener('pointercancel', endTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endTouch)
      window.removeEventListener('pointercancel', endTouch)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full" aria-hidden="true">
      <g ref={groupRef} style={{ opacity: 0 }}>
        <path ref={glowPathRef} fill="none" stroke="#f6b9d2" strokeWidth="4.5" strokeLinecap="round" opacity="0.2" />
        <path
          ref={corePathRef}
          id={pathId}
          fill="none"
          stroke="#f6b9d2"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {AMBIENT_FRACTIONS.map((_, i) => (
          <text
            key={i}
            ref={(el) => {
              ambientRefs.current[i] = el
            }}
            fontSize="9"
            textAnchor="middle"
            fill="#ffd977"
          >
            ✦
          </text>
        ))}

        <circle ref={haloRef} r="7" fill="#f6b9d2" opacity="0.25" />
        <circle ref={headRef} r="2.5" fill="#fbe3ee" />

        <text ref={textRef} fontSize="15" fontWeight="600" className="font-display">
          <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">
            <tspan fill="#ffd977">{PREFIX}</tspan>
            <tspan ref={phraseTspanRef} fill="#c3b2f2" />
            <tspan fill="#ffd977">{SUFFIX}</tspan>
          </textPath>
        </text>
      </g>

      {/* tap spark burst - independent of the trail's own fade state */}
      {TAP_BURST_ANGLES.map((_, i) => (
        <circle
          key={i}
          ref={(el) => {
            tapBurstRefs.current[i] = el
          }}
          r="2"
          fill="#f6b9d2"
          opacity="0"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}
    </svg>
  )
}
