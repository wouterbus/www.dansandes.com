import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produtos',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug/Link (/produtos/[input])',
      type: 'slug',
      options: {
        source: 'titulo',
        slugify: (input) => input.toLowerCase().trim().replace(/\s+/g, '-').slice(0, 200),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'titulo', title: 'Título', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'logo', title: 'Logo (SVG, PNG, JPG)', type: 'image', options: {hotspot: true}}),
    defineField({name: 'tagline', title: 'Tagline', type: 'text'}),
    defineField({name: 'descricaoCurta', title: 'Descrição curta', type: 'text'}),
    defineField({name: 'paragrafo', title: 'Parágrafo', type: 'text'}),
    defineField({
      name: 'corPrimaria',
      title: 'Cor Primária (HEX)',
      type: 'string',
      description: 'Cor em formato hexadecimal, por exemplo #FF6600',
      validation: (Rule) => Rule.regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).error('Use um HEX válido, ex: #FF6600'),
    }),
    defineField({
      name: 'servicos',
      title: 'Serviços',
      description: 'Digite um serviço e pressione Enter para adicionar mais.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
  ],
  preview: {
    select: {title: 'titulo', media: 'logo', subtitle: 'tagline'},
  },
})

