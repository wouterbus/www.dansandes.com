import {createClient} from '@sanity/client'
import groq from 'groq'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
})

export async function generateMetadata() {
  const data = await client.fetch(groq`*[_type=='configuracoes'][0]{title, favicon{asset->{url}}}`)
  const faviconUrl = data?.favicon?.asset?.url
  // Extract plain text from the portable text title (first block's first child)
  const titleText =
    data?.title?.[0]?.children?.[0]?.text?.trim?.() ||
    'Sandes'
  return {
    title: titleText,
    icons: faviconUrl ? {icon: [{url: faviconUrl}]} : undefined,
  }
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-br">
      <body>
        {/* Site Header */}
        <Header />
        {children}
      </body>
    </html>
  )
}

// eslint-disable-next-line import/no-default-export
import Header from './components/Header'

