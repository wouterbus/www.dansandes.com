import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'
import {videoOrGifFileOptions, webPlayableVideo} from '../fields/videoOrGifFile'

export default defineType({
  name: 'heroBanner',
  title: 'Banner hero (Reel)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título H1',
      ...headingTextField,
    },
    {
      name: 'awards',
      title: 'Prêmios',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descreva a faixa de prêmios para acessibilidade.',
        },
      ],
    },
    {
      name: 'video',
      title: 'Vídeo ou GIF',
      type: 'file',
      options: videoOrGifFileOptions,
      description: 'MP4 (H.264), WebM ou GIF. Tamanho ideal: 1920px x 1920px — Quadrado.',
      validation: (Rule) => [Rule.required(), webPlayableVideo(Rule)],
    },
    {
      name: 'alt',
      title: 'Texto alternativo do vídeo',
      type: 'string',
      description: 'Descreva o conteúdo do vídeo para acessibilidade.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      alt: 'alt',
      awards: 'awards',
    },
    prepare({title, alt, awards}) {
      const titleText = title?.[0]?.children?.[0]?.text || alt || 'Banner hero (Reel)'
      return {
        title: 'Banner hero (Reel)',
        subtitle: titleText,
        media: awards,
      }
    },
  },
})