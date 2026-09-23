export const BRAND_COLOR_HEX = {
  red: '#C92034',
  orange: '#F1562B',
  yellow: '#F69120',
  green: '#76956C',
  purple: '#9A489A',
} as const

export const BRAND_COLOR_OPTIONS = [
  {title: 'Red', value: 'red', hex: BRAND_COLOR_HEX.red},
  {title: 'Orange', value: 'orange', hex: BRAND_COLOR_HEX.orange},
  {title: 'Yellow', value: 'yellow', hex: BRAND_COLOR_HEX.yellow},
  {title: 'Green', value: 'green', hex: BRAND_COLOR_HEX.green},
  {title: 'Purple', value: 'purple', hex: BRAND_COLOR_HEX.purple},
] as const

/** Produtos Sandes — Red · Yellow · Green only. */
export const PRODUTO_BRAND_COLOR_OPTIONS = [
  {title: 'Red', value: 'red', hex: BRAND_COLOR_HEX.red},
  {title: 'Yellow', value: 'yellow', hex: BRAND_COLOR_HEX.yellow},
  {title: 'Green', value: 'green', hex: BRAND_COLOR_HEX.green},
] as const

export type BrandColor = (typeof BRAND_COLOR_OPTIONS)[number]['value']
export type ProdutoBrandColor = (typeof PRODUTO_BRAND_COLOR_OPTIONS)[number]['value']

export type BrandColorSwatch = {
  title: string
  value: string
  hex: string
}
