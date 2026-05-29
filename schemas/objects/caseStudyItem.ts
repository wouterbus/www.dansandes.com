import {defineType} from 'sanity'
import {brandColorField} from '../fields/brandColor'
import {headingTextField} from '../fields/headingText'
import {videoOrGifFileOptions} from '../fields/videoOrGifFile'

export default defineType({
  name: 'caseStudyItem',
  title: 'Case',
  type: 'object',
  fields: [
    {
      name: 'internalName',
      title: 'Case name (internal)',
      type: 'string',
      description: 'Label in Sanity only — e.g. Maior Torcedor Libertadores.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'thumb',
      title: 'Thumb',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        },
      ],
      description: 'Circular image on the left.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      description:
        'Select text → “Highlight color” to mark emphasis (shows white on the title bar). Use Bold for heavier type on that phrase.',
      ...headingTextField,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'clientLogo',
      title: 'Client logo',
      type: 'reference',
      to: [{type: 'partnerLogo'}],
      description: 'Pick a logo from the Logo Grid library (Partner logos).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'video',
      title: 'Video',
      type: 'file',
      options: videoOrGifFileOptions,
      description: 'Shown below the thumb, left of the subtitle and paragraph.',
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        },
      ],
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'paragraph',
      title: 'Paragraph',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    },
    {...brandColorField},
  ],
  preview: {
    select: {
      internalName: 'internalName',
      title: 'title',
      media: 'thumb',
      brandColor: 'brandColor',
    },
    prepare({
      internalName,
      title,
      media,
      brandColor,
    }: {
      internalName?: string
      title?: {children?: {text?: string}[]}[]
      media?: unknown
      brandColor?: string
    }) {
      const titleText = title?.[0]?.children?.map((c) => c.text).join('') || ''
      return {
        title: internalName || titleText || 'Case',
        subtitle: [titleText && internalName ? titleText : null, brandColor ? `Color: ${brandColor}` : null]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
