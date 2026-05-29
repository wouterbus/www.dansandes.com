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
        .title('Conteúdos e Formatos'),
      S.listItem()
        .title('Partner logos')
        .child(S.documentTypeList('partnerLogo').title('Partner logos')),
      S.documentListItem()
        .id('logoCarousel')
        .schemaType('logoCarousel')
        .title('Logo Grid'),
      S.documentListItem()
        .id('universosSection')
        .schemaType('universosSection')
        .title('Universos (Parallax Video)'),
      S.documentListItem()
        .id('produtosSandes')
        .schemaType('produtosSandes')
        .title('Produtos Sandes'),
      S.documentListItem()
        .id('casesSection')
        .schemaType('casesSection')
        .title('Cases'),
      S.divider(),
      S.listItem()
        .title('Cases (legacy carousel)')
        .child(S.documentTypeList('cases').title('Cases (legacy)')),
    ])

export default deskStructure
