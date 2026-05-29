import {defineType} from 'sanity'

export default defineType({
  name: 'partnerLogo',
  title: 'Partner logo',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name (internal)',
      type: 'string',
      description: 'e.g. CONMEBOL Libertadores — used when picking this logo in Cases.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {title: 'name', media: 'image'},
  },
})
