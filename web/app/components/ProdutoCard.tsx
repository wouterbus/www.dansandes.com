'use client'

import Image from 'next/image'
import {type CSSProperties, useId} from 'react'
import {brandColorVar, type BrandColor} from '../lib/brandColor'
import HoverPlayMedia from './HoverPlayMedia'

export type ProdutoCardData = {
  _key?: string
  logoUrl?: string
  logoAlt?: string
  title?: string
  serviceGroups?: {items?: string[]}[]
  brandColor?: BrandColor | string
  backgroundUrl?: string
  backgroundVideoUrl?: string
  backgroundVideoMimeType?: string
  body?: string
}

type ProdutoCardProps = {
  card: ProdutoCardData
  expanded: boolean
  onMouseEnter?: () => void
  onToggle: () => void
}

export default function ProdutoCard({
  card,
  expanded,
  onMouseEnter,
  onToggle,
}: ProdutoCardProps) {
  const bodyId = useId()
  const colorVar = brandColorVar(card.brandColor)
  const groups = card.serviceGroups?.slice(0, 4) ?? []
  const hasBackgroundVideo = Boolean(card.backgroundVideoUrl)

  return (
    <article
      className={`produto-card${expanded ? ' produto-card--expanded' : ''}`}
      onMouseEnter={onMouseEnter}
      data-cursor={hasBackgroundVideo ? 'link' : undefined}
      style={
        {
          '--produto-color': `var(${colorVar})`,
          '--produto-bg-image':
            !hasBackgroundVideo && card.backgroundUrl ? `url(${card.backgroundUrl})` : 'none',
        } as CSSProperties
      }
    >
      <div
        className={`produto-card__bg${hasBackgroundVideo ? ' produto-card__bg--video' : ''}`}
        aria-hidden="true"
      >
        {hasBackgroundVideo && (
          <HoverPlayMedia
            src={card.backgroundVideoUrl!}
            mimeType={card.backgroundVideoMimeType}
            className="produto-card__bg-media"
            active={expanded}
          />
        )}
      </div>

      <div className="produto-card__inner">
        {card.logoUrl && (
          <div className="produto-card__logo">
            <Image
              src={card.logoUrl}
              alt={card.logoAlt || ''}
              width={400}
              height={120}
              sizes="(max-width: 420px) 100vw, 33vw"
              className="produto-card__logo-img"
            />
          </div>
        )}

        {card.title && <h3 className="produto-card__title">{card.title}</h3>}

        {groups.length > 0 && (
          <div className="produto-card__services">
            {groups.map((group, groupIndex) => (
              <div key={groupIndex} className="produto-card__service-cell">
                <ul className="produto-card__service-list">
                  {group.items?.filter(Boolean).map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {card.body && (
          <div
            id={bodyId}
            className="produto-card__body"
            hidden={!expanded}
          >
            <p>{card.body}</p>
          </div>
        )}

        <button
          type="button"
          className="produto-card__toggle"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          aria-label={expanded ? 'Fechar descrição' : 'Ver descrição'}
        >
          <span className="produto-card__chevron" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
