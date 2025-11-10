import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footerContactCard',
  title: 'Footer: Contact Card',
  type: 'document',
  fields: [
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Card'}
    },
  },
})

