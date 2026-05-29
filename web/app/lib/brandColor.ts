export type BrandColor = 'red' | 'orange' | 'yellow' | 'green' | 'purple'

const BRAND_CSS_VAR: Record<BrandColor, string> = {
  red: '--color-red',
  orange: '--color-orange',
  yellow: '--color-yellow',
  green: '--color-green',
  purple: '--color-purple',
}

export function brandColorVar(color?: string | null): string {
  if (color && color in BRAND_CSS_VAR) {
    return BRAND_CSS_VAR[color as BrandColor]
  }
  return '--color-red'
}
