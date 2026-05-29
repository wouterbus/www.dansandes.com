import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'
import {videoOrGifFileOptions} from '../fields/videoOrGifFile'

export default defineType({
  name: 'universosSection',
  title: 'Universos (Parallax Video)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description:
        'Select text and use “Highlight color” for bold colored words (red, orange, yellow, green, purple)',
      ...headingTextField,
    },
    {
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
    },
    {
      name: 'video',
      title: 'Background Video or GIF',
      type: 'file',
      options: videoOrGifFileOptions,
      description: 'MP4/WebM video or animated GIF',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'videoAlt',
      title: 'Video Alt Text',
      type: 'string',
    },
  ],
  preview: {
    select: {title: 'title', media: 'video'},
    prepare({title, media}) {
      const text = title?.[0]?.children?.[0]?.text || 'Universos (Parallax Video)'
      return {title: 'Universos (Parallax Video)', subtitle: text, media}
    },
  },
})
