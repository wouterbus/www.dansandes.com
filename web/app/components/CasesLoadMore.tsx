'use client'

import {Children, useState, type ReactNode} from 'react'

const PAGE_SIZE = 3

type CasesLoadMoreProps = {
  children: ReactNode
  pageSize?: number
}

export default function CasesLoadMore({children, pageSize = PAGE_SIZE}: CasesLoadMoreProps) {
  const items = Children.toArray(children)
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + pageSize, items.length))
  }

  return (
    <>
      {visibleItems}

      {hasMore && (
        <div className="cases-section__more">
          <button
            type="button"
            className="cases-section__load-more"
            onClick={loadMore}
            aria-label="Carregar mais cases"
          >
            <span className="cases-section__load-more-icon" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  )
}
