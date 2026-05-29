import {defineType} from 'sanity'
import {videoOrGifFileOptions} from '../fields/videoOrGifFile'

export default defineType({
  name: 'cases',
  title: 'Cases',
  type: 'document',
  fields: [
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'videoPrincipal',
      title: 'Video or GIF Principal',
      type: 'file',
      options: videoOrGifFileOptions,
      description: 'MP4/WebM video or animated GIF',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'paragrafo',
      title: 'Parágrafo',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tag',
      media: 'thumbnail',
    },
    prepare({title, subtitle, media}) {
      // Extract plain text from block content for preview
      const titleText = title?.[0]?.children?.[0]?.text || 'Untitled'
      const subtitleText = subtitle?.[0]?.children?.[0]?.text || ''
      return {
        title: titleText,
        subtitle: subtitleText,
        media,
      }
    },
  },
})
