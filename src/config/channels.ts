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
  {
    slug: 'record-labels',
    title: 'Record Labels',
    theme: { light: '#f0e3c0', dark: '#352a18' },
  },
  {
    slug: 'black-music',
    title: 'Black Music',
    theme: { light: '#d8c4ff', dark: '#241835' },
  },
  {
    slug: 'dance-clubs',
    title: 'Dance Clubs',
    theme: { light: '#b8f2ff', dark: '#10333d' },
  },
  {
    slug: 'music-video-channel',
    title: 'Music Video Channel',
    theme: { light: '#ffc4d6', dark: '#3b1625' },
  },
  {
    slug: 'music-notation-channel',
    title: 'Music Notation Channel',
    theme: { light: '#d6f5c9', dark: '#1c3418' },
  },
  {
    slug: 'a-conversation-about-music',
    title: 'A Conversation About Music',
    theme: { light: '#fff0b8', dark: '#3b3212' },
  },
  {
    slug: 'music-videos-kypubu2hjcs',
    title: 'Music Videos',
    theme: { light: '#c8d8ff', dark: '#17213a' },
  },
  {
    slug: 'music-tour-posters',
    title: 'Music Tour Posters',
    theme: { light: '#ffd0ad', dark: '#3a2114' },
  },
  {
    slug: 'music-culture-2y2hoaryerm',
    title: 'Music Culture',
    theme: { light: '#c8f0e0', dark: '#143327' },
  },
  {
    slug: 'music-pztiqpda_zi',
    title: 'Music',
    theme: { light: '#ead7ff', dark: '#2b1b3b' },
  },
] satisfies FeaturedChannel[]

export const FEATURED_CHANNEL_SLUGS = FEATURED_CHANNELS.map((channel) => channel.slug)

export const FEATURED_CHANNEL_TITLES = Object.fromEntries(
  FEATURED_CHANNELS.map((channel) => [channel.slug, channel.title]),
) as Record<string, string>
