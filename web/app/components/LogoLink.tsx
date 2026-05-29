'use client'

import Link from 'next/link'
import {useState} from 'react'
import LogoMark from './LogoMark'

type LogoLinkProps = {
  defaultLogoUrl?: string
}

export default function LogoLink({defaultLogoUrl}: LogoLinkProps) {
  const [hovering, setHovering] = useState(false)

  return (
    <Link
      href="/"
      className="site-header__logo"
      aria-label="Sandes home"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <LogoMark
        playing={hovering}
        defaultSrc={defaultLogoUrl}
        className="site-header__logo-img"
        priority
      />
    </Link>
  )
}
