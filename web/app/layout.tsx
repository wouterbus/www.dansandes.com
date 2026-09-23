import {createClient} from '@sanity/client'
import groq from 'groq'
import './globals.css'
import './hero.css'
import './menu.css'
import './conteudos.css'
import './logos.css'
import './parallax.css'
import './cases-section.css'
import './produtos.css'
import './footer.css'
import './scroll-particles.css'
import './cursor.css'
import './whatsapp-float.css'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'
import SplashScreen from './components/SplashScreen'
import WhatsAppFloat from './components/WhatsAppFloat'
import {montserrat, nomos} from './fonts'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '89ztrc1x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
})

export async function generateMetadata() {
  const data = await client.fetch(groq`*[_type=='configuracoes'][0]{title, favicon{asset->{url}}}`)
  const faviconUrl = data?.favicon?.asset?.url
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
    <html lang="pt-br" className={`${nomos.variable} ${montserrat.variable}`}>
      <body>
        <SplashScreen />
        <Header />
        {children}
        <CustomCursor />
        <WhatsAppFloat />
      </body>
    </html>
  )
}
