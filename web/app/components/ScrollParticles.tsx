'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import type {ScrollParticleConfig} from '../lib/particleConfigs'
import {useSplashComplete} from '../lib/useSplashComplete'
import {getSplashHasFinished} from '../lib/splash'

type ScrollParticlesProps = {
  particles: ScrollParticleConfig[]
  className?: string
}

type MotionState = {
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
}

const ENTRANCE_DURATION_MS = 850
const ENTRANCE_STAGGER_MS = 90

function hashOffset(id: string, salt = 0): number {
  let hash = salt
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 10000) / 10000
}

function lerpRange(min: number, max: number, t: number): number {
  return min + (max - min) * t
}

function smoothDamp(current: number, target: number, dt: number, smoothness = 10): number {
  const t = 1 - Math.exp(-smoothness * dt)
  return current + (target - current) * t
}

function resolveParticle(
  particle: ScrollParticleConfig,
  isMobile: boolean,
): ScrollParticleConfig | null {
  if (particle.mobileOnly && !isMobile) return null

  if (isMobile) {
    if (particle.hideOnMobile || particle.mobile?.hide) return null

    if (particle.mobile) {
      const {mobile, ...base} = particle
      return {
        ...base,
        size: mobile.size ?? base.size,
        top: mobile.top ?? base.top,
        left: mobile.left ?? base.left,
        right: mobile.right ?? base.right,
        bottom: mobile.bottom ?? base.bottom,
        speed: mobile.speed ?? base.speed * 0.5,
        drift: mobile.drift ?? (base.drift ?? 28) * 0.45,
        scaleMin: Math.max(base.scaleMin, 0.88),
        scaleMax: Math.min(base.scaleMax, 1.18),
      }
    }

    return {
      ...particle,
      speed: particle.speed * 0.5,
      drift: (particle.drift ?? 28) * 0.45,
      scaleMin: Math.max(particle.scaleMin, 0.88),
      scaleMax: Math.min(particle.scaleMax, 1.18),
    }
  }

  if (particle.hideBelow && typeof window !== 'undefined' && window.innerWidth <= particle.hideBelow) {
    return null
  }

  return particle
}

/**
 * Scroll distance measured from the moment this container sits dead-centre in the
 * viewport: negative above, positive below. Using this instead of window.scrollY
 * keeps the parallax anchored to its own section — a global scrollY drags
 * particles hundreds of pixels away from their anchor further down the page.
 * For a full-height section at the top of the document this equals window.scrollY,
 * so the hero keeps its original feel.
 */
function localScrollFor(rect: DOMRect, viewportHeight: number): number {
  return viewportHeight / 2 - (rect.top + rect.height / 2)
}

function computeTargets(
  particle: ScrollParticleConfig,
  localScroll: number,
  scrollY: number,
  index: number,
  isMobile: boolean,
) {
  const offset = hashOffset(particle.id, index)
  const drift = particle.drift ?? 28
  const rotateMax = particle.rotate ?? 10
  // Ramps motion in once the visitor starts scrolling, so the top of the page
  // renders exactly as designed. Deliberately global, not section-local.
  const scrollInfluence = Math.min(1, scrollY / (isMobile ? 420 : 300))
  const motionMix = isMobile ? 0.55 : 1

  const translateY = localScroll * particle.speed * motionMix
  const translateX =
    (Math.sin(localScroll * 0.00072 + offset * Math.PI * 2) * drift +
      Math.sin(localScroll * 0.00035 + offset * 4.1) * (drift * 0.35)) *
    scrollInfluence *
    motionMix

  const rotation =
    Math.sin(localScroll * 0.00042 + offset * Math.PI * 2) * rotateMax * scrollInfluence * motionMix

  const scaleWave = (Math.sin(localScroll * 0.00095 + offset * Math.PI * 2) + 1) / 2
  const scale =
    1 +
    scrollInfluence *
      motionMix *
      (lerpRange(particle.scaleMin, particle.scaleMax, scaleWave) - 1)

  // Solid fill only — never fade particles while scrolling.
  return {x: translateX, y: translateY, scale, rotation, opacity: 1}
}

