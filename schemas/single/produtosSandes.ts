import {defineType} from 'sanity'

export default defineType({
  name: 'produtosSandes',
  title: 'Produtos Sandes',
  type: 'document',
  fields: [
    {
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{type: 'produtoCard'}],
      validation: (Rule) => Rule.min(1).max(6),
    },
  ],
  preview: {
    select: {cards: 'cards'},
    prepare({cards}: {cards?: unknown[]}) {
      const count = cards?.length || 0
      return {
        title: 'Produtos Sandes',
        subtitle: `${count} card${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
