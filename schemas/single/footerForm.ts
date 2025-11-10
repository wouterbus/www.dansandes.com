import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footerForm',
  title: 'Footer: Form',
  type: 'document',
  fields: [
    defineField({name: 'nomeLabel', title: 'Label: Nome', type: 'string'}),
    defineField({name: 'emailLabel', title: 'Label: Email', type: 'string'}),
    defineField({name: 'telefoneLabel', title: 'Label: Telefone', type: 'string'}),
    defineField({name: 'mensagemLabel', title: 'Label: Mensagem', type: 'string'}),
    defineField({name: 'submitLabel', title: 'Label: Enviar', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Form'}
    },
  },
})

