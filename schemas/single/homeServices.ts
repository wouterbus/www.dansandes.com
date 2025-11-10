import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homeServices',
  title: 'Serviços',
  type: 'document',
  fields: [
    defineField({name: 'titulo', title: 'Título', type: 'string'}),
    defineField({
      name: 'itens',
      title: 'Subtítulo + Descrição',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'subtitulo', title: 'Subtítulo', type: 'string'}),
            defineField({name: 'descricao', title: 'Descrição', type: 'text'}),
          ],
          preview: {select: {title: 'subtitulo'}},
        },
      ],
      options: {sortable: true},
    }),
  ],
  preview: {
    select: {title: 'titulo'},
    prepare({title}) {
      return {title: title || 'Serviços'}
    },
  },
})

