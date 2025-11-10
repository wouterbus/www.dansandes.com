'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'

// Helper function to render block content with formatting
function renderBlockContent(blocks: any[]) {
  if (!blocks || !blocks.length) return null
  
  return blocks[0]?.children?.map((child: any, index: number) => {
    const text = child.text || ''
    const marks = child.marks || []
    
    let content = text
    
    // Wrap with appropriate tags based on marks
    if (marks.includes('strong')) {
      return <strong key={index}>{content}</strong>
    }
    if (marks.includes('em')) {
      return <em key={index}>{content}</em>
    }
    
    return <span key={index}>{content}</span>
  })
}

// Video Modal Component
function VideoModal({videoUrl, onClose}: {videoUrl: string; onClose: () => void}) {
  useEffect(() => {
    // Prevent body scroll when modal is open
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

export default function CasesGrid({cases}: {cases: any[]}) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return (
    <>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24}}>
        {cases?.length ? (
          cases.map((caseItem: any) => (
            <div 
              key={caseItem._id} 
              onClick={() => caseItem?.videoPrincipal?.asset?.url && setSelectedVideo(caseItem.videoPrincipal.asset.url)}
              style={{
                border: '1px solid #333',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: caseItem?.videoPrincipal?.asset?.url ? 'pointer' : 'default',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (caseItem?.videoPrincipal?.asset?.url) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = '#666'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#333'
              }}
            >
              {caseItem?.thumbnail?.asset?.url && (
                <div style={{position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#111'}}>
                  <Image 
                    src={caseItem.thumbnail.asset.url} 
                    alt={caseItem.thumbnail.alt || ''} 
                    fill
                    style={{objectFit: 'cover'}} 
                  />
                  {caseItem?.videoPrincipal?.asset?.url && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                      }}>
                        ▶
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div style={{padding: 16}}>
                {caseItem?.tag && (
                  <div style={{color: '#aaa', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1}}>
                    {renderBlockContent(caseItem.tag)}
                  </div>
                )}
                {caseItem?.title && (
                  <h3 style={{margin: '0 0 8px 0', fontSize: 20}}>
                    {renderBlockContent(caseItem.title) || 'Untitled'}
                  </h3>
                )}
                {caseItem?.paragrafo && (
                  <p style={{margin: 0, fontSize: 14, lineHeight: 1.6, color: '#ccc'}}>
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

      {selectedVideo && (
        <VideoModal 
          videoUrl={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </>
  )
}


