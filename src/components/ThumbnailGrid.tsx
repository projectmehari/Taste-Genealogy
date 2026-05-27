import type { Block, Channel } from '@aredotna/sdk'
import { blockDescription, blockImageData, blockTitle } from '@/lib/og'
import { MasonryGrid, type MasonryGridItem } from './MasonryGrid'

type ThumbnailGridProps = {
  blockContexts?: Map<number, Channel>
  blocks: Block[]
  channel?: Channel
  emptyMessage: string
}

function thumbnailItem(block: Block, channel?: Channel): MasonryGridItem {
  const title = blockTitle(block)
  const sourceUrl = blockSourceUrl(block)
  const contributor = block.connection?.connected_by ?? null

  return {
    channelSlug: channel?.slug,
    channelTitle: channel?.title,
    connectedAt: block.connection?.connected_at,
    contributorName: contributor?.name,
    contributorSlug: contributor?.slug,
    description: blockDescription(block),
    embedSrc: blockEmbedSrc(block),
    href: `https://www.are.na/block/${block.id}`,
    id: block.id,
    image: blockImageData(block),
    title,
    url: sourceUrl,
  }
}

function blockSourceUrl(block: Block) {
  if (block.type === 'Link') {
    return block.source?.url ?? null
  }

  if (block.type === 'Embed') {
    return block.embed.source_url ?? block.embed.url ?? block.source?.url ?? null
  }

  if (block.type === 'Attachment') {
    return block.attachment.url
  }

  return block.source?.url ?? null
}

function blockEmbedSrc(block: Block) {
  if (block.type !== 'Embed' || !block.embed.html) {
    return null
  }

  const src = block.embed.html.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1]

  return src ?? null
}

export function ThumbnailGrid({ blockContexts, blocks, channel, emptyMessage }: ThumbnailGridProps) {
  if (blocks.length === 0) {
    return <p>{emptyMessage}</p>
  }

  return <MasonryGrid items={blocks.map((block) => thumbnailItem(block, channel ?? blockContexts?.get(block.id)))} />
}
