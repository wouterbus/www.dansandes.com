import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'

export default defineType({
  name: 'casesSection',
  title: 'Cases',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título da secção',
      description:
        'Selecione o texto → “Cor de destaque” para colorir parte do título. Ex.: “Quando a história é boa,” + “a marca faz parte da conversa”.',
      ...headingTextField,
    },
    {
      name: 'items',
      title: 'Cases',
      type: 'array',
      of: [{type: 'caseStudyItem'}],
      validation: (Rule) => Rule.min(1),
    },
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}: {title?: {children?: {text?: string}[]}[]; items?: unknown[]}) {
      const count = items?.length || 0
      const titleText = title?.[0]?.children?.map((c) => c.text).join('') || ''
      return {
        title: 'Cases',
        subtitle: [titleText, `${count} case${count !== 1 ? 's' : ''}`]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
