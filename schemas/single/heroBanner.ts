import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'
import {videoOrGifFileOptions} from '../fields/videoOrGifFile'

export default defineType({
  name: 'heroBanner',
  title: 'Hero Banner (Reel)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'H1 Title',
      description:
        'Select text and use “Highlight color” for bold colored words (red, orange, yellow, green, purple)',
      ...headingTextField,
    },
    {
      name: 'awards',
      title: 'Awards',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the awards strip for accessibility',
        },
      ],
    },
    {
      name: 'video',
      title: 'Video or GIF',
      type: 'file',
      options: videoOrGifFileOptions,
      description:
        'MP4/WebM/MOV or animated GIF. If upload hangs, compress to MP4 (~5–15 MB) and retry. Large files (80 MB+) often time out in the browser.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Video Alt Text',
      type: 'string',
      description: 'Describe the video content for accessibility',
    },
  ],
  preview: {
    select: {
      title: 'title',
      alt: 'alt',
      awards: 'awards',
    },
    prepare({title, alt, awards}) {
      const titleText = title?.[0]?.children?.[0]?.text || alt || 'Hero Banner (Reel)'
      return {
        title: 'Hero Banner (Reel)',
        subtitle: titleText,
        media: awards,
      }
    },
  },
})
