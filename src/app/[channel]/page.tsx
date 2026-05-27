import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ApiHtml } from '@/components/ApiHtml'
import { SubNav } from '@/components/SubNav'
import { ThumbnailGrid } from '@/components/ThumbnailGrid'
import { getSection, getSiteData } from '@/lib/blocks'
import { blockImage, channelDescription } from '@/lib/og'

function arenaUserUrl(slug: string) {
  return `https://www.are.na/${slug}`
}

function formatJoinedDate(value: string | undefined) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

type ChannelPageProps = {
  params: Promise<{
    channel: string
  }>
}

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const data = await getSiteData()

  return data.rootChannels.map((channel) => ({
    channel: channel.slug,
  }))
}

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { channel: slug } = await params
  const section = await getSection(slug)

  if (!section) {
    return {}
  }

  const description = channelDescription(section.channel)
  const image = section.blocks.map(blockImage).find(Boolean)

  return {
    description,
    openGraph: {
      description,
      images: image ? [{ url: image }] : undefined,
      title: section.channel.title,
      type: 'website',
      url: `/${section.channel.slug}/`,
    },
    title: section.channel.title,
  }
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channel: slug } = await params
  const section = await getSection(slug)

  if (!section) {
    notFound()
  }

  const joined = formatJoinedDate(section.ownerProfile?.created_at ?? section.channel.created_at)
  const owner = section.ownerProfile ?? (section.channel.owner?.type === 'User' ? section.channel.owner : null)

  return (
    <>
      <header className="page-header">
        <h1>
          {owner ? (
            <a className="arena-user-link" href={arenaUserUrl(owner.slug)} rel="noreferrer" target="_blank">
              {section.channel.title}
            </a>
          ) : (
            section.channel.title
          )}
        </h1>
        <p className="channel-meta">
          {owner ? (
            <>
              <span>Are.na: {owner.name}</span>
              {joined ? <span>Joined {joined}</span> : null}
            </>
          ) : joined ? (
            <span>Created {joined}</span>
          ) : null}
          <span>{section.channel.counts.contents} blocks</span>
        </p>
        <ApiHtml className="description prose" html={section.channel.description?.html} />
      </header>
      <SubNav channels={section.channels} />
      <ThumbnailGrid
        blocks={section.blocks}
        channel={section.channel}
        emptyMessage="No blocks are connected to this channel yet."
      />
    </>
  )
}
