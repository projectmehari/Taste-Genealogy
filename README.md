# Taste Genealogy

Taste Genealogy is a static music-discovery site built from public Are.na channels. It treats saved records, DJ mixes, videos, posters, labels, scenes, and other music references as a loose map of taste: who collects what, which worlds cluster together, and how music culture moves between people.

The site is intentionally lightweight: public Are.na data is fetched at build time, rendered into static pages, and enhanced with small client-side interactions for theme switching, audio embeds, route progress, and scroll-to-top navigation.

## Features

- Curated top-level navigation sourced from public Are.na channels
- Latest-items homepage spanning the configured channel set
- Static channel pages at `/[channel]`
- Masonry-style card layout with server-side text measurement
- Inline audio/embed player for Bandcamp, SoundCloud, Mixcloud, Spotify, YouTube, and direct audio files
- Light/dark mode with hand-picked channel color themes
- RSS feed and Open Graph metadata
- Static export via Next.js

## Stack

- Next.js 15 + React 19
- TypeScript
- `@aredotna/sdk` for public Are.na data
- `@chenglou/pretext` + `@napi-rs/canvas` for layout measurement
- Vercel-ready static build

## Getting started

```sh
npm install
cp .env.example .env.local
npm run dev
```

The dev server runs at:

```txt
http://127.0.0.1:5175
```

## Configuration

The curated Taste Genealogy channel list lives in:

```txt
src/config/channels.ts
```

Each channel defines:

```ts
{
  slug: 'public-arena-channel-slug',
  title: 'Display Name',
  theme: { light: '#f4e7bd', dark: '#332711' },
}
```

- `slug` must be a public Are.na channel slug.
- `title` is the display name used in navigation.
- `theme.light` and `theme.dark` are hand-picked colors used by the nav links and active channel background.
- Reorder `FEATURED_CHANNELS` to reorder the site navigation.

You can also add deploy-time channel slugs with environment variables:

```sh
ARENA_CHANNEL_SLUGS=sonic-diversity-zewocbw6otq,dj-mixes-i-have-enjoyed,dj-mixes
ARENA_SITE_TITLE=Taste Genealogy
ARENA_SITE_DESCRIPTION=A living map of music references, DJ mixes, scenes, atmospheres, and sonic fingerprints.
```

`ARENA_CHANNEL_SLUGS` is merged with `FEATURED_CHANNELS`, with duplicates removed. Keep `src/config/channels.ts` as the main place for curated order, display titles, and themes; env-only channels fall back to their Are.na titles and the default site background.

You can also render a single root channel instead:

```sh
ARENA_CHANNEL_SLUG=sonic-diversity-zewocbw6otq
```

## Routes

- `/` renders the latest updated blocks across the configured music channels.
- `/[channel]` renders blocks connected to a configured channel.
- `/rss.xml` renders an RSS 2.0 feed for fetched blocks.
- Block cards link back to canonical Are.na block pages.

## Scripts

```sh
npm run dev       # Start local development server
npm run build     # Build static site
npm run typecheck # Run TypeScript checks
```

## Notes for public deployment

- The app only reads public Are.na data; no auth token is required.
- Keep `.env.local` private. Use `.env.example` as the shareable template.
- Large build artifacts (`.next`, `out`) are ignored by git.
- Bandcamp and some other embeds may require the user to press play inside the embedded player because browser autoplay rules block cross-origin audio.

## Credits

Built with the public Are.na API and based on ideas from the Are.na API examples. The current Taste Genealogy curation, interface, and audio-player behavior are customized for this project.
