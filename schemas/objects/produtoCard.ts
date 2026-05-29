import {defineType} from 'sanity'
import {brandColorField} from '../fields/brandColor'

export default defineType({
  name: 'produtoCard',
  title: 'Produto card',
  type: 'object',
  fields: [
    {
      name: 'cardTitle',
      title: 'Card title (internal)',
      type: 'string',
      description: 'Label for this card in Sanity only — e.g. Sandes Originais, Hub.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
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
    {
      name: 'title',
      title: 'Title (on website)',
      type: 'string',
      description: 'Headline shown on the card front.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'serviceGroups',
      title: 'Services (4 groups)',
      description: 'Exactly 4 groups — each becomes one quadrant in the 2×2 grid.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceGroup',
          fields: [
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.min(1).max(6),
            },
          ],
          preview: {
            select: {items: 'items'},
            prepare({items}: {items?: string[]}) {
              return {
                title: items?.filter(Boolean).join(' · ') || 'Service group',
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.length(4).error('Add exactly 4 service groups (one per grid quadrant).'),
    },
    {...brandColorField},
    {
      name: 'backgroundImage',
      title: 'Background image',
      type: 'image',
      options: {hotspot: true},
      description: 'Shown behind the brand color overlay (slightly visible through the tint).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Expandable paragraph',
      type: 'text',
      rows: 4,
      description: 'Revealed when the visitor taps the arrow button.',
    },
  ],
  preview: {
    select: {
      cardTitle: 'cardTitle',
      title: 'title',
      media: 'logo',
      brandColor: 'brandColor',
    },
    prepare({
      cardTitle,
      title,
      media,
      brandColor,
    }: {
      cardTitle?: string
      title?: string
      media?: unknown
      brandColor?: string
    }) {
      const subtitleParts = [
        cardTitle && title ? title : null,
        brandColor ? `Color: ${brandColor}` : null,
      ].filter(Boolean)

      return {
        title: cardTitle || title || 'Produto card',
        subtitle: subtitleParts.length ? subtitleParts.join(' · ') : undefined,
        media,
      }
    },
  },
})
