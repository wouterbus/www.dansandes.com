'use client'

import {useEffect, useRef, useState} from 'react'
import LoopingMedia from './LoopingMedia'

type HeroVideoProps = {
  videoUrl: string
  videoMimeType?: string | null
  mobileVideoUrl?: string
  mobileVideoMimeType?: string | null
  alt?: string
}

/** Autoplaying loop with no chrome — same presence as an animated GIF. */
export default function HeroVideo({videoUrl, videoMimeType, mobileVideoUrl, mobileVideoMimeType, alt}: HeroVideoProps) {
  const [unsupported, setUnsupported] = useState(false)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = mediaRef.current
    const hero = media?.closest<HTMLElement>('.hero')
    if (!media || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const update = () => {
      const rect = hero.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Skip layout and paint work once the hero is well outside the viewport.
      if (rect.bottom < -160 || rect.top > viewportHeight + 160) return

      const multiplier = window.innerWidth <= 768 ? 0.14 : 0.24
      const offset = Math.min(120, Math.max(0, -rect.top * multiplier))
      media.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
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

  if (unsupported) {
    return (
      <div className="circle-media">
        <div className="circle-media__ring" aria-hidden="true" />
        <div className="circle-media__fill circle-media__fill--empty">
          <span>
            O navegador não consegue reproduzir este ficheiro. Exporte o vídeo em MP4 (H.264) e
            volte a carregá-lo no Sanity.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="circle-media">
      <div className="circle-media__ring" aria-hidden="true" />
      <div className="circle-media__fill">
        <div ref={mediaRef} className="hero__media-parallax">
          <LoopingMedia
            className="hero__video"
            src={videoUrl}
            mimeType={videoMimeType}
            mobileSrc={mobileVideoUrl}
            mobileMimeType={mobileVideoMimeType}
            alt={alt || 'Hero reel'}
            onUnsupported={() => setUnsupported(true)}
          />
        </div>
      </div>
    </div>
  )
}
