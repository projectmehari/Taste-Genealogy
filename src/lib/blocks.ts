import 'server-only'

import type { Block, Channel, User } from '@aredotna/sdk'
import { cache } from 'react'
import {
  arena,
  getChannelDisplayTitle,
  getConfiguredChannelSlugs,
  getRootChannelSlug,
  getSiteDescription,
  getSiteTitle,
} from '@/config/arena'

export type Connectable = Block | Channel

export type ChannelSection = {
  blocks: Block[]
  channel: Channel
  channels: Channel[]
  ownerProfile?: User | null
}

export type SiteData = {
  allBlocks: Block[]
  blockContexts: Map<number, Channel>
  blocksById: Map<number, Block>
  root: Channel
  rootBlocks: Block[]
  rootChannels: Channel[]
  sectionsBySlug: Map<string, ChannelSection>
}

const LATEST_HOME_BLOCK_LIMIT = 120

function isBlock(item: Connectable): item is Block {
  return 'base_type' in item && item.base_type === 'Block'
}

function isChannel(item: Connectable): item is Channel {
  return 'type' in item && item.type === 'Channel'
}

function sortByConnectionPosition<T extends Connectable>(items: T[]) {
  return [...items].sort((a, b) => {
    const aPosition = a.connection?.position ?? Number.MAX_SAFE_INTEGER
    const bPosition = b.connection?.position ?? Number.MAX_SAFE_INTEGER

    return aPosition - bPosition
  })
}

function sortBlocksByLatestUpdate(blocks: Block[]) {
  return [...blocks].sort((a, b) => {
    const aDate = Date.parse(a.connection?.connected_at ?? a.created_at)
    const bDate = Date.parse(b.connection?.connected_at ?? b.created_at)

    return bDate - aDate
  })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function retryDelayMs(error: unknown, attempt: number) {
  const response = (error as { response?: { headers?: { get?: (name: string) => string | null } } })
    .response
  const retryAfter = Number(response?.headers?.get?.('retry-after'))

  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000
  }

  return Math.min(90_000, 2000 * 2 ** attempt)
}

async function withArenaRetry<T>(label: string, load: () => Promise<T>) {
  let lastError: unknown

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await load()
    } catch (error) {
      lastError = error
      const status = (error as { status?: number }).status

      if (status !== 429 || attempt === 3) {
        throw error
      }

      const delay = retryDelayMs(error, attempt)
      console.warn(`${label} hit Are.na rate limit; retrying in ${Math.round(delay / 1000)}s`)
      await sleep(delay)
    }
  }

  throw lastError
}

function withDisplayTitle(channel: Channel) {
  return {
    ...channel,
    title: getChannelDisplayTitle(channel.slug, channel.title),
  }
}

async function getChannelOwnerProfile(channel: Channel) {
  if (channel.owner?.type !== 'User') {
    return null
  }

  return withArenaRetry(`user ${channel.owner.slug}`, () => arena.users.get(channel.owner.slug))
}

async function getChannelContents(slug: string) {
  return withArenaRetry(`channel contents ${slug}`, async () => {
    const contents: Connectable[] = []

    for await (const page of arena.channels.paginateContents(slug, { per: 100 })) {
      contents.push(...page.data)
    }

    return sortByConnectionPosition(contents)
  })
}

function splitContents(items: Connectable[]) {
  return {
    blocks: items.filter(isBlock),
    channels: items.filter(isChannel),
  }
}

function addBlock(
  block: Block,
  channel: Channel,
  data: Pick<SiteData, 'allBlocks' | 'blockContexts' | 'blocksById'>,
) {
  if (data.blocksById.has(block.id)) {
    return
  }

  data.allBlocks.push(block)
  data.blocksById.set(block.id, block)
  data.blockContexts.set(block.id, channel)
}

async function loadSiteData(): Promise<SiteData> {
  const configuredChannelSlugs = getConfiguredChannelSlugs()

  if (configuredChannelSlugs) {
    const sections: ChannelSection[] = []

    for (const slug of configuredChannelSlugs) {
      const channel = withDisplayTitle(
        await withArenaRetry(`channel ${slug}`, () => arena.channels.get(slug)),
      )
      const items = await getChannelContents(channel.slug)
      const { blocks, channels } = splitContents(items)

      sections.push({ blocks, channel, channels, ownerProfile: await getChannelOwnerProfile(channel) })
    }

    const root = {
      id: 0,
      title: getSiteTitle(),
      slug: 'index',
      description: {
        html: getSiteDescription(),
        plain: getSiteDescription(),
      },
      length: sections.length,
      status: 'public',
      type: 'Channel',
      updated_at: new Date().toISOString(),
    } as unknown as Channel

    const data: SiteData = {
      allBlocks: [],
      blockContexts: new Map(),
      blocksById: new Map(),
      root,
      rootBlocks: [],
      rootChannels: sections.map((section) => section.channel),
      sectionsBySlug: new Map(),
    }

    for (const section of sections) {
      for (const block of section.blocks) {
        addBlock(block, section.channel, data)
      }
    }

    data.rootBlocks = sortBlocksByLatestUpdate(data.allBlocks).slice(0, LATEST_HOME_BLOCK_LIMIT)
    data.sectionsBySlug = new Map(sections.map((section) => [section.channel.slug, section]))

    return data
  }

  const root = withDisplayTitle(await withArenaRetry('root channel', () => arena.channels.get(getRootChannelSlug())))
  const rootItems = await getChannelContents(root.slug)
  const { blocks: rootBlocks, channels: rootChannels } = splitContents(rootItems)

  const data: SiteData = {
    allBlocks: [],
    blockContexts: new Map(),
    blocksById: new Map(),
    root,
    rootBlocks,
    rootChannels,
    sectionsBySlug: new Map(),
  }

  for (const block of rootBlocks) {
    addBlock(block, root, data)
  }

  const sections = await Promise.all(
    rootChannels.map(async (channel) => {
      const items = await getChannelContents(channel.slug)
      const { blocks, channels } = splitContents(items)
      const section: ChannelSection = {
        blocks,
        channel,
        channels,
        ownerProfile: await getChannelOwnerProfile(channel),
      }

      for (const block of blocks) {
        addBlock(block, channel, data)
      }

      return section
    }),
  )

  data.sectionsBySlug = new Map(sections.map((section) => [section.channel.slug, section]))

  return data
}

let siteDataPromise: Promise<SiteData> | undefined

export const getSiteData = cache(() => {
  siteDataPromise ??= loadSiteData()
  return siteDataPromise
})

export async function getAllBlocks() {
  return (await getSiteData()).allBlocks
}

export async function getBlock(id: string | number) {
  return (await getSiteData()).blocksById.get(Number(id)) ?? null
}

export async function getBlockContext(id: string | number) {
  return (await getSiteData()).blockContexts.get(Number(id)) ?? null
}

export async function getSection(slug: string) {
  return (await getSiteData()).sectionsBySlug.get(slug) ?? null
}
