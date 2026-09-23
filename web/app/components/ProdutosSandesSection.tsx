'use client'

import {useEffect, useMemo, useState} from 'react'
import ProdutoCard, {type ProdutoCardData} from './ProdutoCard'
import ScrollParticles from './ScrollParticles'
import {PRODUTOS_PARTICLES} from '../lib/particleConfigs'

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
    brandColor: 'yellow',
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
  // The first card is open (and playing) until the visitor takes over; from then
  // on "nothing hovered" means every card is closed and paused.
  const [expandedKey, setExpandedKey] = useState<string | null>(defaultKey)

  const hasHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  // Touch has no hover to drive the accordion, so every card starts closed and
  // the chevron is the only thing that opens one (and starts its video).
  useEffect(() => {
    if (!hasHover()) setExpandedKey(null)
  }, [])

  const expand = (key: string) => {
    if (hasHover()) setExpandedKey(key)
  }

  const collapseAll = () => {
    if (hasHover()) setExpandedKey(null)
  }

  const toggle = (key: string) => {
    setExpandedKey((current) => (current === key ? null : key))
  }

  return (
    <section id="produtos" className="section produtos" aria-label="Produtos Sandes">
      <ScrollParticles className="section__particles produtos__particles" particles={PRODUTOS_PARTICLES} />

      <div className="produtos__inner site-container">
        <div className="produtos__grid" onMouseLeave={collapseAll}>
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
