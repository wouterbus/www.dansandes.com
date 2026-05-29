import Image from 'next/image'
import {type CSSProperties} from 'react'
import CaseStudyMedia from './CaseStudyMedia'
import {
  PortableTextBlock,
  renderHeadingText,
} from '../lib/renderHeadingText'
import {brandColorVar, type BrandColor} from '../lib/brandColor'

export type CaseStudyData = {
  _key?: string
  internalName?: string
  thumbUrl?: string
  thumbAlt?: string
  title?: PortableTextBlock[]
  clientLogoUrl?: string
  clientLogoAlt?: string
  videoUrl?: string
  videoMimeType?: string | null
  videoAlt?: string
  subtitle?: string
  paragraph?: string
  brandColor?: BrandColor | string
}

const DEFAULT_TITLE = [
  {text: 'REALITY SHOW DIGITAL ', accent: false},
  {text: 'O MAIOR TORCEDOR DA CONMEBOL LIBERTADORES', accent: true, color: 'red' as const},
]

type CaseStudyProps = {
  caseStudy: CaseStudyData
}

export default function CaseStudy({caseStudy}: CaseStudyProps) {
  const colorVar = brandColorVar(caseStudy.brandColor)

  return (
    <article
      className="case-study"
      style={
        {
          '--case-color': `var(${colorVar})`,
          '--case-thumb-size': 'clamp(200px, 30vw, 400px)',
        } as CSSProperties
      }
    >
      <div className="case-study__hero">
        <header className="case-study__header">
          <h2 className="case-study__title">
            {renderHeadingText(caseStudy.title, DEFAULT_TITLE, {
              emphasisClassName: 'case-study__title-emphasis',
            })}
          </h2>
        </header>

        {caseStudy.thumbUrl && (
          <div className="case-study__thumb">
            <div className="case-study__thumb-fill" aria-hidden="true">
              <Image
                src={caseStudy.thumbUrl}
                alt=""
                fill
                sizes="(max-width: 960px) 55vw, 380px"
                className="case-study__thumb-img"
              />
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
      </div>

      <div className="case-study__body">
        {caseStudy.videoUrl && (
          <div className="case-study__media">
            <CaseStudyMedia
              videoUrl={caseStudy.videoUrl}
              videoMimeType={caseStudy.videoMimeType}
              videoAlt={caseStudy.videoAlt}
            />
          </div>
        )}

        <div className="case-study__text">
          {caseStudy.subtitle && <h3 className="case-study__subtitle">{caseStudy.subtitle}</h3>}
          {caseStudy.paragraph && <p className="case-study__paragraph">{caseStudy.paragraph}</p>}
        </div>
      </div>
    </article>
  )
}
