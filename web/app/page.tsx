import './globals.css'
import Image from 'next/image'
import {createClient} from '@sanity/client'
import groq from 'groq'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
})

type SanityFile = {
  asset: {url: string}
}

async function getData() {
  const [hero, logos, servicos] = await Promise.all([
    client.fetch(groq`*[_type=='homeHero'][0]{video{asset->{url}}, alt}`),
    client.fetch(groq`*[_type=='homeLogoCarousel'][0]{logos[]{..., asset->}}`),
    client.fetch(groq`*[_type=='homeServices'][0]{titulo, itens}`),
  ])
  return {hero, logos, servicos}
}

export default async function HomePage() {
  const {hero, logos, servicos} = await getData()

  return (
    <main style={{padding: 24, display: 'grid', gap: 48}}>
      <section>
        <h2 style={{marginBottom: 12}}>Hero Banner</h2>
        {hero?.video?.asset?.url ? (
          <video src={hero.video.asset.url} autoPlay muted loop playsInline style={{width: '100%', border: '1px solid #333'}} />
        ) : (
          <p>Sem vídeo</p>
        )}
      </section>

      <section>
        <h2 style={{marginBottom: 12}}>Logo Carousel</h2>
        <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center'}}>
          {logos?.logos?.length ? (
            logos.logos.map((img: any, i: number) => (
              img?.asset?.url ? (
                <Image key={i} src={img.asset.url} alt={img.alt || ''} width={120} height={60} style={{objectFit: 'contain', filter: 'invert(1)'}} />
              ) : null
            ))
          ) : (
            <p>Sem logos</p>
          )}
        </div>
      </section>

      <section>
        <h2 style={{marginBottom: 4}}>Serviços</h2>
        {servicos?.titulo ? <h3 style={{marginTop: 0, color: '#aaa'}}>{servicos.titulo}</h3> : null}
        <div style={{display: 'grid', gap: 16}}>
          {servicos?.itens?.length ? (
            servicos.itens.map((b: any, i: number) => (
              <div key={i} style={{border: '1px solid #333', padding: 16}}>
                {b.subtitulo ? <strong>{b.subtitulo}</strong> : null}
                {b.descricao ? <p style={{margin: '8px 0 0'}}>{b.descricao}</p> : null}
              </div>
            ))
          ) : (
            <p>Sem serviços</p>
          )}
        </div>
      </section>
    </main>
  )
}


