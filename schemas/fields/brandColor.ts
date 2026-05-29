export const BRAND_COLOR_OPTIONS = [
  {title: 'Red', value: 'red'},
  {title: 'Orange', value: 'orange'},
  {title: 'Yellow', value: 'yellow'},
  {title: 'Green', value: 'green'},
  {title: 'Purple', value: 'purple'},
] as const

export type BrandColor = (typeof BRAND_COLOR_OPTIONS)[number]['value']

export const brandColorField = {
  name: 'brandColor',
  title: 'Brand color',
  type: 'string',
  options: {
    list: [...BRAND_COLOR_OPTIONS],
    layout: 'radio',
  },
  validation: (Rule: {required: () => unknown}) => Rule.required(),
}
