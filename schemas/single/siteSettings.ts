import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título do site', type: 'string'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'menu',
      title: 'Menu principal',
      type: 'object',
      fields: [
        defineField({name: 'sobreLabel', title: 'Rótulo: O que a Sandes faz?', type: 'string'}),
        defineField({name: 'produtosLabel', title: 'Rótulo: Produtos Sandes', type: 'string'}),
        defineField({name: 'portfolioLabel', title: 'Rótulo: O que já criamos', type: 'string'}),
        defineField({name: 'contatoLabel', title: 'Rótulo: Contato', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contactDefaults',
      title: 'Contato (padrões)',
      type: 'object',
      fields: [
        defineField({name: 'email', title: 'E-mail', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp', type: 'string'}),
      ],
    }),
  ],
})


