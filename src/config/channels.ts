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
    title: 'Morgan Sutherland',
    theme: { light: '#f2c078', dark: '#3a2608' },
  },
  {
    slug: 'black-music',
    title: 'under / water',
    theme: { light: '#9b8cff', dark: '#211750' },
  },
  {
    slug: 'dance-clubs',
    title: 'Chris Sherrón',
    theme: { light: '#69d2e7', dark: '#083847' },
  },
  {
    slug: 'music-video-channel',
    title: 'Morgan Greaton',
    theme: { light: '#ff7eb6', dark: '#4a1230' },
  },
  {
    slug: 'music-notation-channel',
    title: 'mariana massano',
    theme: { light: '#a3d977', dark: '#203b12' },
  },
  {
    slug: 'a-conversation-about-music',
    title: 'chakra ꩜',
    theme: { light: '#ffe066', dark: '#443600' },
  },
  {
    slug: 'music-videos-kypubu2hjcs',
    title: 'Théo Marielle',
    theme: { light: '#7aa2ff', dark: '#102a5c' },
  },
  {
    slug: 'music-tour-posters',
    title: 'ju b',
    theme: { light: '#ff9f1c', dark: '#4b2500' },
  },
  {
    slug: 'music-culture-2y2hoaryerm',
    title: 'Clara Goodger',
    theme: { light: '#2ec4b6', dark: '#063b37' },
  },
  {
    slug: 'music-pztiqpda_zi',
    title: 'Eric L. Chen',
    theme: { light: '#c77dff', dark: '#35114f' },
  },
  {
    slug: 'door-link-log',
    title: 'Romina Malta',
    theme: { light: '#ffd6a5', dark: '#43250b' },
  },
  {
    slug: 'music-akv6jlo59zy',
    title: 'Saeed Ferguson',
    theme: { light: '#bde0fe', dark: '#102d47' },
  },
  {
    slug: 'club-music-for-the-workday',
    title: 'Alyana Vera',
    theme: { light: '#ffc6ff', dark: '#3f1644' },
  },
  {
    slug: 'now-laying',
    title: '// Yatú',
    theme: { light: '#caffbf', dark: '#15380f' },
  },
  {
    slug: 'public-hgzhykhlhuo',
    title: 'o sebo',
    theme: { light: '#fdffb6', dark: '#403d05' },
  },
  {
    slug: 'music-artwork-fq78-thvbpo',
    title: 'dunya worldwide',
    theme: { light: '#f4a261', dark: '#4a2107' },
  },
  {
    slug: 'music-for-websites',
    title: 'garry ing',
    theme: { light: '#90dbf4', dark: '#073447' },
  },
  {
    slug: 'design-music-88kmittrpwc',
    title: 'Kate Schurch',
    theme: { light: '#cfbaf0', dark: '#2f1d4d' },
  },
  {
    slug: 'sound-system-2lfor42t_5e',
    title: 'nightpoaching',
    theme: { light: '#f1c0e8', dark: '#47173d' },
  },
  {
    slug: 'music-literature-y7uk8ovdwd4',
    title: 'Matthew',
    theme: { light: '#98f5e1', dark: '#083d33' },
  },
   {
    slug: 'cool-music-websites',
    title: 'christina',
    theme: { light: '#98e5e1', dark: '#083b33' },
  },
] satisfies FeaturedChannel[]

export const FEATURED_CHANNEL_SLUGS = FEATURED_CHANNELS.map((channel) => channel.slug)

export const FEATURED_CHANNEL_TITLES = Object.fromEntries(
  FEATURED_CHANNELS.map((channel) => [channel.slug, channel.title]),
) as Record<string, string>
