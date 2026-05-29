import {createClient} from '@sanity/client'
import groq from 'groq'
import CasesSection from './components/CasesSection'
import ConteudosSection from './components/ConteudosSection'
import Hero from './components/Hero'
import LogoGridSection from './components/LogoGridSection'
import ParallaxVideoSection from './components/ParallaxVideoSection'
import Footer from './components/Footer'
import ProdutosSandesSection from './components/ProdutosSandesSection'
import type {CaseStudyData} from './components/CaseStudy'
import type {ProdutoCardData} from './components/ProdutoCard'
import type {BrandColor} from './lib/brandColor'
import type {PortableTextBlock} from './lib/renderHeadingText'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: false,
})

export const dynamic = 'force-dynamic'

async function getData() {
  const [
    configuracoes,
    heroBanner,
    conteudosSection,
    logoCarousel,
    universosSection,
    produtosSandes,
    casesSection,
  ] = await Promise.all([
    client.fetch(groq`*[_type=='configuracoes'][0]{title, logo{asset->{url}}, favicon{asset->{url}}}`),
    client.fetch(groq`*[_type=='heroBanner'][0]{
      title,
      awards{asset->{url}, alt},
      video{asset->{url, mimeType}},
      alt
    }`),
    client.fetch(groq`*[_type=='conteudosSection'][0]{
      title,
      body,
      ctaLabel,
      ctaLink,
      media{asset->{url, mimeType}, alt},
      image{asset->{url, mimeType}, alt}
    }`),
    client.fetch(groq`*[_type=='logoCarousel'][0]{
      logos[]->{
        name,
        image{asset->{url}, alt}
      }
    }`),
    client.fetch(groq`*[_type=='universosSection'][0]{
      title,
      body,
      video{asset->{url, mimeType}},
      videoAlt
    }`),
    client.fetch(groq`*[_type=='produtosSandes'][0]{
      cards[]{
        _key,
        title,
        brandColor,
        body,
        logo{asset->{url}, alt},
        backgroundImage{asset->{url}},
        serviceGroups[]{items}
      }
    }`),
    client.fetch(groq`*[_type=='casesSection'][0]{
      items[]{
        _key,
        internalName,
        title,
        subtitle,
        paragraph,
        brandColor,
        video{asset->{url, mimeType}, alt},
        thumb{asset->{url}, alt},
        clientLogo->{
          name,
          image{asset->{url}, alt}
        }
      }
    }`),
  ])
  return {
    configuracoes,
    heroBanner,
    conteudosSection,
    logoCarousel,
    universosSection,
    produtosSandes,
    casesSection,
  }
}

function mapProdutoCards(
  cards?: {
    _key?: string
    title?: string
    brandColor?: string
    body?: string
    logo?: {asset?: {url?: string}; alt?: string}
    backgroundImage?: {asset?: {url?: string}}
    serviceGroups?: {items?: string[]}[]
  }[]
): ProdutoCardData[] | undefined {
  if (!cards?.length) return undefined

  return cards.map((card) => ({
    _key: card._key,
    title: card.title,
    brandColor: card.brandColor as BrandColor | undefined,
    body: card.body,
    logoUrl: card.logo?.asset?.url,
    logoAlt: card.logo?.alt,
    backgroundUrl: card.backgroundImage?.asset?.url,
    serviceGroups: card.serviceGroups,
  }))
}

function mapCaseStudies(
  items?: {
    _key?: string
    internalName?: string
    title?: PortableTextBlock[]
    subtitle?: string
    paragraph?: string
    brandColor?: string
    video?: {asset?: {url?: string; mimeType?: string}; alt?: string}
    thumb?: {asset?: {url?: string}; alt?: string}
    clientLogo?: {
      name?: string
      image?: {asset?: {url?: string}; alt?: string}
    }
  }[]
): CaseStudyData[] | undefined {
  if (!items?.length) return undefined

  return items.map((item) => ({
    _key: item._key,
    internalName: item.internalName,
    title: item.title,
    subtitle: item.subtitle,
    paragraph: item.paragraph,
    brandColor: item.brandColor as BrandColor | undefined,
    videoUrl: item.video?.asset?.url,
    videoMimeType: item.video?.asset?.mimeType,
    videoAlt: item.video?.alt,
    thumbUrl: item.thumb?.asset?.url,
    thumbAlt: item.thumb?.alt,
    clientLogoUrl: item.clientLogo?.image?.asset?.url,
    clientLogoAlt: item.clientLogo?.image?.alt || item.clientLogo?.name,
  }))
}

export default async function HomePage() {
  const {heroBanner, conteudosSection, logoCarousel, universosSection, produtosSandes, casesSection} =
    await getData()

  return (
    <>
      <Hero
        title={heroBanner?.title}
        awardsUrl={heroBanner?.awards?.asset?.url}
        awardsAlt={heroBanner?.awards?.alt}
        videoUrl={heroBanner?.video?.asset?.url}
        videoMimeType={heroBanner?.video?.asset?.mimeType}
        videoAlt={heroBanner?.alt}
      />

      <ConteudosSection
        title={conteudosSection?.title}
        body={conteudosSection?.body}
        mediaUrl={conteudosSection?.media?.asset?.url ?? conteudosSection?.image?.asset?.url}
        mediaMimeType={
          conteudosSection?.media?.asset?.mimeType ?? conteudosSection?.image?.asset?.mimeType
        }
        mediaAlt={conteudosSection?.media?.alt ?? conteudosSection?.image?.alt}
        ctaLabel={conteudosSection?.ctaLabel}
        ctaLink={conteudosSection?.ctaLink}
      />

      <LogoGridSection
        logos={logoCarousel?.logos?.map(
          (logo: {image?: {asset?: {url?: string}; alt?: string}; name?: string}) => ({
            url: logo?.image?.asset?.url,
            alt: logo?.image?.alt || logo?.name,
          })
        )}
      />

      <ParallaxVideoSection
        title={universosSection?.title}
        body={universosSection?.body}
        videoUrl={universosSection?.video?.asset?.url}
        videoMimeType={universosSection?.video?.asset?.mimeType}
        videoAlt={universosSection?.videoAlt}
      />

      <ProdutosSandesSection cards={mapProdutoCards(produtosSandes?.cards)} />

      <CasesSection cases={mapCaseStudies(casesSection?.items)} />

      <Footer />
    </>
  )
}
