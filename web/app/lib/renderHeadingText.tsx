import {Fragment, ReactNode} from 'react'

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
  /** Start a new line after each comma on wide screens only */
  breakAfterComma?: boolean
}

/** The separator is kept in place so the comma and its space survive on mobile,
 *  where the break itself is switched off. */
function withCommaBreaks(text: string): ReactNode {
  const segments = text.split(/(,[^\S\n]+)/)
  if (segments.length < 2) return text

  return segments.map((segment, index) => (
    <Fragment key={index}>
      {segment}
      {/^,[^\S\n]+$/.test(segment) && <br className="heading-break" />}
    </Fragment>
  ))
}

/** Newlines from Sanity's Shift+Enter are intentional editorial line breaks. */
function withManualBreaks(text: string, breakAfterComma: boolean): ReactNode {
  const lines = text.split('\n')

  return lines.map((line, index) => (
    <Fragment key={index}>
      {breakAfterComma ? withCommaBreaks(line) : line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ))
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
  const renderText = (text: string): ReactNode => withManualBreaks(text, Boolean(options.breakAfterComma))

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
        {renderText(part.text)}
      </span>
    ))
  }

  return children.map((child, index) => {
    const text = child.text ?? ''
    const marks = child.marks ?? []

    let node: ReactNode = renderText(text)

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
