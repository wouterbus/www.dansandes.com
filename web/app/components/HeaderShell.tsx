'use client'

import {useEffect, useRef, useState} from 'react'
import LogoLink from './LogoLink'
import SiteMenu from './SiteMenu'

type HeaderShellProps = {
  defaultLogoUrl?: string
}

const SCROLL_IDLE_MS = 200

export default function HeaderShell({defaultLogoUrl}: HeaderShellProps) {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const idleTimerRef = useRef<number | undefined>(undefined)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) return

    const onScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        setHidden(true)
      }

      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false
        setHidden(false)
      }, SCROLL_IDLE_MS)
    }

    window.addEventListener('scroll', onScroll, {passive: true})

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(idleTimerRef.current)
    }
  }, [menuOpen])

  const toggleMenu = () => setMenuOpen((open) => !open)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header
        className={`site-header${hidden && !menuOpen ? ' site-header--hidden' : ''}`}
      >
        <div className="site-header__inner site-container">
          <LogoLink defaultLogoUrl={defaultLogoUrl} />

          <button
            type="button"
            className={`site-header__menu circle-toggle${menuOpen ? ' circle-toggle--close' : ''}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="circle-toggle__line" />
            <span className="circle-toggle__line" />
          </button>
        </div>
      </header>

      <SiteMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
