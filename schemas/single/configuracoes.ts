import {defineType} from 'sanity'

export default defineType({
  name: 'configuracoes',
  title: 'Configurações',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      logo: 'logo',
    },
    prepare({title, logo}) {
      const titleText = title?.[0]?.children?.[0]?.text || 'Configurações'
      return {
        title: 'Configurações',
        subtitle: titleText,
        media: logo,
      }
    },
  },
})
