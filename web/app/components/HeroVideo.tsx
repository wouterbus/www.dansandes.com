'use client'

import {useRef, useState} from 'react'
import {isGifMedia} from '../lib/isGifMedia'
import LoopingMedia from './LoopingMedia'

type HeroVideoProps = {
  videoUrl: string
  videoMimeType?: string | null
  alt?: string
}

export default function HeroVideo({videoUrl, videoMimeType, alt}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasAudio, setHasAudio] = useState(false)
  const isGif = isGifMedia(videoUrl, videoMimeType)

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const unmute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setHasAudio(true)
    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="circle-media">
      <div className="circle-media__ring" aria-hidden="true" />
      <div className="circle-media__fill">
        <LoopingMedia
          ref={videoRef}
          className="hero__video"
          src={videoUrl}
          mimeType={videoMimeType}
          alt={alt || 'Hero reel'}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {!isGif && (
          <>
            <button
              type="button"
              className="hero__play-btn"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <span className="hero__play-icon hero__play-icon--pause" />
              ) : (
                <span className="hero__play-icon hero__play-icon--play" />
              )}
              <span className="hero__play-label">
                {isPlaying ? 'Pause' : 'Play the Video'}
              </span>
            </button>
            {!hasAudio && (
              <button
                type="button"
                className="hero__unmute-btn"
                onClick={unmute}
                aria-label="Unmute video"
              >
                Sound on
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
