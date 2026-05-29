import Image from 'next/image'
import Link from 'next/link'
import {isLoopingMedia} from '../lib/isGifMedia'
import {
  PortableTextBlock,
  renderHeadingText,
} from '../lib/renderHeadingText'
import LoopingMedia from './LoopingMedia'

type ConteudosSectionProps = {
  title?: PortableTextBlock[]
  body?: string
  mediaUrl?: string
  mediaMimeType?: string | null
  mediaAlt?: string
  ctaLabel?: string
  ctaLink?: string
}

const DEFAULT_TITLE = [
  {text: 'CONTEÚDOS E FORMATOS ORIGINAIS ', accent: false},
  {text: 'QUE FURAM A BOLHA', accent: true, color: 'green' as const},
]

const DEFAULT_BODY =
  'Projetos com relevância cultural que se destacam em um mar de conteúdos que seguem fórmulas prontas.'

export default function ConteudosSection({
  title,
  body,
  mediaUrl,
  mediaMimeType,
  mediaAlt,
  ctaLabel = 'cta',
  ctaLink,
}: ConteudosSectionProps) {
  const cta = ctaLink ? (
    <Link href={ctaLink} className="conteudos__cta">
      {ctaLabel}
    </Link>
  ) : (
    <span className="conteudos__cta">{ctaLabel}</span>
  )

  return (
    <section id="conteudos" className="section conteudos">
      <div className="section__particles conteudos__particles" aria-hidden="true">
        <div className="section__decor conteudos__decor--orange-tl" />
        <div className="section__decor conteudos__decor--purple-top" />
        <div className="section__decor conteudos__decor--red-bottom" />
        <div className="section__decor conteudos__decor--orange-right" />
      </div>

      <div className="conteudos__visual" aria-hidden={!mediaUrl}>
        <div className="circle-media">
          <div className="circle-media__ring" aria-hidden="true" />
          <div
            className={
              mediaUrl ? 'circle-media__fill' : 'circle-media__fill circle-media__fill--empty'
            }
          >
            {mediaUrl ? (
              isLoopingMedia(mediaUrl, mediaMimeType) ? (
                <LoopingMedia
                  src={mediaUrl}
                  mimeType={mediaMimeType}
                  className="conteudos__img"
                  alt={mediaAlt || 'Conteúdos'}
                />
              ) : (
                <Image
                  src={mediaUrl}
                  alt={mediaAlt || ''}
                  fill
                  className="conteudos__img"
                  sizes="(max-width: 960px) 85vw, 58vmin"
                />
              )
            ) : (
              'Adicione uma imagem ou vídeo no Sanity'
            )}
          </div>
        </div>
      </div>

      <div className="conteudos__inner site-container">
        <div className="section__content conteudos__content">
          <h2>{renderHeadingText(title, DEFAULT_TITLE, {legacyStrongColor: 'green'})}</h2>
          <p>{body || DEFAULT_BODY}</p>
          {cta}
        </div>
      </div>
    </section>
  )
}
