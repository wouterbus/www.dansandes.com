import {Flex, Stack, Text} from '@sanity/ui'
import {useCallback, useMemo} from 'react'
import {set, type StringInputProps} from 'sanity'
import {
  BRAND_COLOR_HEX,
  BRAND_COLOR_OPTIONS,
  type BrandColorSwatch,
} from '../schemas/fields/brandColorTokens'

type BrandColorInputOptions = {
  list?: {title?: string; value: string}[]
  colors?: BrandColorSwatch[]
  shape?: 'circle' | 'box'
}

function resolveSwatches(options?: BrandColorInputOptions): BrandColorSwatch[] {
  if (options?.colors?.length) return options.colors

  if (options?.list?.length) {
    return options.list.map((item) => ({
      title: item.title || item.value,
      value: item.value,
      hex: BRAND_COLOR_HEX[item.value as keyof typeof BRAND_COLOR_HEX] || '#888888',
    }))
  }

  return [...BRAND_COLOR_OPTIONS]
}

export default function BrandColorInput(props: StringInputProps) {
  const {value, onChange, readOnly, schemaType} = props
  const options = schemaType.options as BrandColorInputOptions | undefined
  const shape = options?.shape === 'box' ? 'box' : 'circle'
  const swatches = useMemo(() => resolveSwatches(options), [options])

  const select = useCallback(
    (colorValue: string) => {
      if (readOnly || value === colorValue) return
      onChange(set(colorValue))
    },
    [onChange, readOnly, value],
  )

  return (
    <Flex gap={4} wrap="wrap" paddingY={1}>
      {swatches.map(({title, value: colorValue, hex}) => {
        const selected = value === colorValue

        return (
          <Stack key={colorValue} space={2}>
            <button
              type="button"
              aria-label={title}
              aria-pressed={selected}
              disabled={readOnly}
              onClick={() => select(colorValue)}
              style={{
                width: 36,
                height: 36,
                borderRadius: shape === 'box' ? 6 : '50%',
                backgroundColor: hex,
                border: 'none',
                padding: 0,
                cursor: readOnly ? 'default' : 'pointer',
                opacity: readOnly ? 0.55 : 1,
                boxShadow: selected
                  ? `0 0 0 2px var(--card-bg-color, #101112), 0 0 0 4px ${hex}`
                  : 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                transform: selected ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <Text size={1} muted align="center">
              {title}
            </Text>
          </Stack>
        )
      })}
    </Flex>
  )
}
