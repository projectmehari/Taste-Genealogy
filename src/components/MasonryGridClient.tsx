'use client'

import { type CSSProperties, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { getPlayableLink, InlineAudioPlayer, type PlayableLink } from '@/components/InlineAudioPlayer'
import {
  computeMasonryLayout,
  type MasonryGridItem,
  type MasonryLayout,
  type PositionedMasonryItem,
  prepareMasonryItems,
} from '@/lib/masonryLayout'

type MasonryGridClientProps = {
  initialLayout: MasonryLayout
  items: MasonryGridItem[]
}

export function MasonryGridClient({ initialLayout, items }: MasonryGridClientProps) {
  const containerRef = useRef<HTMLElement>(null)
  const preparedItemsRef = useRef<ReturnType<typeof prepareMasonryItems> | null>(null)
  const [masonryLayout, setMasonryLayout] = useState(initialLayout)
  const [player, setPlayer] = useState<PlayableLink | null>(null)

  const updateLayout = useCallback(() => {
    const container = containerRef.current
    preparedItemsRef.current ??= prepareMasonryItems(items)

    if (!container) {
      return
    }

    setMasonryLayout(computeMasonryLayout(preparedItemsRef.current, container.clientWidth))
  }, [items])

  useLayoutEffect(() => {
    let isCancelled = false

    async function prepareAndUpdateLayout() {
      await Promise.all([document.fonts.load('16px Areal'), document.fonts.load('12px Areal')])

      if (isCancelled) {
        return
      }

      preparedItemsRef.current = prepareMasonryItems(items)
      updateLayout()
    }

    prepareAndUpdateLayout()

    const container = containerRef.current

    if (!container) {
      return () => {
        isCancelled = true
      }
    }

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(container)

    return () => {
      isCancelled = true
      resizeObserver.disconnect()
    }
  }, [items, updateLayout])

  return (
    <>
      <section
        aria-label="Blocks"
        className="thumbnail-grid"
        ref={containerRef}
        style={{ height: masonryLayout.height }}
      >
        {masonryLayout.items.map((positionedItem) => (
          <Thumbnail
            key={positionedItem.item.id}
            onPlay={setPlayer}
            positionedItem={positionedItem}
          />
        ))}
      </section>
      <InlineAudioPlayer onClose={() => setPlayer(null)} player={player} />
    </>
  )
}

function Thumbnail({
  onPlay,
  positionedItem,
}: {
  onPlay: (player: PlayableLink) => void
  positionedItem: PositionedMasonryItem
}) {
  const { fallbackHeight, item, mediaHeight, metaHeight, width, x, y } = positionedItem
  const playableLink = getPlayableLink(item.url, item.title, item.embedSrc, {
    channelSlug: item.channelSlug,
    channelTitle: item.channelTitle,
    connectedAt: item.connectedAt,
    contributorName: item.contributorName,
    contributorSlug: item.contributorSlug,
  })
  const thumbnailStyle = {
    height: positionedItem.height,
    transform: `translate3d(${x}px, ${y}px, 0)`,
    width,
  } satisfies CSSProperties

  return (
    <article className="thumbnail" style={thumbnailStyle}>
      {item.image ? (
        playableLink ? (
          <button
            aria-label={`Play ${item.title}`}
            className="thumbnail-media thumbnail-play-target"
            onClick={() => onPlay(playableLink)}
            style={{ height: mediaHeight }}
            type="button"
          >
            <img
              alt=""
              height={item.image.height ?? undefined}
              loading="lazy"
              src={item.image.src}
              width={item.image.width ?? undefined}
            />
            <span>Play</span>
          </button>
        ) : (
          <a className="thumbnail-media" href={item.href} rel="noreferrer" style={{ height: mediaHeight }} target="_blank">
            <img
              alt={item.title}
              height={item.image.height ?? undefined}
              loading="lazy"
              src={item.image.src}
              width={item.image.width ?? undefined}
            />
          </a>
        )
      ) : (
        <a className="thumbnail-fallback" href={item.href} rel="noreferrer" style={{ height: fallbackHeight }} target="_blank">
          {item.description || item.title}
        </a>
      )}
      <span className="thumbnail-meta" style={{ height: metaHeight }}>
        {playableLink ? (
          <button className="inline-play-button" onClick={() => onPlay(playableLink)} type="button">
            {item.title}
          </button>
        ) : (
          <a href={item.href} rel="noreferrer" target="_blank">
            {item.title}
          </a>
        )}
      </span>
    </article>
  )
}
