import {defineType} from 'sanity'

export default defineType({
  name: 'heroBanner',
  title: 'Hero Banner (Reel)',
  type: 'document',
  fields: [
    {
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alt Text / Description',
      type: 'string',
      description: 'Describe the video content for accessibility',
    },
  ],
  preview: {
    select: {
      alt: 'alt',
    },
    prepare({alt}) {
      return {
        title: 'Hero Banner (Reel)',
        subtitle: alt || 'Video banner',
      }
    },
  },
})


