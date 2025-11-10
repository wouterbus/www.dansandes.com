import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homeLogoCarousel',
  title: 'Logo Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt', type: 'string'}),
          ],
        },
      ],
      options: {layout: 'grid'},
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Logo Carousel'}
    },
  },
})

