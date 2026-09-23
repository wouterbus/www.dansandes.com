'use client'

import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import {createPortal} from 'react-dom'
import CaseModalLogo from './CaseModalLogo'
import LoopingMedia from './LoopingMedia'
import {isGifMedia, isVideoMedia} from '../lib/isGifMedia'

const PREVIEW_TIME = 1
export const WATCH_LABEL = 'ASSISTIR CASE'

type CaseStudyMediaProps = {
  videoUrl: string
  videoMimeType?: string | null
  videoAlt?: string
  headline?: string
  /** Shown while the video frame loads — critical on iOS where seek can stay blank. */
  posterUrl?: string
  posterMimeType?: string | null
  onOpen: () => void
}

function previewSrc(videoUrl: string) {
  if (videoUrl.includes('#')) return videoUrl
  return `${videoUrl}#t=${PREVIEW_TIME}`
}

export function VideoFramePreview({
  videoUrl,
  posterUrl,
  className,
}: {
  videoUrl: string
  posterUrl?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const seekToPreview = async () => {
      const duration = video.duration
      const target =
        Number.isFinite(duration) && duration > 0
          ? Math.min(PREVIEW_TIME, Math.max(0.05, duration - 0.05))
          : PREVIEW_TIME

      try {
        // iOS Safari often paints a black frame until muted playback has started.
        video.muted = true
        await video.play()
        if (cancelled) return

        if (Math.abs(video.currentTime - target) > 0.05) {
          video.currentTime = target
          await new Promise<void>((resolve) => {
            const done = () => {
              video.removeEventListener('seeked', done)
              resolve()
            }
            video.addEventListener('seeked', done)
            window.setTimeout(done, 500)
          })
        }

        if (cancelled) return
        video.pause()
      } catch {
        try {
          video.currentTime = target
        } catch {
          /* ignore seek errors on restricted mobile codecs */
        }
      }
    }

    const onLoadedMetadata = () => {
      void seekToPreview()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.readyState >= 1) void seekToPreview()

    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.pause()
    }
  }, [videoUrl])

  return (
    <video
      ref={videoRef}
      className={className}
      src={previewSrc(videoUrl)}
      poster={posterUrl || undefined}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

export function CaseVideoModal({
  videoUrl,
  videoAlt,
  label = [],
  headline,
  description,
  colorVar = '--color-red',
  onClose,
  onPrev,
  onNext,
}: {
  videoUrl: string
  videoAlt?: string
  label?: string[]
  headline?: string
  description?: string
  colorVar?: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const paragraphs = description?.split(/\n{2,}/).filter((part) => part.trim()) ?? []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const video = videoRef.current
    const startPlayback = () => {
      // Safari treats a play() call after React has mounted the portal as
      // programmatic. Muted inline playback is permitted on the first visit;
      // viewers can still enable sound through the native controls.
      if (!video) return
      video.muted = true
      void video.play().catch(() => {})
    }

    if (video) {
      video.load()
      startPlayback()
      video.addEventListener('canplay', startPlayback)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev?.()
      if (event.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      video?.removeEventListener('canplay', startPlayback)
    }
  }, [onClose, onPrev, onNext, videoUrl])

  // Portals keep bubbling through the React tree, so without this the click
  // reaches the case row's own onClick and reopens the modal instantly.
  const close = (event: ReactMouseEvent) => {
    event.stopPropagation()
    onClose()
  }

  const goPrev = (event: ReactMouseEvent) => {
    event.stopPropagation()
    onPrev?.()
  }

  const goNext = (event: ReactMouseEvent) => {
    event.stopPropagation()
    onNext?.()
  }

  // Portalled to body: the card sets a z-index stacking context, which would
  // otherwise trap this fixed overlay below the header and later sections.
  return createPortal(
    <div
      className="case-modal"
      style={{'--case-color': `var(${colorVar})`} as CSSProperties}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={headline || videoAlt || 'Case video'}
    >
      {/* Mirrors .site-header__inner so the close button lands exactly where
          the header menu toggle sits. */}
      <div className="case-modal__bar site-container">
        <CaseModalLogo className="case-modal__logo" />

        <button
          type="button"
          className="case-modal__close circle-toggle circle-toggle--close"
          onClick={close}
          aria-label="Fechar vídeo"
        >
          <span className="circle-toggle__line" />
          <span className="circle-toggle__line" />
        </button>
      </div>

      <div className="case-modal__inner" onClick={(event) => event.stopPropagation()}>
        <div className="case-modal__frame">
          <video
            key={videoUrl}
            ref={videoRef}
            className="case-modal__video"
            src={videoUrl}
            controls
            autoPlay
            muted
            playsInline
            preload="auto"
          />
        </div>

        <div className="case-modal__text">
          {label.length > 0 && (
            <p className="case-modal__label">
              {label.map((item, index) => (
                <span key={`${item}-${index}`} className="case-study__label-item">
                  {item}
                </span>
              ))}
            </p>
          )}

          {headline && <h3 className="case-modal__title">{headline}</h3>}

          {paragraphs.map((paragraph, index) => (
            <p key={index} className="case-modal__paragraph">
              {paragraph}
            </p>
          ))}

          {(onPrev || onNext) && (
            <div className="case-modal__nav-row">
              {onPrev && (
                <button
                  type="button"
                  className="case-modal__nav case-modal__nav--prev"
                  onClick={goPrev}
                  aria-label="Case anterior"
                  data-cursor="link"
                >
                  <span className="case-modal__chevron" aria-hidden="true" />
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  className="case-modal__nav case-modal__nav--next"
                  onClick={goNext}
                  aria-label="Próximo case"
                  data-cursor="link"
                >
                  <span className="case-modal__chevron" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function CaseStudyMedia({
  videoUrl,
  videoMimeType,
  videoAlt,
  headline,
  posterUrl,
  posterMimeType,
  onOpen,
}: CaseStudyMediaProps) {
  if (isGifMedia(videoUrl, videoMimeType)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={videoUrl} alt={videoAlt || ''} className="case-study__video" />
    )
  }

  const preview = posterUrl ? (
    isVideoMedia(posterUrl, posterMimeType) ? (
      <LoopingMedia
        src={posterUrl}
        mimeType={posterMimeType}
        alt={videoAlt || ''}
        className="case-study__video case-study__video--poster"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={posterUrl}
        alt={videoAlt || ''}
        className="case-study__video case-study__video--poster"
      />
    )
  ) : (
    <VideoFramePreview
      videoUrl={videoUrl}
      className="case-study__video case-study__video--poster"
    />
  )

  return (
    <button
      type="button"
      className="case-study__media-trigger"
      onClick={onOpen}
      aria-label={headline ? `${WATCH_LABEL}: ${headline}` : WATCH_LABEL}
    >
      {preview}
      <span className="case-study__play-overlay" aria-hidden="true">
        <span className="case-study__play-icon">▶</span>
        <span className="case-study__play-label">{WATCH_LABEL}</span>
      </span>
    </button>
  )
}
