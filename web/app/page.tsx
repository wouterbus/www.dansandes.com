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
import {renderHeadingText, type PortableTextBlock} from './lib/renderHeadingText'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: false,
})

async function getData() {
  const [
    configuracoes,
    heroBanner,
    conteudosSection,
    logoCarousel,
    universosSection,
    produtosSandes,
    casesSection,
    footerSection,
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
        backgroundVideo{asset->{url, mimeType}},
        serviceGroups[]{items}
      }
    }`),
    client.fetch(groq`*[_type=='casesSection'][0]{
      title,
      items[]{
        _key,
        internalName,
        label,
        headline,
        shortDescription,
        tags,
        description,
        title,
        subtitle,
        paragraph,
        brandColor,
        video{asset->{url, mimeType}, alt},
        videoPoster{asset->{url, mimeType}},
        thumb{asset->{url, mimeType}, alt},
        clientLogo->{
          name,
          image{asset->{url}, alt}
        },
        clientLogoCustom{asset->{url}, alt}
      }
    }`),
    client.fetch(groq`*[_type=='footerSection'][0]{
      title,
      body,
      logo{asset->{url}, alt},
      instagramUrl,
      email
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
    footerSection,
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
    backgroundVideo?: {asset?: {url?: string; mimeType?: string}}
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
    backgroundVideoUrl: card.backgroundVideo?.asset?.url,
    backgroundVideoMimeType: card.backgroundVideo?.asset?.mimeType,
    serviceGroups: card.serviceGroups,
  }))
}

function flattenBlocks(blocks?: PortableTextBlock[]): string | undefined {
  const text = blocks
    ?.map((block) => block.children?.map((child) => child.text ?? '').join('') ?? '')
    .join(' ')
    .trim()
  return text || undefined
}

function cleanList(values?: string[]): string[] | undefined {
  const list = values?.map((value) => value?.trim()).filter((value): value is string =>
    Boolean(value)
  )
  return list?.length ? list : undefined
}

function mapCaseStudies(
  items?: {
    _key?: string
    internalName?: string
    label?: string[]
    headline?: string
    shortDescription?: string
    tags?: string[]
    description?: string
    title?: PortableTextBlock[]
    subtitle?: string
    paragraph?: string
    brandColor?: string
    video?: {asset?: {url?: string; mimeType?: string}; alt?: string}
    videoPoster?: {asset?: {url?: string; mimeType?: string}}
    thumb?: {asset?: {url?: string; mimeType?: string}; alt?: string}
    clientLogo?: {
      name?: string
      image?: {asset?: {url?: string}; alt?: string}
    }
    clientLogoCustom?: {asset?: {url?: string}; alt?: string}
  }[]
): CaseStudyData[] | undefined {
  if (!items?.length) return undefined

  return items.map((item) => {
    const customUrl = item.clientLogoCustom?.asset?.url
    const gridUrl = item.clientLogo?.image?.asset?.url

    return {
      _key: item._key,
      internalName: item.internalName,
      label: cleanList(item.label),
      headline: item.headline || flattenBlocks(item.title),
      shortDescription: item.shortDescription || item.subtitle,
      tags: cleanList(item.tags),
      description: item.description || item.paragraph,
      brandColor: item.brandColor as BrandColor | undefined,
      videoUrl: item.video?.asset?.url,
      videoMimeType: item.video?.asset?.mimeType,
      videoAlt: item.video?.alt,
      videoPosterUrl: item.videoPoster?.asset?.url,
      videoPosterMimeType: item.videoPoster?.asset?.mimeType,
      thumbUrl: item.thumb?.asset?.url,
      thumbMimeType: item.thumb?.asset?.mimeType,
      thumbAlt: item.thumb?.alt,
      clientLogoUrl: customUrl || gridUrl,
      clientLogoAlt:
        (customUrl ? item.clientLogoCustom?.alt : undefined) ||
        item.clientLogo?.image?.alt ||
        item.clientLogo?.name,
    }
  })
}

export default async function HomePage() {
  const {
    heroBanner,
    conteudosSection,
    logoCarousel,
    universosSection,
    produtosSandes,
    casesSection,
    footerSection,
  } = await getData()

  const footerTitle = renderHeadingText(footerSection?.title, [
    {text: 'Que histórias sua marca ', accent: false},
    {text: 'tem para contar?', accent: true, color: 'yellow'},
  ])

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
        videoUrl={universosSection?.video?.asset?.url}
        videoMimeType={universosSection?.video?.asset?.mimeType}
        videoAlt={universosSection?.videoAlt}
      />

      <ProdutosSandesSection cards={mapProdutoCards(produtosSandes?.cards)} />

      <CasesSection
        title={casesSection?.title}
        cases={mapCaseStudies(casesSection?.items)}
      />

      <Footer
        title={footerTitle}
        body={footerSection?.body}
        logoUrl={footerSection?.logo?.asset?.url}
        logoAlt={footerSection?.logo?.alt}
        instagramUrl={footerSection?.instagramUrl}
        email={footerSection?.email}
      />
    </>
  )
}
