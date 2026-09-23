'use client'

import {forwardRef, useEffect, useImperativeHandle, useRef, type Ref} from 'react'
import {isGifMedia} from '../lib/isGifMedia'

type LoopingMediaProps = {
  src: string
  mimeType?: string | null
  className?: string
  alt?: string
  onPlay?: () => void
  onPause?: () => void
  /** Fired when the browser cannot decode the file's video track. */
  onUnsupported?: () => void
}

const LoopingMedia = forwardRef(function LoopingMedia(
  {src, mimeType, className, alt, onPlay, onPause, onUnsupported}: LoopingMediaProps,
  ref: Ref<HTMLVideoElement>,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement, [])

  const reportUnsupported = useRef(onUnsupported)
  reportUnsupported.current = onUnsupported

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    /**
     * A .mov holding ProRes or HEVC still loads and "plays" its audio track, so
     * the only reliable tell is metadata arriving with no frame dimensions.
     * The check also runs on mount because an autoplaying video often reaches
     * that point before hydration can attach the listener.
     */
    const check = () => {
      if (video.readyState >= 1 && video.videoWidth === 0) reportUnsupported.current?.()
    }
    const fail = () => reportUnsupported.current?.()

    check()
    video.addEventListener('loadedmetadata', check)
    video.addEventListener('error', fail)

    return () => {
      video.removeEventListener('loadedmetadata', check)
      video.removeEventListener('error', fail)
    }
  }, [src])

  if (isGifMedia(src, mimeType)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} className={className} alt={alt || ''} loading="eager" decoding="async" />
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      aria-label={alt}
      onPlay={onPlay}
      onPause={onPause}
    />
  )
})

export default LoopingMedia
