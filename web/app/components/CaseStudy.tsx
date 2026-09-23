'use client'

import Image from 'next/image'
import {useCallback, useEffect, useState, type CSSProperties} from 'react'
import CaseStudyMedia from './CaseStudyMedia'
import LoopingMedia from './LoopingMedia'
import ScrollParticles from './ScrollParticles'
import {buildCaseParticle} from '../lib/particleConfigs'
import {isGifMedia, isVideoMedia} from '../lib/isGifMedia'
import {brandColorVar, type BrandColor} from '../lib/brandColor'

/** Below this the row stacks, and only the thumbnail itself opens the video. */
const ROW_CLICK_QUERY = '(min-width: 1081px)'

export type CaseStudyData = {
  _key?: string
  internalName?: string
  thumbUrl?: string
  thumbMimeType?: string | null
  thumbAlt?: string
  label?: string[]
  headline?: string
  shortDescription?: string
  tags?: string[]
  description?: string
  clientLogoUrl?: string
  clientLogoAlt?: string
  videoUrl?: string
  videoMimeType?: string | null
  videoAlt?: string
  videoPosterUrl?: string
  videoPosterMimeType?: string | null
  brandColor?: BrandColor | string
}

type CaseStudyProps = {
  caseStudy: CaseStudyData
  index?: number
  onOpenVideo: () => void
}

export default function CaseStudy({caseStudy, index = 0, onOpenVideo}: CaseStudyProps) {
  const [rowClickable, setRowClickable] = useState(false)

  const colorVar = brandColorVar(caseStudy.brandColor)
  const label = caseStudy.label ?? []
  const tags = caseStudy.tags ?? []
  const particle = buildCaseParticle(
    caseStudy._key || caseStudy.internalName || `case-${index}`,
    index,
    colorVar,
  )

  const hasPlayableVideo = Boolean(
    caseStudy.videoUrl && !isGifMedia(caseStudy.videoUrl, caseStudy.videoMimeType),
  )

  useEffect(() => {
    const query = window.matchMedia(ROW_CLICK_QUERY)
    const sync = () => setRowClickable(query.matches)

    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const openVideo = useCallback(() => {
    if (hasPlayableVideo) onOpenVideo()
  }, [hasPlayableVideo, onOpenVideo])

  const rowOpens = rowClickable && hasPlayableVideo

  return (
    <article
      className={`case-study${rowOpens ? ' case-study--clickable' : ''}`}
      style={{'--case-color': `var(${colorVar})`} as CSSProperties}
      onClick={rowOpens ? openVideo : undefined}
      data-cursor={rowOpens ? 'link' : undefined}
    >
      <ScrollParticles className="case-study__particles" particles={[particle]} />

      {caseStudy.thumbUrl && (
        <div className="case-study__thumb">
          <div className="case-study__thumb-fill">
            {isVideoMedia(caseStudy.thumbUrl, caseStudy.thumbMimeType) ||
            isGifMedia(caseStudy.thumbUrl, caseStudy.thumbMimeType) ? (
              <LoopingMedia
                src={caseStudy.thumbUrl}
                mimeType={caseStudy.thumbMimeType}
                alt={caseStudy.thumbAlt || ''}
                className="case-study__thumb-media"
              />
            ) : (
              <Image
                src={caseStudy.thumbUrl}
                alt={caseStudy.thumbAlt || ''}
                fill
                sizes="(max-width: 1080px) 60vw, 260px"
                className="case-study__thumb-img"
              />
            )}
          </div>
          {caseStudy.clientLogoUrl && (
            <div className="case-study__client-logo">
              <Image
                src={caseStudy.clientLogoUrl}
                alt={caseStudy.clientLogoAlt || ''}
                width={104}
                height={104}
                sizes="104px"
                className="case-study__client-logo-img"
              />
            </div>
          )}
        </div>
      )}

      <div className="case-study__content">
        {label.length > 0 && (
          <p className="case-study__label">
            {label.map((item, itemIndex) => (
              <span key={`${item}-${itemIndex}`} className="case-study__label-item">
                {item}
              </span>
            ))}
          </p>
        )}

        {caseStudy.headline && <h3 className="case-study__title">{caseStudy.headline}</h3>}

        {caseStudy.shortDescription && (
          <p className="case-study__summary">{caseStudy.shortDescription}</p>
        )}

        {tags.length > 0 && (
          <ul className="case-study__tags">
            {tags.map((tag, tagIndex) => (
              <li key={`${tag}-${tagIndex}`} className="case-study__tag">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {caseStudy.videoUrl && (
        <div className="case-study__media">
          <CaseStudyMedia
            videoUrl={caseStudy.videoUrl}
            videoMimeType={caseStudy.videoMimeType}
            videoAlt={caseStudy.videoAlt}
            headline={caseStudy.headline}
            posterUrl={caseStudy.videoPosterUrl || caseStudy.thumbUrl}
            posterMimeType={caseStudy.videoPosterMimeType || caseStudy.thumbMimeType}
            onOpen={openVideo}
          />
        </div>
      )}
    </article>
  )
}
