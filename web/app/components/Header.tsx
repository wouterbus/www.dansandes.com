import Image from 'next/image'
import {createClient} from '@sanity/client'
import groq from 'groq'
import Link from 'next/link'

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

  const menuItems = [
    {label: 'Home', href: '/'},
    {label: 'Cases', href: '#'},
    {label: 'About', href: '#'},
    {label: 'Contact', href: '#'},
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: '#000',
        borderBottom: '1px solid #222',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          maxWidth: 1280,
          margin: '0 auto',
          gap: 24,
        }}
      >
        <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: 12}}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={130}
              height={40}
              style={{objectFit: 'contain', height: 40, width: 'auto'}}
              priority
            />
          ) : (
            <span style={{color: '#fff', fontWeight: 600}}>Sandes</span>
          )}
        </Link>

        <nav>
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              gap: 20,
            }}
          >
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 14,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}


