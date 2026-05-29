'use client'

import {useMemo, useState} from 'react'
import ProdutoCard, {type ProdutoCardData} from './ProdutoCard'

const DEFAULT_CARDS: ProdutoCardData[] = [
  {
    title: 'FORMATOS ORIGINAIS E BRANDED ENTERTAINMENT',
    brandColor: 'red',
    serviceGroups: [
      {items: ['Webséries', 'Realities', 'Documentários']},
      {items: ['Branded Content', 'Originais de Marca']},
      {items: ['Cultura', 'Diversidade', 'Lifestyle']},
      {items: ['Projetos com Estratégia de Mercado']},
    ],
    body: 'Somos parceiros de marcas, agências e produtoras para transformar ideias em histórias que viram conversa.',
  },
  {
    title: 'CONTEÚDO E CAMPANHAS MULTIPLATAFORMA',
    brandColor: 'orange',
    serviceGroups: [
      {items: ['Redes sociais', 'Plataformas Digitais']},
      {items: ['Publis', 'Lançamentos']},
      {items: ['Conteúdo recorrente', 'Séries curtas']},
      {items: ['Estratégia editorial', 'Performance']},
    ],
    body: 'Conteúdo pensado para cada plataforma, com consistência de marca e impacto mensurável.',
  },
  {
    title: 'COPRODUÇÃO, EQUIPES E ESTRUTURA SOB MEDIDA',
    brandColor: 'green',
    serviceGroups: [
      {items: ['Direção Criativa', 'Produção Executiva']},
      {items: ['Gestão de Times', 'Projetos']},
      {items: ['Coprodução', 'Parcerias']},
      {items: ['Estrutura sob medida', 'Operação']},
    ],
    body: 'Equipes e processos alinhados ao seu briefing — da ideia à entrega final.',
  },
]

type ProdutosSandesSectionProps = {
  cards?: ProdutoCardData[]
}

function cardKey(card: ProdutoCardData, index: number) {
  return card._key ?? `produto-${index}`
}

function defaultExpandedKey(items: ProdutoCardData[]) {
  const redIndex = items.findIndex((c) => c.brandColor === 'red')
  const index = redIndex >= 0 ? redIndex : 0
  return cardKey(items[index], index)
}

export default function ProdutosSandesSection({cards}: ProdutosSandesSectionProps) {
  const items = cards?.length ? cards : DEFAULT_CARDS
  const defaultKey = useMemo(() => defaultExpandedKey(items), [items])
  const [expandedKey, setExpandedKey] = useState(defaultKey)

  const hasHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const expand = (key: string) => {
    if (hasHover()) setExpandedKey(key)
  }

  const resetToDefault = () => {
    if (hasHover()) setExpandedKey(defaultKey)
  }

  const toggle = (key: string) => {
    setExpandedKey((current) => (current === key ? defaultKey : key))
  }

  return (
    <section id="produtos" className="section produtos" aria-label="Produtos Sandes">
      <div className="section__particles produtos__particles" aria-hidden="true">
        <div className="section__decor produtos__decor--orange-tl" />
        <div className="section__decor produtos__decor--orange-bl" />
        <div className="section__decor produtos__decor--green-mid" />
        <div className="section__decor produtos__decor--yellow-tr" />
        <div className="section__decor produtos__decor--orange-mr" />
        <div className="section__decor produtos__decor--purple-br" />
      </div>

      <div className="produtos__inner site-container">
        <div className="produtos__grid" onMouseLeave={resetToDefault}>
          {items.map((card, index) => {
            const key = cardKey(card, index)
            return (
              <ProdutoCard
                key={key}
                card={card}
                expanded={expandedKey === key}
                onMouseEnter={() => expand(key)}
                onToggle={() => toggle(key)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
