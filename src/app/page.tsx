import type { Metadata } from 'next'
import { ApiHtml } from '@/components/ApiHtml'
import { ThumbnailGrid } from '@/components/ThumbnailGrid'
import { getSiteData } from '@/lib/blocks'
import { blockImage, channelDescription } from '@/lib/og'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData()
  const description = channelDescription(data.root)
  const image = data.allBlocks.map(blockImage).find(Boolean)

  return {
    description,
    openGraph: {
      description,
      images: image ? [{ url: image }] : undefined,
      title: data.root.title,
      type: 'website',
      url: '/',
    },
    title: data.root.title,
  }
}

export default async function HomePage() {
  const data = await getSiteData()

  return (
    <>
      <header className="page-header">
        <h1>{data.root.title}</h1>
        <ApiHtml className="description prose" html={data.root.description?.html} />
      </header>
      <section aria-labelledby="about-heading" className="about-section prose">
        <h2 id="about-heading">About</h2>
        <p>
          Taste Genealogy is a small atlas of references: sounds, images, films, atmospheres,
          textures, and fragments that point to where a creative instinct comes from.
        </p>
        <p>
          The channels are less a portfolio than a family tree for taste — a way to trace the
          influences, moods, and recurring signals that keep showing up in the work.
        </p>
      </section>
      <ThumbnailGrid
        blocks={data.rootBlocks}
        emptyMessage="No blocks are connected directly to this channel yet."
      />
    </>
  )
}
