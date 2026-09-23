/**
 * Converts inline logoItem entries in Logo Grid to partnerLogo references.
 * Run: npx sanity exec scripts/migrate-logo-grid-to-references.mjs --with-user-token
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '89ztrc1x',
  dataset: 'production',
  apiVersion: '2024-10-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN,
})

function normalizeName(value) {
  return value.toLowerCase().replace(/[\s-_]/g, '')
}

const NAME_ALIASES = {
  e: 'entertainment',
  fruittella: 'fruittella',
}

function resolvePartnerId(logo, partnerLogos) {
  if (logo._ref) return logo._ref

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

const doc = await client.fetch(`*[_id == "logoCarousel"][0]{_id, logos}`)
if (!doc?.logos?.length) {
  console.log('No logoCarousel document or logos array is empty.')
  process.exit(0)
}

const partnerLogos = await client.fetch(`*[_type == "partnerLogo"]{_id, name}`)
const nextLogos = []
let changed = false

for (const logo of doc.logos) {
  if (logo._type === 'reference' || logo._ref) {
    nextLogos.push({
      _key: logo._key,
      _type: 'reference',
      _ref: logo._ref,
    })
    continue
  }

  const partnerId = resolvePartnerId(logo, partnerLogos)
  if (!partnerId) {
    console.warn(`Skipping unmatched logo: ${logo.name}`)
    continue
  }

  changed = true
  nextLogos.push({
    _key: logo._key,
    _type: 'reference',
    _ref: partnerId,
  })
}

if (!changed) {
  console.log('Logo Grid already uses partnerLogo references.')
  process.exit(0)
}

await client.patch('logoCarousel').set({logos: nextLogos}).commit()
console.log(`Migrated ${nextLogos.length} logos to partnerLogo references.`)
