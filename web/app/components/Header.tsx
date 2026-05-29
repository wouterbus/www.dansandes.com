import {createClient} from '@sanity/client'
import groq from 'groq'
import HeaderShell from './HeaderShell'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
})

async function getLogo() {
  const data = await client.fetch(
    groq`*[_type=='configuracoes'][0]{logo{asset->{url}}}`
  )
  return data?.logo?.asset?.url as string | undefined
}

export default async function Header() {
  const logoUrl = await getLogo()

  return <HeaderShell defaultLogoUrl={logoUrl} />
}
