import 'server-only'

import { createArena } from '@aredotna/sdk'
import { FEATURED_CHANNEL_SLUGS, FEATURED_CHANNEL_TITLES } from '@/config/channels'

const ARENA_API_BASE_URL = 'https://api.are.na'
const DEFAULT_CHANNEL_SLUG = 'sonic-diversity-zewocbw6otq'
const DEFAULT_SITE_TITLE = 'Taste Genealogy'
const DEFAULT_SITE_DESCRIPTION =
  'A living map of music references, DJ mixes, scenes, atmospheres, and sonic fingerprints.'
const LOCAL_SITE_URL = 'http://127.0.0.1:5175'

function requiredValue(value: string | undefined, fallback: string, name: string) {
  const resolved = value?.trim() || fallback

  if (!resolved) {
    throw new Error(`${name} must be set`)
  }

  return resolved
}

export function getRootChannelSlug() {
  return requiredValue(process.env.ARENA_CHANNEL_SLUG, DEFAULT_CHANNEL_SLUG, 'ARENA_CHANNEL_SLUG')
}

export function getConfiguredChannelSlugs() {
  const envSlugs =
    process.env.ARENA_CHANNEL_SLUGS?.split(',')
      .map((slug: string) => slug.trim())
      .filter(Boolean) ?? []

  return Array.from(new Set([...envSlugs, ...FEATURED_CHANNEL_SLUGS]))
}

export function getChannelDisplayTitle(slug: string, fallback: string) {
  return FEATURED_CHANNEL_TITLES[slug] ?? fallback
}

export function getSiteTitle() {
  return requiredValue(process.env.ARENA_SITE_TITLE, DEFAULT_SITE_TITLE, 'ARENA_SITE_TITLE')
}

export function getSiteDescription() {
  return requiredValue(
    process.env.ARENA_SITE_DESCRIPTION,
    DEFAULT_SITE_DESCRIPTION,
    'ARENA_SITE_DESCRIPTION',
  )
}

export function getSiteUrl() {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : LOCAL_SITE_URL
}

export const arena = createArena({
  baseUrl: ARENA_API_BASE_URL,
  retry: {
    maxRetries: 2,
    respectRateLimits: true,
  },
})
