import {StructureBuilder} from 'sanity/structure'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.documentListItem()
        .id('configuracoes')
        .schemaType('configuracoes')
        .title('Configurações'),
      S.documentListItem()
        .id('heroBanner')
        .schemaType('heroBanner')
        .title('Hero Banner (Reel)'),
      S.documentListItem()
        .id('conteudosSection')
        .schemaType('conteudosSection')
        .title('Intro'),
      S.documentListItem()
        .id('logoCarousel')
        .schemaType('logoCarousel')
        .title('Logo Grid'),
      S.documentListItem()
        .id('universosSection')
        .schemaType('universosSection')
        .title('Video Banner'),
      S.documentListItem()
        .id('produtosSandes')
        .schemaType('produtosSandes')
        .title('Produtos Sandes'),
      S.documentListItem()
        .id('casesSection')
        .schemaType('casesSection')
        .title('Cases'),
      S.documentListItem()
        .id('footerSection')
        .schemaType('footerSection')
        .title('Footer'),
    ])

export default deskStructure
