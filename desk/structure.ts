import {StructureBuilder} from 'sanity/structure'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Seções Home')
        .child(
          S.list()
            .title('Seções Home')
            .items([
              S.documentListItem().id('homeHero').schemaType('homeHero').title('Hero Banner'),
              S.documentListItem().id('homeLogoCarousel').schemaType('homeLogoCarousel').title('Logo Carousel'),
              S.documentListItem().id('homeServices').schemaType('homeServices').title('Serviços'),
            ])
        ),
      S.listItem()
        .title('Produtos')
        .child(S.documentTypeList('product').title('Produtos')),
      S.listItem()
        .title('Cases')
        .child(S.documentTypeList('case').title('Cases')),
      S.listItem()
        .title('Footer')
        .child(
          S.list()
            .title('Footer')
            .items([
              S.documentListItem().id('footerContactCard').schemaType('footerContactCard').title('Contact Card'),
              S.documentListItem().id('footerForm').schemaType('footerForm').title('Form'),
              S.documentListItem().id('footerPrices').schemaType('footerPrices').title('Prices / Awards'),
            ])
        ),
    ])

export default deskStructure

