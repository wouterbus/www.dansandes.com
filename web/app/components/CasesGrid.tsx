'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'
import 'keen-slider/keen-slider.min.css'
import {useKeenSlider} from 'keen-slider/react'
import {isGifMedia} from '../lib/isGifMedia'

function renderBlockContent(blocks: any[]) {
  if (!blocks || !blocks.length) return null

  return blocks[0]?.children?.map((child: any, index: number) => {
    const text = child.text || ''
    const marks = child.marks || []

    if (marks.includes('strong')) return <strong key={index}>{text}</strong>
    if (marks.includes('em')) return <em key={index}>{text}</em>

    return <span key={index}>{text}</span>
  })
}

function VideoModal({
  videoUrl,
  mimeType,
  onClose,
}: {
  videoUrl: string
  mimeType?: string | null
  onClose: () => void
}) {
  const isGif = isGifMedia(videoUrl, mimeType)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="cases-modal" onClick={onClose} role="presentation">
      <button type="button" className="cases-modal__close" onClick={onClose}>
        ✕ Close
      </button>
      {isGif ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={videoUrl}
          alt=""
          className="cases-modal__video"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="cases-modal__video"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  )
}

export default function CasesGrid({cases}: {cases: any[]}) {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string
    mimeType?: string | null
  } | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {perView: 3, spacing: 24},
    breakpoints: {
      '(max-width: 1024px)': {slides: {perView: 2, spacing: 16}},
      '(max-width: 640px)': {slides: {perView: 1, spacing: 12}},
    },
    drag: false,
    rubberband: false,
    loop: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        {cases?.length ? (
          cases.map((caseItem: any) => {
            const hasVideo = Boolean(caseItem?.videoPrincipal?.asset?.url)

            return (
              <div
                key={caseItem._id}
                className={`keen-slider__slide cases-card${hasVideo ? ' cases-card--clickable' : ''}`}
                onClick={() =>
                  hasVideo &&
                  setSelectedVideo({
                    url: caseItem.videoPrincipal.asset.url,
                    mimeType: caseItem.videoPrincipal.asset.mimeType,
                  })
                }
              >
                {caseItem?.thumbnail?.asset?.url && (
                  <div className="cases-card__media">
                    <Image
                      src={caseItem.thumbnail.asset.url}
                      alt={caseItem.thumbnail.alt || ''}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      style={{objectFit: 'cover'}}
                    />
                    {hasVideo && (
                      <div className="cases-card__overlay">
                        <div className="cases-card__play" aria-hidden>
                          ▶
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="cases-card__body">
                  {caseItem?.tag && (
                    <div className="cases-card__tag">{renderBlockContent(caseItem.tag)}</div>
                  )}
                  {caseItem?.title && (
                    <h3 className="cases-card__title">
                      {renderBlockContent(caseItem.title) || 'Untitled'}
                    </h3>
                  )}
                  {caseItem?.paragrafo && (
                    <p className="cases-card__text">{renderBlockContent(caseItem.paragrafo)}</p>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p>Sem cases</p>
        )}
      </div>

      {loaded && instanceRef.current && cases?.length > 1 && (
        <nav className="cases-nav" aria-label="Cases carousel">
          <button
            type="button"
            className="cases-nav__btn"
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous slide"
          >
            ←
          </button>
          <div className="cases-nav__dots">
            {cases.map((_, idx: number) => (
              <button
                key={idx}
                type="button"
                className={`cases-nav__dot${currentSlide === idx ? ' cases-nav__dot--active' : ''}`}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={currentSlide === idx ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="cases-nav__btn"
            onClick={() => instanceRef.current?.next()}
            aria-label="Next slide"
          >
            →
          </button>
        </nav>
      )}

      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo.url}
          mimeType={selectedVideo.mimeType}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  )
}
