import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footerPrices',
  title: 'Footer: Prices / Awards',
  type: 'document',
  fields: [
    defineField({
      name: 'logos',
      title: 'Price Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {storeOriginalFilename: true},
        },
      ],
      options: {sortable: true},
      description: 'Upload multiple SVG logos (also supports PNG/JPG).',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Prices / Awards'}
    },
  },
})

