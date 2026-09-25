import Image from 'next/image'
import HeroVideo from './HeroVideo'
import ScrollParticles from './ScrollParticles'
import {HERO_PARTICLES} from '../lib/particleConfigs'
import {
  PortableTextBlock,
  renderHeadingText,
} from '../lib/renderHeadingText'

type HeroProps = {
  title?: PortableTextBlock[]
  awardsUrl?: string
  awardsAlt?: string
  videoUrl?: string
  videoMimeType?: string | null
  mobileVideoUrl?: string
  mobileVideoMimeType?: string | null
  videoAlt?: string
}

const DEFAULT_TITLE = [
  {text: 'UM ESTÚDIO CRIATIVO QUE APROXIMA MARCAS E PESSOAS ', accent: false},
  {text: 'ATRAVÉS DE ENTRETENIMENTO AUDIOVISUAL.', accent: true, color: 'orange' as const},
]

export default function Hero({
  title,
  awardsUrl,
  awardsAlt,
  videoUrl,
  videoMimeType,
  mobileVideoUrl,
  mobileVideoMimeType,
  videoAlt,
}: HeroProps) {
  return (
    <section id="inicio" className="section hero">
      <ScrollParticles className="section__particles" particles={HERO_PARTICLES} />

      <div className="hero__inner site-container">
        <div className="section__content hero__content">
          <h1>{renderHeadingText(title, DEFAULT_TITLE, {legacyStrongColor: 'orange'})}</h1>

          <div className="hero__awards" aria-label="Prémios e reconhecimentos">
            <Image
              src={awardsUrl || '/awards.png'}
              alt={awardsAlt || 'Prémios e reconhecimentos'}
              width={560}
              height={80}
              className="hero__awards-img"
            />
          </div>
        </div>
      </div>

      <div className="hero__visual" aria-hidden={!videoUrl}>
        {videoUrl ? (
          <HeroVideo videoUrl={videoUrl} videoMimeType={videoMimeType} mobileVideoUrl={mobileVideoUrl} mobileVideoMimeType={mobileVideoMimeType} alt={videoAlt} />
        ) : (
          <div className="circle-media">
            <div className="circle-media__ring" aria-hidden="true" />
            <div className="circle-media__fill circle-media__fill--empty">
              <span>Adicione um vídeo no Sanity</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
