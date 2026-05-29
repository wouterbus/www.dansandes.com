'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'

export const LOGO_FALLBACK = '/logo/3_LARANJA.svg'

export const LOGO_FRAMES = [
  {src: '/logo/3_VERMELHO.svg', alt: 'Sandes logo vermelho'},
  {src: '/logo/3_LARANJA.svg', alt: 'Sandes logo laranja'},
  {src: '/logo/3_AMARELO.svg', alt: 'Sandes logo amarelo'},
  {src: '/logo/3_VERDE.svg', alt: 'Sandes logo verde'},
  {src: '/logo/3_ROXO.svg', alt: 'Sandes logo roxo'},
] as const

const FRAME_MS = 110

type LogoMarkProps = {
  playing?: boolean
  defaultSrc?: string
  size?: number
  className?: string
  priority?: boolean
}

export default function LogoMark({
  playing = false,
  defaultSrc,
  size = 72,
  className = '',
  priority = false,
}: LogoMarkProps) {
  const idleSrc = defaultSrc || LOGO_FALLBACK
  const [frameIndex, setFrameIndex] = useState(-1)

  useEffect(() => {
    LOGO_FRAMES.forEach((frame) => {
      const img = new window.Image()
      img.src = frame.src
    })
    const img = new window.Image()
    img.src = idleSrc
  }, [idleSrc])

  useEffect(() => {
    if (!playing) {
      setFrameIndex(-1)
      return
    }

    let index = 0
    setFrameIndex(0)

    const interval = window.setInterval(() => {
      index = (index + 1) % LOGO_FRAMES.length
      setFrameIndex(index)
    }, FRAME_MS)

    return () => window.clearInterval(interval)
  }, [playing])

  const src = frameIndex >= 0 ? LOGO_FRAMES[frameIndex].src : idleSrc
  const alt = frameIndex >= 0 ? LOGO_FRAMES[frameIndex].alt : 'Sandes'
  const isLocalSvg = src.startsWith('/logo/')

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      priority={priority}
      unoptimized={isLocalSvg}
    />
  )
}
