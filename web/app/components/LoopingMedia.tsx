'use client'

import {forwardRef, type Ref} from 'react'
import {isGifMedia} from '../lib/isGifMedia'

type LoopingMediaProps = {
  src: string
  mimeType?: string | null
  className?: string
  alt?: string
  onPlay?: () => void
  onPause?: () => void
}

const LoopingMedia = forwardRef(function LoopingMedia(
  {src, mimeType, className, alt, onPlay, onPause}: LoopingMediaProps,
  ref: Ref<HTMLVideoElement>,
) {
  if (isGifMedia(src, mimeType)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} className={className} alt={alt || ''} loading="eager" decoding="async" />
    )
  }

  return (
    <video
      ref={ref}
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
