import {defineType, type PreviewValue} from 'sanity'
import {produtoBrandColorField} from '../fields/brandColor'
import {videoOrGifFileOptions, webPlayableVideo} from '../fields/videoOrGifFile'

export default defineType({
  name: 'produtoCard',
  title: 'Card de produto',
  type: 'object',
  fields: [
    {
      name: 'cardTitle',
      title: 'Título do card (interno)',
      type: 'string',
      description: 'Rótulo apenas para organização no Sanity. Ex.: Sandes Originais, Hub.',
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
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Título no site',
      type: 'string',
      description: 'Frase principal exibida na frente do card.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'serviceGroups',
      title: 'Serviços',
      description: 'Adicione exatamente 4 grupos. Cada grupo vira uma área do grid.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceGroup',
          fields: [
            {
              name: 'items',
              title: 'Itens',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Liste os serviços deste grupo.',
              validation: (Rule) => Rule.min(1).max(6),
            },
          ],
          preview: {
            select: {items: 'items'},
            prepare({items}: {items?: string[]}) {
              return {
                title: items?.filter(Boolean).join(' · ') || 'Grupo de serviços',
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.length(4).error('Adicione exatamente 4 grupos de serviços.'),
    },
    {...produtoBrandColorField},
    {
      name: 'backgroundImage',
      title: 'Imagem de fundo',
      type: 'image',
      options: {hotspot: true},
      description: 'Tamanho ideal: 1080px x 1920px.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {backgroundVideo?: {asset?: {_ref?: string}}}
          const image = value as {asset?: {_ref?: string}} | undefined
          if (!image?.asset && !parent?.backgroundVideo?.asset) {
            return 'Adicione uma imagem ou vídeo de fundo'
          }
          return true
        }),
    },
    {
      name: 'backgroundVideo',
      title: 'Vídeo de fundo',
      type: 'file',
      options: videoOrGifFileOptions,
      description: 'Use MP4 (H.264), WebM ou GIF animado. Tamanho ideal: 1080px x 1920px.',
      validation: (Rule) => webPlayableVideo(Rule),
    },
    {
      name: 'body',
      title: 'Texto expansível',
      type: 'text',
      rows: 4,
      description: 'Texto exibido quando o visitante toca no botão de seta.',
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
      media?: PreviewValue['media']
      brandColor?: string
    }) {
      const subtitleParts = [
        cardTitle && title ? title : null,
        brandColor ? `Cor: ${brandColor}` : null,
      ].filter(Boolean)

      return {
        title: cardTitle || title || 'Card de produto',
        subtitle: subtitleParts.length ? subtitleParts.join(' · ') : undefined,
        media,
      }
    },
  },
})