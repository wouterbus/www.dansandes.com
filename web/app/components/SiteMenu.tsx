'use client'

import Link from 'next/link'
import {type CSSProperties, useEffect} from 'react'
import CreatorCredit from './CreatorCredit'

export type SiteMenuLink = {
  label: string
  href: string
}

const DEFAULT_LINKS: SiteMenuLink[] = [
  {label: 'Início', href: '#inicio'},
  {label: 'Sobre a Sandes', href: '#intro'},
  {label: 'Universos criativos', href: '#video-banner'},
  {label: 'Cases', href: '#cases'},
  {label: 'Contato', href: '#contacto'},
]

type SiteMenuProps = {
  open: boolean
  onClose: () => void
  links?: SiteMenuLink[]
}

export default function SiteMenu({open, onClose, links = DEFAULT_LINKS}: SiteMenuProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      id="site-menu"
      className={`site-menu${open ? ' site-menu--open' : ''}`}
      aria-hidden={!open}
    >
      <nav className="site-menu__nav" aria-label="Menu principal">
        <ul className="site-menu__list">
          {links.map((link, index) => (
            <li
              key={link.href}
              className="site-menu__item"
              style={{'--menu-item-delay': `${0.12 + index * 0.07}s`} as CSSProperties}
            >
              <Link href={link.href} className="site-menu__link" onClick={onClose}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <CreatorCredit className="site-menu__credit" />
    </div>
  )
}
