import {Autocomplete, Box, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {set, unset, type Reference, type ReferenceInputProps} from 'sanity'
import {useClient} from 'sanity'

type GridLogo = {
  _key: string
  partnerId?: string
  name: string
  thumb?: string
}

type PartnerLogo = {
  _id: string
  name: string
}

const GRID_LOGOS_QUERY = `{
  "gridLogos": coalesce(
    *[_id == "drafts.logoCarousel"][0].logos,
    *[_id == "logoCarousel"][0].logos
  )[]{
    _key,
    "ref": select(defined(_ref) => _ref, null),
    "name": coalesce(@->name, name),
    "thumb": coalesce(@->image.asset->url, image.asset->url)
  },
  "partnerLogos": *[_type == "partnerLogo"]{_id, name}
}`

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[\s-_]/g, '')
}

const NAME_ALIASES: Record<string, string> = {
  e: 'entertainment',
  fruittella: 'fruittella',
}

function resolvePartnerId(
  logo: {ref?: string | null; name?: string},
  partnerLogos: PartnerLogo[],
): string | undefined {
  if (logo.ref) return logo.ref

  const name = logo.name?.trim()
  if (!name) return undefined

  const normalized = normalizeName(name)
  const aliasTarget = NAME_ALIASES[normalized]
  if (aliasTarget) {
    const aliasMatch = partnerLogos.find((item) => normalizeName(item.name) === aliasTarget)
    if (aliasMatch) return aliasMatch._id
  }

  const exact = partnerLogos.find((item) => normalizeName(item.name) === normalized)
  if (exact) return exact._id

  if (normalized.length < 3) return undefined

  const partial = partnerLogos.find((item) => {
    const partnerName = normalizeName(item.name)
    return partnerName.includes(normalized) || normalized.includes(partnerName)
  })
  return partial?._id
}

export default function ClientLogoPicker({value, onChange, readOnly}: ReferenceInputProps) {
  const client = useClient({apiVersion: '2024-10-01'})
  const [logos, setLogos] = useState<GridLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    client
      .fetch<{gridLogos?: GridLogo[]; partnerLogos?: PartnerLogo[]}>(GRID_LOGOS_QUERY)
      .then((data) => {
        if (!active) return

        const partnerLogos = data.partnerLogos ?? []
        const resolved =
          data.gridLogos
            ?.map((logo) => {
              const partnerId = resolvePartnerId(logo, partnerLogos)
              if (!partnerId || !logo.name) return null
              return {
                _key: logo._key,
                partnerId,
                name: logo.name,
                thumb: logo.thumb,
              }
            })
            .filter(Boolean) ?? []

        setLogos(resolved as GridLogo[])
        setError(resolved.length ? null : 'Adicione logos em Logo Grid primeiro.')
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setError('Não foi possível carregar as logos.')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [client])

  const selectedRef = (value as Reference | undefined)?._ref
  const selectedLogo = useMemo(
    () => logos.find((logo) => logo.partnerId === selectedRef),
    [logos, selectedRef],
  )

  const options = useMemo(
    () =>
      logos.map((logo) => ({
        value: logo.partnerId!,
        payload: logo,
      })),
    [logos],
  )

  const handleSelect = useCallback(
    (partnerId: string | null) => {
      if (readOnly) return
      if (!partnerId) {
        onChange(unset())
        return
      }
      onChange(set({_type: 'reference', _ref: partnerId}))
    },
    [onChange, readOnly],
  )

  if (loading) {
    return (
      <Flex align="center" gap={3} paddingY={2}>
        <Spinner muted />
        <Text size={1} muted>
          A carregar logos…
        </Text>
      </Flex>
    )
  }

  if (error) {
    return (
      <Card padding={3} radius={2} tone="caution">
        <Text size={1}>{error}</Text>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Autocomplete
        id="client-logo-picker"
        fontSize={2}
        padding={3}
        placeholder="Escolher logo…"
        disabled={readOnly}
        value={selectedLogo?.name ?? ''}
        onChange={handleSelect}
        options={options.map((option) => ({
          value: option.value,
          label: option.payload.name,
        }))}
        renderOption={(option) => {
          const logo = logos.find((item) => item.partnerId === option.value)
          return (
            <Flex align="center" gap={3} padding={2}>
              {logo?.thumb ? (
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#fff',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={logo.thumb}
                    alt=""
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  />
                </Box>
              ) : null}
              <Text size={2}>{option.label}</Text>
            </Flex>
          )
        }}
        renderValue={() => selectedLogo?.name ?? ''}
        openButton
      />

      {selectedLogo?.thumb ? (
        <Flex align="center" gap={3}>
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <img
              src={selectedLogo.thumb}
              alt=""
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
            />
          </Box>
          <Text size={1} muted>
            {selectedLogo.name}
          </Text>
        </Flex>
      ) : null}
    </Stack>
  )
}
