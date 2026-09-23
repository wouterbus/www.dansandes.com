'use client'

import {useEffect, useRef} from 'react'
import {isGifMedia} from '../lib/isGifMedia'

type HoverPlayMediaProps = {
  src: string
  mimeType?: string | null
  className?: string
  /** Animate/play only while true. */
  active: boolean
}

/**
 * Animated GIFs cannot be paused through the DOM, so the idle state is a canvas
 * holding the first frame and the live image is only mounted while active.
 * Toggling `display` is not enough — browsers keep hidden GIFs animating.
 */
function GifHoverMedia({
  src,
  className,
  active,
}: {
  src: string
  className?: string
  active: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const image = new window.Image()
    const draw = () => {
      if (!image.naturalWidth) return
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext('2d')?.drawImage(image, 0, 0)
    }

    image.addEventListener('load', draw, {once: true})
    image.src = src
    if (image.complete) draw()

    return () => image.removeEventListener('load', draw)
  }, [src])

  return (
    <>
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
      {active && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={className} aria-hidden="true" />
      )}
    </>
  )
}

function VideoHoverMedia({
  src,
  className,
  active,
}: {
  src: string
  className?: string
  active: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (active) {
      void video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [active])

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

export default function HoverPlayMedia({src, mimeType, className, active}: HoverPlayMediaProps) {
  if (isGifMedia(src, mimeType)) {
    return <GifHoverMedia src={src} className={className} active={active} />
  }

  return <VideoHoverMedia src={src} className={className} active={active} />
}
