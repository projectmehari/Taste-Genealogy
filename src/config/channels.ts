export type FeaturedChannel = {
  slug: string
  title: string
  theme: {
    light: string
    dark: string
  }
}

// Add/remove/reorder homepage channels here. Each slug must be a public Are.na channel.
export const FEATURED_CHANNELS = [
  {
    slug: 'sonic-diversity-zewocbw6otq',
    title: '{Kiru + }',
    theme: { light: '#b8d8ff', dark: '#17283c' },
  },
  {
    slug: 'dj-mixes-i-have-enjoyed',
    title: 'Lukas W',
    theme: { light: '#f6d365', dark: '#3d3112' },
  },
  {
    slug: 'dj-mixes',
    title: 'Internet Bill',
    theme: { light: '#c8f7dc', dark: '#123021' },
  },
  {
    slug: 'i-luv-this-mix-9nia6qlkius',
    title: 'chris osagie',
    theme: { light: '#f7b2ad', dark: '#3b1c1a' },
  },
  {
    slug: 'best-of-dj-mixes',
    title: 'Sam db295e',
    theme: { light: '#d9c2ff', dark: '#2a1f3f' },
  },
  {
    slug: 'music-dj-sets-mixes',
    title: 'I \\V N 🗺',
    theme: { light: '#b7f0ef', dark: '#123536' },
  },
  {
    slug: 'night-life-is-so-fun',
    title: 'Sophia Bae',
    theme: { light: '#ffb7d5', dark: '#3f1830' },
  },
] satisfies FeaturedChannel[]

export const FEATURED_CHANNEL_SLUGS = FEATURED_CHANNELS.map((channel) => channel.slug)

export const FEATURED_CHANNEL_TITLES = Object.fromEntries(
  FEATURED_CHANNELS.map((channel) => [channel.slug, channel.title]),
) as Record<string, string>
