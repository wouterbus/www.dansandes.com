'use client'

import {useEffect, useRef} from 'react'
import {
  PortableTextBlock,
  renderHeadingText,
} from '../lib/renderHeadingText'
import LoopingMedia from './LoopingMedia'

type ParallaxVideoSectionProps = {
  title?: PortableTextBlock[]
  videoUrl?: string
  videoMimeType?: string | null
  videoAlt?: string
}

const DEFAULT_TITLE = [
  {text: 'UNIVERSOS CRIATIVOS SOB MEDIDA ', accent: false},
  {text: 'PARA CADA DESAFIO', accent: true, color: 'purple' as const},
]

export default function ParallaxVideoSection({
  title,
  videoUrl,
  videoMimeType,
  videoAlt,
}: ParallaxVideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    if (!section || !media) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let frame = 0

    const update = () => {
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight
      const total = rect.height + viewportH
      const progress = (viewportH - rect.top) / total
      const clamped = Math.min(1, Math.max(0, progress))
      const offset = (clamped - 0.5) * 18
      media.style.transform = `translate3d(0, ${offset}%, 0) scale(1.12)`
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        update()
        frame = 0
      })
    }

    update()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="video-banner"
      ref={sectionRef}
      className="parallax-video"
      aria-label="Video Banner"
    >
      <div className="parallax-video__viewport">
        {videoUrl ? (
          <div ref={mediaRef} className="parallax-video__media">
            <LoopingMedia
              className="parallax-video__video"
              src={videoUrl}
              mimeType={videoMimeType}
              alt={videoAlt || 'Background video'}
            />
          </div>
        ) : (
          <div className="parallax-video__media parallax-video__media--empty">
            <span>Adicione um vídeo no Sanity</span>
          </div>
        )}
        <div className="parallax-video__scrim" aria-hidden="true" />
      </div>

      <div className="parallax-video__content site-container">
        <div className="section__content parallax-video__text">
          <h2>{renderHeadingText(title, DEFAULT_TITLE, {legacyStrongColor: 'purple'})}</h2>
        </div>
      </div>
    </section>
  )
}
