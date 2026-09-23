export type ScrollParticleConfig = {
  id: string
  color: string
  size: string
  top?: string
  left?: string
  right?: string
  bottom?: string
  speed: number
  drift?: number
  rotate?: number
  scaleMin: number
  scaleMax: number
  opacityMin: number
  opacityMax: number
  animationDelay?: string
  zIndex?: number
  hideOnMobile?: boolean
  /** Only render below the mobile breakpoint (desktop keeps its own particles). */
  mobileOnly?: boolean
  hideBelow?: number
  mobile?: {
    size?: string
    top?: string
    left?: string
    right?: string
    bottom?: string
    hide?: boolean
    speed?: number
    drift?: number
  }
}

const RED = '#c92034'
const ORANGE = '#f1562b'
const YELLOW = '#f69120'
const GREEN = '#76956c'
const PURPLE = '#9a489a'

/**
 * Deterministic 0–1 value from a seed string. Keeps per-case size/position
 * variation stable across refreshes and between server and client render.
 */
function stableFraction(seed: string, salt = 0): number {
  let hash = salt
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 1000) / 1000
}

/** One floating circle per case: alternating sides on desktop; mobile tucks
 *  top-right behind the thumbnail. */
export function buildCaseParticle(
  seed: string,
  index: number,
  colorVar: string,
): ScrollParticleConfig {
  const sizeMix = stableFraction(seed, 7)
  const placeMix = stableFraction(seed, 23)
  const sizeScale = 0.8 + sizeMix * 0.45
  const onRight = index % 2 === 0
  const edge = `${-(6 + placeMix * 8).toFixed(1)}%`
  const side = onRight ? {right: edge} : {left: edge}

  return {
    id: `case-particle-${seed}`,
    color: `var(${colorVar})`,
    size: `calc(clamp(132px, 17vw, 236px) * ${sizeScale.toFixed(3)})`,
    top: `${(-18 + placeMix * 40).toFixed(1)}%`,
    ...side,
    speed: 0.17 + sizeMix * 0.11,
    drift: 26 + placeMix * 18,
    rotate: onRight ? 9 : -9,
    scaleMin: 0.78,
    scaleMax: 1.32,
    opacityMin: 1,
    opacityMax: 1,
    zIndex: 0,
    mobile: {
      // Overlap the thumb’s top-right rim, particle behind.
      size: `calc(clamp(96px, 30vw, 140px) * ${sizeScale.toFixed(3)})`,
      top: `${(-8 + placeMix * 6).toFixed(1)}%`,
      left: `calc(var(--case-thumb-size) * ${(0.58 + placeMix * 0.1).toFixed(3)})`,
      right: 'auto',
    },
  }
}

/**
 * Distance from the viewport's right edge to the left edge of the hero video
 * circle, plus a gap. `.hero__visual` and the particle layer share `.hero` as
 * their containing block, so these custom properties resolve identically.
 */
const HERO_CIRCLE_LEFT_EDGE = (gap: string) =>
  `calc(var(--hero-circle-size) + var(--hero-circle-offset-x) + ${gap})`

