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
          Taste Genealogy is a listening map: a rolling collection of DJ mixes, sonic references,
          scenes, textures, and atmospheres pulled from Are.na.
        </p>
        <p>
          The homepage now surfaces the latest updated blocks across the music channels, while each
          tab traces one person’s trail of mixes and nightlife references.
        </p>
      </section>
      <section aria-labelledby="latest-heading" className="latest-section">
        <h2 id="latest-heading">Latest updates</h2>
        <ThumbnailGrid
          blocks={data.rootBlocks}
          emptyMessage="No recent blocks are available yet."
        />
      </section>
    </>
  )
}