export default function ScrollParticles({particles, className = ''}: ScrollParticlesProps) {
  const splashComplete = useSplashComplete()
  const containerRef = useRef<HTMLDivElement>(null)
  const motionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const statesRef = useRef<Map<string, MotionState>>(new Map())
  const skipEntranceRef = useRef(
    typeof window !== 'undefined' && getSplashHasFinished(),
  )
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [entranceDone, setEntranceDone] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 960px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setIsMobile(mobileQuery.matches)
      setReducedMotion(motionQuery.matches)
    }

    sync()
    mobileQuery.addEventListener('change', sync)
    motionQuery.addEventListener('change', sync)

    return () => {
      mobileQuery.removeEventListener('change', sync)
      motionQuery.removeEventListener('change', sync)
    }
  }, [])

  const visibleParticles = useMemo(
    () =>
      particles
        .map((particle) => resolveParticle(particle, isMobile))
        .filter((particle): particle is ScrollParticleConfig => particle !== null),
    [particles, isMobile],
  )

  useEffect(() => {
    if (!splashComplete) {
      setEntranceDone(false)
      return
    }

    if (reducedMotion || skipEntranceRef.current) {
      setEntranceDone(true)
      return
    }

    setEntranceDone(false)
    const totalMs =
      ENTRANCE_DURATION_MS +
      Math.max(0, visibleParticles.length - 1) * ENTRANCE_STAGGER_MS

    const timer = window.setTimeout(() => setEntranceDone(true), totalMs)
    return () => window.clearTimeout(timer)
  }, [splashComplete, reducedMotion, visibleParticles.length])

  useEffect(() => {
    if (!splashComplete || !entranceDone || reducedMotion || visibleParticles.length === 0) {
      return
    }

    let frame = 0
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now

      const container = containerRef.current
      if (!container) {
        frame = window.requestAnimationFrame(tick)
        return
      }

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const rect = container.getBoundingClientRect()
      const localScroll = localScrollFor(rect, viewportHeight)
      // Off-screen sections jump straight to their target so they are already
      // correctly placed when scrolled into view, instead of easing in from stale values.
      const inView = rect.bottom > -240 && rect.top < viewportHeight + 240

      visibleParticles.forEach((particle, index) => {
        const motionEl = motionRefs.current.get(particle.id)
        if (!motionEl) return

        const targets = computeTargets(particle, localScroll, scrollY, index, isMobile)
        const prev = statesRef.current.get(particle.id) ?? {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
        }

        const next: MotionState = inView
          ? {
              x: smoothDamp(prev.x, targets.x, dt, 9),
              y: smoothDamp(prev.y, targets.y, dt, 8),
              scale: smoothDamp(prev.scale, targets.scale, dt, 7),
              rotation: smoothDamp(prev.rotation, targets.rotation, dt, 8),
              opacity: 1,
            }
          : targets

        statesRef.current.set(particle.id, next)

        motionEl.style.transform = `translate3d(${next.x.toFixed(2)}px, ${next.y.toFixed(2)}px, 0) scale(${next.scale.toFixed(4)}) rotate(${next.rotation.toFixed(2)}deg)`
        motionEl.style.opacity = '1'
      })

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [splashComplete, entranceDone, reducedMotion, visibleParticles, isMobile])

  if (!splashComplete || visibleParticles.length === 0) return null

  const isEntering = !entranceDone && !reducedMotion

  return (
    <div
      ref={containerRef}
      className={`scroll-particles${isEntering ? ' scroll-particles--entering' : ' scroll-particles--ready'} ${className}`.trim()}
      aria-hidden="true"
    >
      {visibleParticles.map((particle, index) => {
        return (
          <div
            key={particle.id}
            className={`scroll-particle${isEntering ? ' scroll-particle--revealing' : ''}`}
            style={{
              width: particle.size,
              height: particle.size,
              top: particle.top,
              left: particle.left,
              right: particle.right,
              bottom: particle.bottom,
              zIndex: particle.zIndex,
              ['--particle-reveal-delay' as string]: `${index * ENTRANCE_STAGGER_MS}ms`,
            }}
          >
            <div
              ref={(node) => {
                if (node) motionRefs.current.set(particle.id, node)
                else motionRefs.current.delete(particle.id)
              }}
              className="scroll-particle__motion"
              style={{backgroundColor: particle.color}}
            />
          </div>
        )
      })}
    </div>
  )
}