export const HERO_PARTICLES: ScrollParticleConfig[] = [
  {
    id: 'hero-green',
    color: GREEN,
    size: 'clamp(120px, 19vw, 220px)',
    bottom: '8%',
    left: '2%',
    speed: 0.22,
    drift: 34,
    rotate: 11,
    scaleMin: 0.72,
    scaleMax: 1.48,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.2s',
    mobile: {
      size: 'clamp(76px, 23vw, 112px)',
      bottom: '11%',
      left: '-4%',
    },
  },
  {
    id: 'hero-red',
    color: RED,
    size: 'clamp(56px, 8vw, 96px)',
    top: '44%',
    // Tracks the left edge of the hero video circle instead of a flat
    // percentage: the circle's width is capped, so a fixed % slides under it
    // on very wide screens.
    right: HERO_CIRCLE_LEFT_EDGE('clamp(20px, 2.5vw, 56px)'),
    speed: 0.28,
    drift: 38,
    rotate: -12,
    scaleMin: 0.68,
    scaleMax: 1.55,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.45s',
    zIndex: 2,
    // The circle is centred on mobile, so anchor to the left edge instead of
    // tracking its right-hand side.
    mobile: {
      size: 'clamp(58px, 17vw, 86px)',
      top: '31%',
      left: '5%',
    },
  },
  {
    id: 'hero-yellow',
    color: YELLOW,
    size: 'clamp(30px, 4vw, 52px)',
    top: '66%',
    right: HERO_CIRCLE_LEFT_EDGE('clamp(4px, 0.8vw, 20px)'),
    speed: 0.31,
    drift: 30,
    rotate: 14,
    scaleMin: 0.7,
    scaleMax: 1.52,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.65s',
    zIndex: 2,
    mobile: {
      size: 'clamp(32px, 10vw, 48px)',
      top: '46%',
      left: '17%',
    },
  },
]

/**
 * Intro band particles.
 * Desktop: single green bleeding off the right (unchanged).
 * Mobile: yellow behind the portrait, orange on the rim, smaller green lower-right.
 */
export const CONTEUDOS_PARTICLES_BEHIND: ScrollParticleConfig[] = [
  {
    id: 'conteudos-green-right',
    color: GREEN,
    size: 'clamp(76px, 11vw, 116px)',
    top: '24%',
    // Fixed px, not a percentage: a % offset scales with the viewport and
    // pushes the circle almost entirely off-screen on wide displays.
    right: '-30px',
    speed: 0.26,
    drift: 40,
    rotate: -10,
    scaleMin: 0.7,
    scaleMax: 1.48,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.35s',
    hideOnMobile: true,
  },
  {
    id: 'conteudos-yellow-tr',
    mobileOnly: true,
    color: YELLOW,
    size: 'clamp(88px, 32vw, 128px)',
    // Full circle stays on-canvas — overlap the portrait’s top-right rim.
    top: 'calc(var(--conteudos-circle) * 0.02)',
    right: 'calc(50% - var(--conteudos-circle) * 0.42)',
    speed: 0.22,
    drift: 28,
    rotate: -8,
    scaleMin: 0.78,
    scaleMax: 1.28,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.2s',
  },
]

export const CONTEUDOS_PARTICLES_FRONT: ScrollParticleConfig[] = [
  {
    id: 'conteudos-orange-rim',
    mobileOnly: true,
    color: ORANGE,
    size: 'clamp(42px, 13vw, 58px)',
    top: 'calc(var(--conteudos-circle) * 0.7)',
    right: 'calc(50% - var(--conteudos-circle) * 0.48)',
    speed: 0.28,
    drift: 22,
    rotate: 12,
    scaleMin: 0.82,
    scaleMax: 1.32,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.4s',
    zIndex: 2,
  },
  {
    id: 'conteudos-green-br',
    mobileOnly: true,
    color: GREEN,
    size: 'clamp(36px, 12vw, 52px)',
    top: 'calc(var(--conteudos-circle) + clamp(56px, 14vh, 110px))',
    right: '8%',
    speed: 0.3,
    drift: 18,
    rotate: -10,
    scaleMin: 0.8,
    scaleMax: 1.36,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.55s',
  },
]

export const CONTEUDOS_PARTICLES: ScrollParticleConfig[] = [
  ...CONTEUDOS_PARTICLES_BEHIND,
  ...CONTEUDOS_PARTICLES_FRONT,
]

/**
 * Logo band: yellow accents the left of the grid on desktop; purple hangs
 * past the bottom edge onto the video banner (in front of it).
 */
