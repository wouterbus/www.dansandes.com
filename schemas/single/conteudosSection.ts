import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'
import {imageOrVideoFileOptions} from '../fields/videoOrGifFile'

export default defineType({
  name: 'conteudosSection',
  title: 'Intro',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      ...headingTextField,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Texto',
      type: 'text',
      rows: 4,
    },
    {
      name: 'image',
      title: 'Imagem (legado)',
      type: 'image',
      options: {hotspot: true},
      hidden: true,
    },
    {
      name: 'media',
      title: 'Imagem ou vídeo',
      type: 'file',
      options: imageOrVideoFileOptions,
      description: 'Tamanho ideal: 1920px x 1920px — Quadrado',
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descreva o conteúdo visual para acessibilidade.',
        },
      ],
    },
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      const text = title?.[0]?.children?.[0]?.text || 'Intro'

      return {
        title: 'Intro',
        subtitle: text,
      }
    },
  },
})