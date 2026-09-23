'use client'

import {useState} from 'react'
import LoopingMedia from './LoopingMedia'

type HeroVideoProps = {
  videoUrl: string
  videoMimeType?: string | null
  alt?: string
}

/** Autoplaying loop with no chrome — same presence as an animated GIF. */
export default function HeroVideo({videoUrl, videoMimeType, alt}: HeroVideoProps) {
  const [unsupported, setUnsupported] = useState(false)

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
        <LoopingMedia
          className="hero__video"
          src={videoUrl}
          mimeType={videoMimeType}
          alt={alt || 'Hero reel'}
          onUnsupported={() => setUnsupported(true)}
        />
      </div>
    </div>
  )
}
