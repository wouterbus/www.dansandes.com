import {defineField} from 'sanity'
import BrandColorInput from '../../components/BrandColorInput'
import {BRAND_COLOR_OPTIONS, PRODUTO_BRAND_COLOR_OPTIONS} from './brandColorTokens'

export {BRAND_COLOR_HEX, BRAND_COLOR_OPTIONS, PRODUTO_BRAND_COLOR_OPTIONS} from './brandColorTokens'
export type {BrandColor, ProdutoBrandColor} from './brandColorTokens'

export const brandColorInput = {
  type: 'string' as const,
  components: {
    input: BrandColorInput,
  },
  options: {
    list: BRAND_COLOR_OPTIONS.map(({title, value}) => ({title, value})),
    colors: [...BRAND_COLOR_OPTIONS],
    shape: 'circle' as const,
  },
}

export const brandColorField = defineField({
  name: 'brandColor',
  title: 'Brand color',
  ...brandColorInput,
  validation: (Rule) => Rule.required(),
})

/** Produtos Sandes: Red · Yellow · Green as square swatches. */
export const produtoBrandColorField = defineField({
  name: 'brandColor',
  title: 'Brand color',
  type: 'string',
  components: {
    input: BrandColorInput,
  },
  options: {
    list: PRODUTO_BRAND_COLOR_OPTIONS.map(({title, value}) => ({title, value})),
    colors: [...PRODUTO_BRAND_COLOR_OPTIONS],
    shape: 'box',
  },
  validation: (Rule) =>
    Rule.required().custom((value) => {
      if (!value) return 'Escolha uma cor.'
      if (PRODUTO_BRAND_COLOR_OPTIONS.some((option) => option.value === value)) return true
      // Legacy orange cards: still valid until re-saved as yellow.
      if (value === 'orange') return true
      return 'Escolha vermelho, amarelo ou verde.'
    }),
})
