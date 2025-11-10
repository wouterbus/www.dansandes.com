import './globals.css'
import Image from 'next/image'
import {createClient} from '@sanity/client'
import groq from 'groq'
import CasesGrid from './components/CasesGrid'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
})

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

async function getData() {
  const [configuracoes, logoCarousel, heroBanner, cases] = await Promise.all([
    client.fetch(groq`*[_type=='configuracoes'][0]{title, logo{asset->{url}}, favicon{asset->{url}}}`),
    client.fetch(groq`*[_type=='logoCarousel'][0]{logos[]{..., asset->}}`),
    client.fetch(groq`*[_type=='heroBanner'][0]{video{asset->{url}}, alt}`),
    client.fetch(groq`*[_type=='cases']{
      _id,
      title,
      tag,
      paragrafo,
      thumbnail{asset->{url}, alt},
      videoPrincipal{asset->{url}}
    }`),
  ])
  return {configuracoes, logoCarousel, heroBanner, cases}
}

export default async function HomePage() {
  const {configuracoes, logoCarousel, heroBanner, cases} = await getData()

  return (
    <main style={{padding: 24, display: 'grid', gap: 48}}>
      <section>
        <h2 style={{marginBottom: 12}}>Hero Banner (Reel)</h2>
        {heroBanner?.video?.asset?.url ? (
          <video 
            src={heroBanner.video.asset.url} 
            autoPlay 
            muted 
            loop 
            playsInline 
            style={{width: '100%', border: '1px solid #333'}} 
          />
        ) : (
          <p>Sem vídeo</p>
        )}
      </section>

      <section>
        <h2 style={{marginBottom: 12}}>Configurações</h2>
        {configuracoes?.title && (
          <div>
            <h3>Title: {renderBlockContent(configuracoes.title) || 'No title'}</h3>
            {configuracoes?.logo?.asset?.url && (
              <Image src={configuracoes.logo.asset.url} alt="Logo" width={200} height={100} style={{objectFit: 'contain'}} />
            )}
          </div>
        )}
      </section>

      <section>
        <h2 style={{marginBottom: 12}}>Logo Carousel</h2>
        <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center'}}>
          {logoCarousel?.logos?.length ? (
            logoCarousel.logos.map((img: any, i: number) => (
              img?.asset?.url ? (
                <Image key={i} src={img.asset.url} alt={img.alt || ''} width={120} height={60} style={{objectFit: 'contain'}} />
              ) : null
            ))
          ) : (
            <p>Sem logos</p>
          )}
        </div>
      </section>

      <section>
        <h2 style={{marginBottom: 12}}>Cases</h2>
        <CasesGrid cases={cases} />
      </section>
    </main>
  )
}
