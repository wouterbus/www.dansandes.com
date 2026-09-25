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
  mobileVideoUrl?: string
  mobileVideoMimeType?: string | null
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
  mobileVideoUrl,
  mobileVideoMimeType,
  videoAlt,
}: ParallaxVideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    const viewport = viewportRef.current
    if (!section || !media || !viewport) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      // Counter the section's document movement: the video stays visually
      // anchored to the viewport while the section's mask passes across it.
      media.style.transform = `translate3d(0, ${motion.matches ? 0 : -rect.top}px, 0)`
    }
    const measure = () => {
      const asset = media.querySelector('video, img')
      const width = asset instanceof HTMLVideoElement ? asset.videoWidth : asset instanceof HTMLImageElement ? asset.naturalWidth : 0
      const height = asset instanceof HTMLVideoElement ? asset.videoHeight : asset instanceof HTMLImageElement ? asset.naturalHeight : 0
      if (!width || !height) return
      // The video fills the screen behind the smaller, original banner mask.
      // Preserve its proportions; never stretch it into the mask's dimensions.
      const windowHeight = motion.matches ? viewport.getBoundingClientRect().height : window.innerHeight
      const renderedWidth = Math.max(section.clientWidth, windowHeight * width / height)
      media.style.width = `${renderedWidth}px`
      media.style.left = `${(section.clientWidth - renderedWidth) / 2}px`
      update()
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        update()
        frame = 0
      })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(media)
    media.addEventListener('loadedmetadata', measure, true)
    media.addEventListener('load', measure, true)
    motion.addEventListener('change', measure)
    measure()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', measure)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      observer.disconnect()
      media.removeEventListener('loadedmetadata', measure, true)
      media.removeEventListener('load', measure, true)
      motion.removeEventListener('change', measure)
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
      <div ref={viewportRef} className="parallax-video__sticky">
      <div className="parallax-video__viewport">
        {videoUrl ? (
          <div ref={mediaRef} className="parallax-video__media">
            <LoopingMedia
              className="parallax-video__video"
              src={videoUrl}
              mimeType={videoMimeType}
              mobileSrc={mobileVideoUrl}
              mobileMimeType={mobileVideoMimeType}
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
      </div>
      <style jsx global>{`
        #video-banner.parallax-video { --video-window-height: min(68svh, 620px); height: var(--video-window-height); min-height: 0; overflow: hidden; }
        #video-banner .parallax-video__sticky { position: relative; height: var(--video-window-height); overflow: hidden; }
        #video-banner .parallax-video__media { inset: auto; top: 0; left: 0; width: 100%; height: auto; will-change: transform; }
        #video-banner .parallax-video__video { width: 100%; height: auto; object-fit: contain; display: block; }
        #video-banner .parallax-video__media--empty { height: 100%; }
        @media (max-width: 960px) {
          #video-banner.parallax-video { --video-window-height: min(46svh, 360px); }
        }
        @media (prefers-reduced-motion: reduce) {
          #video-banner .parallax-video__sticky { position: relative; height: 100%; }
          #video-banner .parallax-video__media { transform: none !important; }
        }
      `}</style>
    </section>
  )
}
