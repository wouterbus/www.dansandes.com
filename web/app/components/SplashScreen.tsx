'use client'

import {useEffect, useRef, useState} from 'react'
import {getSplashHasFinished, markSplashFinished} from '../lib/splash'
import LogoMark, {LOGO_FRAMES} from './LogoMark'

const FRAME_MS = 110
const MIN_SPLASH_MS = 600
const MAX_SPLASH_MS = 1000
const FADE_MS = 250
const CYCLES = 1.5

export default function SplashScreen() {
  const [visible, setVisible] = useState(!getSplashHasFinished())
  const [playing, setPlaying] = useState(!getSplashHasFinished())
  const [fading, setFading] = useState(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    if (getSplashHasFinished()) {
      document.body.classList.remove('splash-active')
      return
    }

    document.body.classList.add('splash-active')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animMs = reducedMotion
      ? 0
      : Math.ceil(LOGO_FRAMES.length * FRAME_MS * CYCLES)
    const displayMs = reducedMotion
      ? 350
      : Math.max(MIN_SPLASH_MS, Math.min(animMs + 80, MAX_SPLASH_MS))

    const addTimer = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms)
      timersRef.current.push(id)
    }

    const finish = () => {
      if (getSplashHasFinished()) return
      markSplashFinished()
      setPlaying(false)
      setFading(true)

      addTimer(() => {
        setVisible(false)
        document.body.classList.remove('splash-active')
      }, FADE_MS)
    }

    addTimer(finish, displayMs)

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
      timersRef.current = []
      document.body.classList.remove('splash-active')
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`splash${fading ? ' splash--out' : ''}`}
      aria-hidden={fading}
      role="presentation"
    >
      <LogoMark playing={playing} size={120} className="splash__logo" priority />
    </div>
  )
}