export const LOGOS_PARTICLES: ScrollParticleConfig[] = [
  {
    id: 'logos-yellow',
    color: YELLOW,
    size: 'clamp(84px, 12vw, 128px)',
    top: '2%',
    left: '15%',
    speed: 0.24,
    drift: 32,
    rotate: 9,
    scaleMin: 0.72,
    scaleMax: 1.44,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.15s',
    // On mobile this yellow lives behind the intro portrait instead.
    mobile: {hide: true},
  },
  {
    id: 'logos-green-small',
    color: GREEN,
    size: 'clamp(28px, 3.6vw, 44px)',
    top: '53%',
    left: '33%',
    speed: 0.32,
    drift: 24,
    rotate: -11,
    scaleMin: 0.68,
    scaleMax: 1.58,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.4s',
    mobile: {hide: true},
  },
  {
    id: 'logos-purple',
    color: PURPLE,
    size: 'clamp(80px, 12vw, 120px)',
    bottom: '-16%',
    left: '2%',
    speed: 0.27,
    drift: 26,
    rotate: 12,
    scaleMin: 0.74,
    scaleMax: 1.4,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.55s',
    mobile: {
      size: 'clamp(56px, 16vw, 80px)',
      // At most half the circle over the video top edge; left padding.
      bottom: 'calc(clamp(56px, 16vw, 80px) * -0.5)',
      left: 'clamp(16px, 5vw, 28px)',
      speed: 0.08,
      drift: 6,
    },
  },
]

export const PRODUTOS_PARTICLES: ScrollParticleConfig[] = [
  {
    id: 'produtos-orange-tl',
    color: ORANGE,
    size: 'clamp(168px, 17vw, 240px)',
    top: '-4%',
    left: '0',
    speed: 0.21,
    drift: 34,
    rotate: 9,
    scaleMin: 0.76,
    scaleMax: 1.36,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.1s',
    mobile: {
      size: 'clamp(64px, 19vw, 92px)',
      top: '2%',
      left: '-8%',
    },
  },
  {
    id: 'produtos-green-mid',
    color: GREEN,
    size: 'clamp(36px, 3.5vw, 48px)',
    top: '42%',
    left: '4%',
    speed: 0.33,
    drift: 28,
    rotate: -14,
    scaleMin: 0.64,
    scaleMax: 1.62,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.3s',
    mobile: {
      size: 'clamp(28px, 8vw, 40px)',
      top: '48%',
      left: '0',
    },
  },
  {
    id: 'produtos-yellow-bl',
    color: YELLOW,
    size: 'clamp(64px, 6vw, 88px)',
    top: '78%',
    left: '6%',
    speed: 0.35,
    drift: 22,
    rotate: 13,
    scaleMin: 0.66,
    scaleMax: 1.54,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.45s',
    mobile: {hide: true},
  },
  {
    id: 'produtos-yellow-tr',
    color: YELLOW,
    size: 'clamp(52px, 5vw, 68px)',
    top: '-2%',
    right: '3%',
    speed: 0.31,
    drift: 26,
    rotate: -12,
    scaleMin: 0.68,
    scaleMax: 1.5,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.2s',
    mobile: {
      size: 'clamp(32px, 9vw, 44px)',
      top: '24%',
      right: '-2%',
    },
  },
  {
    id: 'produtos-orange-mr',
    color: ORANGE,
    size: 'clamp(112px, 11vw, 156px)',
    top: '36%',
    right: '0',
    speed: 0.25,
    drift: 38,
    rotate: 10,
    scaleMin: 0.72,
    scaleMax: 1.44,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.55s',
    mobile: {hide: true},
  },
  {
    id: 'produtos-purple-br',
    color: PURPLE,
    size: 'clamp(148px, 15vw, 204px)',
    top: '76%',
    right: '0',
    speed: 0.19,
    drift: 32,
    rotate: -8,
    scaleMin: 0.78,
    scaleMax: 1.32,
    opacityMin: 1,
    opacityMax: 1,
    animationDelay: '0.7s',
    mobile: {
      size: 'clamp(72px, 21vw, 100px)',
      bottom: '3%',
      right: '-6%',
    },
  },
]
