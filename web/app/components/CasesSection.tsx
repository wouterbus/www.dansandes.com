'use client'

import {useCallback, useMemo, useState} from 'react'
import CaseStudy, {type CaseStudyData} from './CaseStudy'
import {CaseVideoModal} from './CaseStudyMedia'
import CasesLoadMore from './CasesLoadMore'
import {isGifMedia} from '../lib/isGifMedia'
import {brandColorVar} from '../lib/brandColor'
import {type PortableTextBlock, renderHeadingText} from '../lib/renderHeadingText'

const DEFAULT_TITLE = [
  {text: 'QUANDO A HISTÓRIA É BOA, ', accent: false},
  {text: 'A MARCA FAZ PARTE DA CONVERSA', accent: true, color: 'orange' as const},
]

type CasesSectionProps = {
  title?: PortableTextBlock[]
  cases?: CaseStudyData[]
}

function isPlayableCase(item: CaseStudyData): boolean {
  return Boolean(item.videoUrl && !isGifMedia(item.videoUrl, item.videoMimeType))
}

export default function CasesSection({title, cases = []}: CasesSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const playableIndexes = useMemo(
    () => cases.map((_, index) => index).filter((index) => isPlayableCase(cases[index])),
    [cases],
  )

  const activeCase = activeIndex !== null ? cases[activeIndex] : null
  const playablePos = activeIndex !== null ? playableIndexes.indexOf(activeIndex) : -1
  const canNavigate = playableIndexes.length > 1

  const openCase = useCallback((index: number) => {
    if (isPlayableCase(cases[index])) setActiveIndex(index)
  }, [cases])

  const closeCase = useCallback(() => setActiveIndex(null), [])

  const goPrev = useCallback(() => {
    if (playablePos < 0 || !canNavigate) return
    const nextPos = (playablePos - 1 + playableIndexes.length) % playableIndexes.length
    setActiveIndex(playableIndexes[nextPos])
  }, [canNavigate, playableIndexes, playablePos])

  const goNext = useCallback(() => {
    if (playablePos < 0 || !canNavigate) return
    const nextPos = (playablePos + 1) % playableIndexes.length
    setActiveIndex(playableIndexes[nextPos])
  }, [canNavigate, playableIndexes, playablePos])

  return (
    <section id="cases" className="section cases-section" aria-label="Cases">
      <div className="cases-section__head site-container">
        <h2 className="cases-section__title">
          {renderHeadingText(title, DEFAULT_TITLE, {
            legacyStrongColor: 'orange',
            breakAfterComma: true,
          })}
        </h2>
      </div>

      {cases.length ? (
        <div className="cases-section__list site-container">
          <CasesLoadMore>
            {cases.map((item, index) => (
              <CaseStudy
                key={item._key ?? `case-${index}`}
                caseStudy={item}
                index={index}
                onOpenVideo={() => openCase(index)}
              />
            ))}
          </CasesLoadMore>
        </div>
      ) : (
        <div className="site-container">
          <p className="cases-section__empty">
            Adicione cases em Sanity → <strong>Cases</strong>.
          </p>
        </div>
      )}

      {activeCase?.videoUrl && (
        <CaseVideoModal
          videoUrl={activeCase.videoUrl}
          videoAlt={activeCase.videoAlt}
          label={activeCase.label ?? []}
          headline={activeCase.headline}
          description={activeCase.description}
          colorVar={brandColorVar(activeCase.brandColor)}
          onClose={closeCase}
          onPrev={canNavigate ? goPrev : undefined}
          onNext={canNavigate ? goNext : undefined}
        />
      )}
    </section>
  )
}
