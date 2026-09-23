import {defineType} from 'sanity'
import {headingTextField} from '../fields/headingText'

export default defineType({
  name: 'footerSection',
  title: 'Footer',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      ...headingTextField,
      description:
        'Use Highlight color (amarelo/laranja) na parte que deve aparecer colorida — ex.: “tem para contar?”.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Texto',
      type: 'text',
      rows: 3,
      description: 'Subtítulo abaixo do título.',
    },
    {
      name: 'logo',
      title: 'Logo Footer',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
      ],
      description: 'Logo exibida abaixo do texto. Se vazio, usa a logo padrão do site.',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram',
      type: 'url',
      description: 'URL completa do perfil — ex.: https://www.instagram.com/criasandes',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}).error('Informe uma URL válida (https://…).'),
    },
    {
      name: 'email',
      title: 'E-mail',
      type: 'string',
      description: 'Copiado ao clicar no ícone de enviar no rodapé.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          if (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            return true
          }
          return 'Informe um e-mail válido — ex.: ola@criasandes.com'
        }),
    },
  ],
  preview: {
    select: {title: 'title', media: 'logo'},
    prepare({title, media}) {
      const text = title?.[0]?.children?.[0]?.text || 'Footer'
      return {
        title: 'Footer',
        subtitle: text,
        media,
      }
    },
  },
})
