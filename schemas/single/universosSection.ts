import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'
import {videoOrGifFileOptions, webPlayableVideo} from '../fields/videoOrGifFile'

export default defineType({
  name: 'universosSection',
  title: 'Video Banner',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      ...headingTextField,
    },
    {
      name: 'video',
      title: 'Background Video or GIF',
      type: 'file',
      options: videoOrGifFileOptions,
      description: 'MP4 (H.264), WebM ou GIF animado',
      validation: (Rule) => [Rule.required(), webPlayableVideo(Rule)],
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
      const text = title?.[0]?.children?.[0]?.text || 'Video Banner'
      return {title: 'Video Banner', subtitle: text, media}
    },
  },
})
