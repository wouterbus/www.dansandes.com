'use client'

import Image from 'next/image'

export type LogoItem = {
  url?: string
  alt?: string
}

const HOVER_COLORS = ['red', 'orange', 'yellow', 'green', 'purple'] as const

type LogoGridProps = {
  logos?: LogoItem[]
}

export default function LogoGrid({logos}: LogoGridProps) {
  const items = logos?.filter((logo) => logo?.url) ?? []

  if (!items.length) {
    return <p className="logo-grid__empty">Adicione logos no Sanity (Logo Grid)</p>
  }

  return (
    <ul className="logo-grid">
      {items.map((logo, index) => {
        const color = HOVER_COLORS[index % HOVER_COLORS.length]
        return (
          <li key={`${logo.url}-${index}`} className="logo-grid__item">
            <div
              className="logo-grid__circle"
              data-hover-color={color}
            >
              <Image
                src={logo.url!}
                alt={logo.alt || ''}
                width={80}
                height={80}
                className="logo-grid__img"
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
