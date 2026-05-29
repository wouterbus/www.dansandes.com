import {defineType} from 'sanity'

export default defineType({
  name: 'logoCarousel',
  title: 'Logo Grid',
  type: 'document',
  fields: [
    {
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'partnerLogo'}],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {logos: 'logos'},
    prepare({logos}: {logos?: unknown[]}) {
      const count = logos?.length || 0
      return {
        title: 'Logo Grid',
        subtitle: `${count} logo${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
