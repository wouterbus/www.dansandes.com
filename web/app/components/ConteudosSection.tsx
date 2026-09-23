import Image from 'next/image'
import {isLoopingMedia} from '../lib/isGifMedia'
import {
  PortableTextBlock,
  renderHeadingText,
} from '../lib/renderHeadingText'
import LoopingMedia from './LoopingMedia'
import ScrollParticles from './ScrollParticles'
import {CONTEUDOS_PARTICLES_BEHIND, CONTEUDOS_PARTICLES_FRONT} from '../lib/particleConfigs'

type ConteudosSectionProps = {
  title?: PortableTextBlock[]
  body?: string
  mediaUrl?: string
  mediaMimeType?: string | null
  mediaAlt?: string
}

const DEFAULT_TITLE = [
  {text: 'CONTEÚDOS E FORMATOS ORIGINAIS ', accent: false},
  {text: 'QUE FURAM A BOLHA', accent: true, color: 'green' as const},
]

const DEFAULT_BODY =
  'Projetos com relevância cultural que se destacam em um mar de conteúdos que seguem fórmulas prontas.'

/** Split Sanity text-field alineas (blank lines) into real paragraphs. */
function renderBody(body: string) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) return null

  return (
    <div className="conteudos__body">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="conteudos__body-p">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export default function ConteudosSection({
  title,
  body,
  mediaUrl,
  mediaMimeType,
  mediaAlt,
}: ConteudosSectionProps) {
  return (
    <section id="intro" className="section conteudos">
      <ScrollParticles
        className="section__particles conteudos__particles conteudos__particles--behind"
        particles={CONTEUDOS_PARTICLES_BEHIND}
      />

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
                  alt={mediaAlt || 'Intro'}
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

      <ScrollParticles
        className="section__particles conteudos__particles conteudos__particles--front"
        particles={CONTEUDOS_PARTICLES_FRONT}
      />

      <div className="conteudos__inner site-container">
        <div className="section__content conteudos__content">
          <h2>{renderHeadingText(title, DEFAULT_TITLE, {legacyStrongColor: 'green'})}</h2>
          {renderBody(body || DEFAULT_BODY)}
        </div>
      </div>
    </section>
  )
}
