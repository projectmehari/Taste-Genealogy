'use client'

import { useEffect, useMemo, useState } from 'react'

export type PlayableProvenance = {
  channelSlug?: string
  channelTitle?: string
  connectedAt?: string
  contributorName?: string
  contributorSlug?: string
}

export type PlayableLink = PlayableProvenance & {
  embedSrc?: string
  kind: 'audio' | 'iframe'
  title: string
  url: string
}

type InlineAudioPlayerProps = {
  player: PlayableLink | null
  onClose: () => void
}

function audioExtension(url: string) {
  return /\.(mp3|m4a|aac|ogg|oga|wav|flac)(\?|#|$)/i.test(url)
}

function youtubeEmbed(url: URL) {
  if (url.hostname.includes('youtube.com')) {
    const id = url.searchParams.get('v')

    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null
  }

  if (url.hostname.includes('youtu.be')) {
    const id = url.pathname.split('/').filter(Boolean)[0]

    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null
  }

  return null
}

function mixcloudEmbed(url: URL) {
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=true&feed=${encodeURIComponent(url.href)}`
}

function spotifyEmbed(url: URL) {
  const path = url.pathname.replace(/^\//, '')

  return path ? `https://open.spotify.com/embed/${path}` : null
}

function sourceLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function arenaUserUrl(slug: string) {
  return `https://www.are.na/${slug}`
}

function arenaChannelUrl(slug: string) {
  return `https://www.are.na/channel/${slug}`
}

function formatConnectedDate(value?: string) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function getPlayableLink(
  url: string | null | undefined,
  title: string,
  embedSrc?: string | null,
  provenance: PlayableProvenance = {},
) {
  if (url) {
    try {
      const parsed = new URL(url)
      const host = parsed.hostname.replace(/^www\./, '')

      if (audioExtension(parsed.pathname)) {
        return { kind: 'audio', title, url, ...provenance } satisfies PlayableLink
      }

      const youtube = youtubeEmbed(parsed)

      if (youtube) {
        return { embedSrc: youtube, kind: 'iframe', title, url, ...provenance } satisfies PlayableLink
      }

      if (host.endsWith('soundcloud.com')) {
        return {
          embedSrc: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=false`,
          kind: 'iframe',
          title,
          url,
          ...provenance,
        } satisfies PlayableLink
      }

      if (host.endsWith('mixcloud.com')) {
        return {
          embedSrc: mixcloudEmbed(parsed),
          kind: 'iframe',
          title,
          url,
          ...provenance,
        } satisfies PlayableLink
      }

      if (host.endsWith('spotify.com')) {
        const spotify = spotifyEmbed(parsed)

        if (spotify) {
          return {
            embedSrc: spotify,
            kind: 'iframe',
            title,
            url,
            ...provenance,
          } satisfies PlayableLink
        }
      }
    } catch {
      return null
    }
  }

  if (embedSrc) {
    return {
      embedSrc,
      kind: 'iframe',
      title,
      url: url || embedSrc,
      ...provenance,
    } satisfies PlayableLink
  }

  return null
}

export function InlineAudioPlayer({ onClose, player }: InlineAudioPlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const label = useMemo(() => (player ? sourceLabel(player.url) : null), [player])
  const connectedAt = useMemo(
    () => (player ? formatConnectedDate(player.connectedAt) : null),
    [player],
  )

  useEffect(() => {
    setIsMinimized(false)
  }, [player?.url])

  if (!player) {
    return null
  }

  return (
    <aside className="inline-player" data-minimized={isMinimized} aria-label="Audio player">
      <div className="inline-player-bar">
        <div className="inline-player-waveform" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="inline-player-meta">
          <span>{isMinimized ? 'Playing' : 'Now playing'}</span>
          <strong>{player.title}</strong>
          <span className="inline-player-provenance">
            {player.channelTitle ? (
              <a href={player.channelSlug ? arenaChannelUrl(player.channelSlug) : undefined} target="_blank" rel="noreferrer">
                {player.channelTitle}
              </a>
            ) : null}
            {player.contributorName ? (
              <>
                <span aria-hidden="true"> · </span>
                <a href={player.contributorSlug ? arenaUserUrl(player.contributorSlug) : undefined} target="_blank" rel="noreferrer">
                  {player.contributorName}
                </a>
              </>
            ) : null}
            {connectedAt ? <span> · added {connectedAt}</span> : null}
          </span>
          {label ? <a href={player.url} target="_blank" rel="noreferrer">{label}</a> : null}
        </div>
        <div className="inline-player-actions">
          <button type="button" onClick={() => setIsMinimized((current) => !current)}>
            {isMinimized ? 'Expand' : 'Minimize'}
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="inline-player-body" data-minimized={isMinimized} aria-hidden={isMinimized}>
        {player.kind === 'audio' ? (
          <audio autoPlay controls playsInline src={player.url} />
        ) : (
          <iframe
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            loading="eager"
            src={player.embedSrc}
            title={player.title}
          />
        )}
      </div>
    </aside>
  )
}
