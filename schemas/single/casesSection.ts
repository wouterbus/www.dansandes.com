import {defineType} from 'sanity'

export default defineType({
  name: 'casesSection',
  title: 'Cases',
  type: 'document',
  fields: [
    {
      name: 'items',
      title: 'Cases',
      type: 'array',
      of: [{type: 'caseStudyItem'}],
      validation: (Rule) => Rule.min(1),
    },
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}: {items?: unknown[]}) {
      const count = items?.length || 0
      return {
        title: 'Cases',
        subtitle: `${count} case${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
