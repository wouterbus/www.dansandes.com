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
  preview: {
    select: {
      logos: 'logos',
    },
    prepare({logos}) {
      const count = logos?.length || 0
      return {
        title: 'Logo Carousel',
        subtitle: `${count} logo${count !== 1 ? 's' : ''}`,
        media: logos?.[0],
      }
    },
  },
})
