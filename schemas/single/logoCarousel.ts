import {defineType} from 'sanity'

export default defineType({
  name: 'logoCarousel',
  title: 'Logo Carousel',
  type: 'document',
  fields: [
    {
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
})

