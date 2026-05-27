# Are.na Portfolio

A minimal statically generated portfolio site backed by a public Are.na channel.

Live example: [`arena-api-examples-portfolio.vercel.app`](https://arena-api-examples-portfolio.vercel.app/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faredotna%2Fapi-examples%2Ftree%2Fmain%2Fportfolio&project-name=arena-portfolio&repository-name=arena-portfolio&env=ARENA_CHANNEL_SLUG&envDefaults=%7B%22ARENA_CHANNEL_SLUG%22%3A%22arena-influences%22%7D&envDescription=Choose+the+public+Are.na+channel+to+render.&envLink=https%3A%2F%2Fgithub.com%2Faredotna%2Fapi-examples%2Ftree%2Fmain%2Fportfolio%23configuration&demo-title=Are.na+Portfolio&demo-description=A+static+portfolio+generated+from+one+public+Are.na+channel.&demo-url=https%3A%2F%2Farena-api-examples-portfolio.vercel.app%2F)

The app uses one top-level channel as its source. Blocks connected directly to that
channel render on the home page, and channels connected to it become the persistent
site navigation. Blocks in those child channels render on their own static pages.

## Stack

- npm + Next.js 15 + React 19
- Static export (`next build`)
- Server-fetched public Are.na data via `@aredotna/sdk`
- SSR measured masonry via Pretext and `@napi-rs/canvas`
- No auth and no client-side API fetching
- RSS feed and Open Graph metadata

## Quick Start

```sh
npm install
cp .env.example .env.local
npm run dev
```

The app runs at `http://127.0.0.1:5175`.

## Configuration

The default Taste Genealogy channel list lives in `src/config/channels.ts`.
To add another channel to the site, add one object to `FEATURED_CHANNELS`:

```ts
{
  slug: 'public-arena-channel-slug',
  title: 'Display Name',
  theme: { light: '#f4e7bd', dark: '#332711' },
}
```

Reorder that array to reorder the navigation. Each slug must point to a public
Are.na channel.

You can still override the channel list at deploy time with env vars:

```sh
ARENA_CHANNEL_SLUGS=sonic-diversity-zewocbw6otq,dj-mixes-i-have-enjoyed,dj-mixes,i-luv-this-mix-9nia6qlkius,best-of-dj-mixes,music-dj-sets-mixes,night-life-is-so-fun
ARENA_SITE_TITLE=Taste Genealogy
ARENA_SITE_DESCRIPTION=A living map of music references, DJ mixes, scenes, atmospheres, and sonic fingerprints.
```

Use `ARENA_CHANNEL_SLUGS` when you want to list selected channels directly.
Separate slugs with commas. These channels become the persistent navigation.
Titles/themes for env-only slugs fall back to Are.na's channel title and the
site default background unless you also add them to `src/config/channels.ts`.

Alternatively, use one root channel:

```sh
ARENA_CHANNEL_SLUG=sonic-diversity-zewocbw6otq
```

Every configured slug must point to a public Are.na channel. Keep configured
channels small enough to fetch at build time: the build reads all blocks in the
selected channels, plus one level of child channels for nested navigation.

## Routes

- `/` renders the latest updated blocks across the configured music channels.
- `/[channel]` renders blocks connected to a configured channel.
- Block cards link out to their canonical Are.na block pages.
- `/rss.xml` renders an RSS 2.0 feed for every fetched block.

## Scripts

```sh
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format
```
