'use client'

import {useEffect, useRef, useState} from 'react'

/** Elements that swap the dot for the large white outline ring. */
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  '[role="button"]',
  'input',
  'select',
  'textarea',
  'summary',
  '[data-cursor="link"]',
].join(',')

const FOLLOW_SMOOTHNESS = 26

function smoothDamp(current: number, target: number, dt: number, smoothness: number): number {
  return current + (target - current) * (1 - Math.exp(-smoothness * dt))
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  // Mouse-driven pointers only: never replace a touch or stylus cursor.
  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setEnabled(pointerQuery.matches)

    sync()
    pointerQuery.addEventListener('change', sync)
    return () => pointerQuery.removeEventListener('change', sync)
  }, [])

  // Only hide the native cursor once the replacement is mounted, so a JS
  // failure can never leave the page without any pointer at all.
  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('has-custom-cursor')
    return () => document.body.classList.remove('has-custom-cursor')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const el = cursorRef.current
    if (!el) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    const current = {...target}
    let frame = 0
    let lastTime = performance.now()
    let placed = false
    let isLink = false

    const render = () => {
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`
    }

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY

      if (!placed) {
        placed = true
        current.x = target.x
        current.y = target.y
        render()
        el.classList.add('custom-cursor--visible')
      }

      const node = event.target instanceof Element ? event.target : null
      const nextIsLink = Boolean(node?.closest(INTERACTIVE_SELECTOR))
      if (nextIsLink !== isLink) {
        isLink = nextIsLink
        el.classList.toggle('custom-cursor--link', isLink)
      }

      // Case popups use the case's brand colour as their full-screen
      // background. A dark cursor keeps the default orange cursor visible on
      // the orange case popup without affecting the rest of the site.
      el.classList.toggle('custom-cursor--dark', Boolean(document.querySelector('.case-modal')))

      if (reducedMotion) render()
    }

    const onPointerLeave = () => el.classList.remove('custom-cursor--visible')
    const onPointerEnter = () => {
      if (placed) el.classList.add('custom-cursor--visible')
    }
    const onDown = () => el.classList.add('custom-cursor--active')
    const onUp = () => el.classList.remove('custom-cursor--active')

    window.addEventListener('pointermove', onPointerMove, {passive: true})
    window.addEventListener('pointerdown', onDown, {passive: true})
    window.addEventListener('pointerup', onUp, {passive: true})
    document.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('pointerenter', onPointerEnter)

    if (!reducedMotion) {
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - lastTime) / 1000)
        lastTime = now

        current.x = smoothDamp(current.x, target.x, dt, FOLLOW_SMOOTHNESS)
        current.y = smoothDamp(current.y, target.y, dt, FOLLOW_SMOOTHNESS)
        render()

        frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('pointerenter', onPointerEnter)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor__ring" />
    </div>
  )
}
