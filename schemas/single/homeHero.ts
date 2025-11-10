import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homeHero',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'video',
      title: 'Vídeo (MP4, MOV, MPEG)',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineField({name: 'alt', title: 'Alt', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Hero Banner'}
    },
  },
})

