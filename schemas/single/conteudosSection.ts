import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'
import {imageOrVideoFileOptions} from '../fields/videoOrGifFile'

export default defineType({
  name: 'conteudosSection',
  title: 'Conteúdos e Formatos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description:
        'Select text and use “Highlight color” for bold colored words (red, orange, yellow, green, purple)',
      ...headingTextField,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
    },
    {
      name: 'image',
      title: 'Image (legacy)',
      type: 'image',
      options: {hotspot: true},
      hidden: true,
    },
    {
      name: 'media',
      title: 'Image or video',
      type: 'file',
      options: imageOrVideoFileOptions,
      description: 'Photo (JPG/PNG/WebP), video (MP4/MOV), or GIF. Compress large videos to ~5–15 MB.',
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the visual for accessibility',
        },
      ],
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    },
    {
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'url',
    },
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      const text = title?.[0]?.children?.[0]?.text || 'Conteúdos e Formatos'
      return {title: 'Conteúdos e Formatos', subtitle: text}
    },
  },
})
