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
        .id('logoCarousel')
        .schemaType('logoCarousel')
        .title('Logo Carousel'),
      S.documentListItem()
        .id('heroBanner')
        .schemaType('heroBanner')
        .title('Hero Banner (Reel)'),
      S.divider(),
      S.listItem()
        .title('Cases')
        .child(S.documentTypeList('cases').title('Cases')),
    ])

export default deskStructure
