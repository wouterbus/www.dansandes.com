'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {isGifMedia} from '../lib/isGifMedia'

const PREVIEW_TIME = 1

type CaseStudyMediaProps = {
  videoUrl: string
  videoMimeType?: string | null
  videoAlt?: string
}

function VideoFramePreview({videoUrl, className}: {videoUrl: string; className?: string}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const seekToPreview = () => {
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) return
      const target = Math.min(PREVIEW_TIME, Math.max(0, duration - 0.05))
      if (Math.abs(video.currentTime - target) < 0.05) {
        video.pause()
        return
      }
      video.currentTime = target
    }

    const onLoadedMetadata = () => seekToPreview()
    const onSeeked = () => video.pause()

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)

    if (video.readyState >= 1) seekToPreview()

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
    }
  }, [videoUrl])

  return (
    <video
      ref={videoRef}
      className={className}
      src={videoUrl}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

function CaseStudyVideoModal({
  videoUrl,
  videoAlt,
  onClose,
}: {
  videoUrl: string
  videoAlt?: string
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const video = videoRef.current
    if (video) {
      void video.play().catch(() => {})
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="case-study-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={videoAlt || 'Case video'}
    >
      <button
        type="button"
        className="case-study-modal__close"
        onClick={onClose}
        aria-label="Fechar vídeo"
      >
        ✕
      </button>
      <video
        ref={videoRef}
        className="case-study-modal__video"
        src={videoUrl}
        controls
        autoPlay
        playsInline
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  )
}

export default function CaseStudyMedia({
  videoUrl,
  videoMimeType,
  videoAlt,
}: CaseStudyMediaProps) {
  const [isOpen, setIsOpen] = useState(false)
  const closeModal = useCallback(() => setIsOpen(false), [])

  if (isGifMedia(videoUrl, videoMimeType)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={videoUrl}
        alt={videoAlt || ''}
        className="case-study__video"
      />
    )
  }

  return (
    <>
      <button
        type="button"
        className="case-study__media-trigger"
        onClick={() => setIsOpen(true)}
        aria-label={videoAlt ? `Reproduzir: ${videoAlt}` : 'Reproduzir vídeo'}
      >
        <VideoFramePreview
          videoUrl={videoUrl}
          className="case-study__video case-study__video--poster"
        />
        <span className="case-study__play-overlay" aria-hidden="true">
          <span className="case-study__play-icon">▶</span>
        </span>
      </button>

      {isOpen && (
        <CaseStudyVideoModal
          videoUrl={videoUrl}
          videoAlt={videoAlt}
          onClose={closeModal}
        />
      )}
    </>
  )
}
