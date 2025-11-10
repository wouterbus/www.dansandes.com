'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

// Helper function to render block content with formatting
function renderBlockContent(blocks: any[]) {
  if (!blocks || !blocks.length) return null
  
  return blocks[0]?.children?.map((child: any, index: number) => {
    const text = child.text || ''
    const marks = child.marks || []
    
    let content = text
    
    if (marks.includes('strong')) return <strong key={index}>{content}</strong>
    if (marks.includes('em')) return <em key={index}>{content}</em>
    
    return <span key={index}>{content}</span>
  })
}

// Video Modal Component
function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          padding: '12px 24px',
          cursor: 'pointer',
          fontSize: 16,
          borderRadius: 4,
        }}
      >
        ✕ Close
      </button>
      <video 
        src={videoUrl}
        controls
        autoPlay
        style={{
          maxWidth: '90%',
          maxHeight: '90vh',
          border: '1px solid #333',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default function CasesGrid({ cases }: { cases: any[] }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Keen Slider config
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: 3, spacing: 24 },
    breakpoints: {
      '(max-width: 1024px)': { slides: { perView: 2, spacing: 16 } },
      '(max-width: 640px)': { slides: { perView: 1, spacing: 12 } },
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
          cases.map((caseItem: any) => (
            <div 
              key={caseItem._id}
              className="keen-slider__slide"
              onClick={() =>
                caseItem?.videoPrincipal?.asset?.url &&
                setSelectedVideo(caseItem.videoPrincipal.asset.url)
              }
              style={{
                border: '1px solid #333',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: caseItem?.videoPrincipal?.asset?.url ? 'pointer' : 'default',
              }}
            >
              {caseItem?.thumbnail?.asset?.url && (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#111' }}>
                  <Image 
                    src={caseItem.thumbnail.asset.url} 
                    alt={caseItem.thumbnail.alt || ''} 
                    fill
                    style={{ objectFit: 'cover' }} 
                  />
                  {caseItem?.videoPrincipal?.asset?.url && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
                        }}
                      >
                        ▶
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div style={{ padding: 16 }}>
                {caseItem?.tag && (
                  <div
                    style={{
                      color: '#aaa',
                      fontSize: 12,
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {renderBlockContent(caseItem.tag)}
                  </div>
                )}
                {caseItem?.title && (
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>
                    {renderBlockContent(caseItem.title) || 'Untitled'}
                  </h3>
                )}
                {caseItem?.paragrafo && (
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#ccc' }}>
                    {renderBlockContent(caseItem.paragrafo)}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Sem cases</p>
        )}
      </div>

      {loaded && instanceRef.current && cases?.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
          <button
            type="button"
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous slide"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid #333',
              padding: '8px 12px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {cases.map((_, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: currentSlide === idx ? '#fff' : '#555',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => instanceRef.current?.next()}
            aria-label="Next slide"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid #333',
              padding: '8px 12px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            →
          </button>
        </div>
      )}

      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  )
}
