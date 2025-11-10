import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'case',
  title: 'Cases',
  type: 'document',
  fields: [
    defineField({name: 'titulo', title: 'Título', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'descricao', title: 'Descrição', type: 'text'}),
    defineField({
      name: 'reel',
      title: 'Reel do Case (MP4, MOV, MPEG)',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineField({name: 'thumbnail', title: 'Thumbnail', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'galeria',
      title: 'Galeria de Fotos / GIFs',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {sortable: true},
    }),
    defineField({
      name: 'videosExtras',
      title: 'Vídeos Extras',
      type: 'array',
      of: [{type: 'file', options: {accept: 'video/*'}}],
      options: {sortable: true},
    }),
    defineField({
      name: 'fichaTecnica',
      title: 'Ficha Técnica',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'nome', title: 'Nome', type: 'string'}),
            defineField({name: 'cargo', title: 'Cargo', type: 'string'}),
          ],
          preview: {select: {title: 'nome', subtitle: 'cargo'}},
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'titulo', media: 'thumbnail', subtitle: 'descricao'},
  },
})

