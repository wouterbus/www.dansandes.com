import {defineType, type PreviewValue} from 'sanity'
import {brandColorField} from '../fields/brandColor'
import {imageOrVideoFileOptions, videoOrGifFileOptions, webPlayableVideo} from '../fields/videoOrGifFile'
import ClientLogoPicker from '../../components/ClientLogoPicker'

export default defineType({
  name: 'caseStudyItem',
  title: 'Case',
  type: 'object',
  groups: [
    {name: 'content', title: 'Conteúdo', default: true},
    {name: 'media', title: 'Mídia'},
    {name: 'legacy', title: 'Antigo'},
  ],
  fields: [
    {
      name: 'internalName',
      title: 'Nome do case (interno)',
      type: 'string',
      group: 'content',
      description: 'Rótulo visível apenas no Sanity — ex.: Maior Torcedor Libertadores.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'thumb',
      title: 'Miniatura',
      type: 'file',
      group: 'media',
      options: imageOrVideoFileOptions,
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
      description: 'Imagem, MP4, WebM ou GIF circular exibido à esquerda. Vídeos são reproduzidos sem som e em loop.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'clientLogo',
      title: 'Logo do cliente (Logo Grid)',
      type: 'reference',
      group: 'media',
      to: [{type: 'partnerLogo'}],
      components: {
        input: ClientLogoPicker,
      },
      description:
        'Escolha uma das logos do Logo Grid. Ou use o upload abaixo para uma logo exclusiva deste case.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {
            clientLogoCustom?: {asset?: {_ref?: string}}
          }
          const hasGrid = Boolean(
            value && typeof value === 'object' && '_ref' in value && (value as {_ref?: string})._ref,
          )
          const hasCustom = Boolean(parent?.clientLogoCustom?.asset?._ref)
          if (hasGrid || hasCustom) return true
          return 'Escolha uma logo do Logo Grid ou faça upload de uma logo exclusiva.'
        }),
    },
    {
      name: 'clientLogoCustom',
      title: 'Ou upload de logo exclusiva',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
      description:
        'Upload só para este case — não aparece no Logo Grid. Se ambos estiverem preenchidos, o upload tem prioridade no site.',
    },
    {
      name: 'label',
      title: 'Label',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
      options: {layout: 'tags'},
      description:
        'Linha acima do título. Escreva e pressione Enter (ou Tab) para salvar cada item — ex.: “Reality Show Digital”, “Paramount+”. No site aparecem separados por “•”.',
    },
    {
      name: 'headline',
      title: 'Título',
      type: 'string',
      group: 'content',
      description: 'Exibido na cor do case — ex.: O maior torcedor da Conmebol Libertadores.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {title?: unknown[]} | undefined
          if (typeof value === 'string' && value.trim()) return true
          if (parent?.title?.length) return true
          return 'Adicione um título.'
        }),
    },
    {
      name: 'shortDescription',
      title: 'Descrição curta',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Texto abaixo do título, no card do case.',
    },
    {
      name: 'tags',
      title: 'Labels agrupadas',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
      options: {layout: 'tags'},
      description:
        'Escreva e pressione Enter (ou Tab) para salvar cada label e escrever a próxima — ex.: “Branded Entertainment”, “Formato original”.',
    },
    {
      name: 'video',
      title: 'Vídeo',
      type: 'file',
      group: 'media',
      options: videoOrGifFileOptions,
      description:
        'MP4 (H.264), WebM ou GIF. Vídeo exibido no card e no popup ao clicar em “Assistir case”.',
      validation: (Rule) => webPlayableVideo(Rule),
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
    },
    {
      name: 'videoPoster',
      title: 'Thumbnail do vídeo',
      type: 'file',
      group: 'media',
      options: imageOrVideoFileOptions,
      description:
        'Imagem, GIF, MP4 ou WebM que permanece no card antes de abrir o case. Opcional — se não preenchida, usa a Miniatura.',
    },
    {
      name: 'description',
      title: 'Descrição completa (popup do vídeo)',
      type: 'text',
      rows: 10,
      group: 'content',
      description: 'Texto exibido ao lado do vídeo no popup. Linhas em branco criam parágrafos.',
    },
    {...brandColorField, group: 'content'},
    {
      name: 'title',
      title: 'Título (legado)',
      group: 'legacy',
      type: 'array',
      of: [{type: 'block'}],
      hidden: true,
      readOnly: true,
      description: 'Substituído por “Título”. Mantido apenas para não perder conteúdo antigo.',
    },
    {
      name: 'subtitle',
      title: 'Subtítulo (legado)',
      type: 'string',
      group: 'legacy',
      hidden: true,
      readOnly: true,
    },
    {
      name: 'paragraph',
      title: 'Texto (legado)',
      type: 'text',
      rows: 6,
      group: 'legacy',
      hidden: true,
      readOnly: true,
    },
  ],
  preview: {
    select: {
      internalName: 'internalName',
      headline: 'headline',
      title: 'title',
      media: 'thumb',
      brandColor: 'brandColor',
    },
    prepare({
      internalName,
      headline,
      title,
      media,
      brandColor,
    }: {
      internalName?: string
      headline?: string
      title?: {children?: {text?: string}[]}[]
      media?: PreviewValue['media']
      brandColor?: string
    }) {
      const titleText = headline || title?.[0]?.children?.map((c) => c.text).join('') || ''
      return {
        title: internalName || titleText || 'Case',
        subtitle: [
          titleText && internalName ? titleText : null,
          brandColor ? `Cor: ${brandColor}` : null,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
