import {ReactNode} from 'react'

export type HighlightColor = 'red' | 'orange' | 'yellow' | 'green' | 'purple'

type MarkDef = {
  _key: string
  _type: string
  color?: HighlightColor
}

type PortableTextChild = {
  text?: string
  marks?: string[]
}

export type PortableTextBlock = {
  children?: PortableTextChild[]
  markDefs?: MarkDef[]
}

type DefaultPart = {text: string; accent?: boolean; color?: HighlightColor}

type RenderHeadingTextOptions = {
  /** @deprecated Use highlight annotation in Sanity instead */
  legacyStrongColor?: HighlightColor
  /** Use on brand-color bars: white emphasis text instead of palette highlight colors */
  emphasisClassName?: string
}

export function renderHeadingText(
  blocks: PortableTextBlock[] | undefined,
  defaults: DefaultPart[],
  options: RenderHeadingTextOptions = {}
): ReactNode[] | null {
  const block = blocks?.[0]
  const children = block?.children
  const markDefs = block?.markDefs ?? []
  const legacyColor = options.legacyStrongColor ?? 'orange'
  const emphasisClassName = options.emphasisClassName

  if (!children?.length) {
    return defaults.map((part, i) => (
      <span
        key={i}
        className={
          part.color
            ? `text-highlight text-highlight--${part.color}`
            : part.accent
              ? `text-highlight text-highlight--${legacyColor}`
              : undefined
        }
      >
        {part.text}
      </span>
    ))
  }

  return children.map((child, index) => {
    const text = child.text ?? ''
    const marks = child.marks ?? []

    let node: ReactNode = text

    if (marks.includes('em')) {
      node = <em>{node}</em>
    }

    if (marks.includes('strong')) {
      node = <strong>{node}</strong>
    }

    const highlightDef = marks
      .map((mark) => markDefs.find((def) => def._key === mark))
      .find((def) => def?._type === 'highlight' && def.color)

    const hasHighlight = Boolean(highlightDef?.color)
    const hasStrong = marks.includes('strong')

    if (emphasisClassName && (hasHighlight || hasStrong)) {
      node = <span className={emphasisClassName}>{node}</span>
    } else if (hasHighlight) {
      node = (
        <span className={`text-highlight text-highlight--${highlightDef!.color}`}>{node}</span>
      )
    } else if (hasStrong) {
      node = <span className={`text-highlight text-highlight--${legacyColor}`}>{node}</span>
    }

    return <span key={index}>{node}</span>
  })
}
