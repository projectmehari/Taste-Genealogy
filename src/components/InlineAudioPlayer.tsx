'use client'

import { useMemo, useState } from 'react'

export type PlayableLink = {
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

export function getPlayableLink(url: string | null | undefined, title: string, embedSrc?: string | null) {
  if (embedSrc) {
    return {
      embedSrc,
      kind: 'iframe',
      title,
      url: url || embedSrc,
    } satisfies PlayableLink
  }

  if (!url) {
    return null
  }

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (audioExtension(parsed.pathname)) {
      return { kind: 'audio', title, url } satisfies PlayableLink
    }

    const youtube = youtubeEmbed(parsed)

    if (youtube) {
      return { embedSrc: youtube, kind: 'iframe', title, url } satisfies PlayableLink
    }

    if (host.endsWith('soundcloud.com')) {
      return {
        embedSrc: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=false`,
        kind: 'iframe',
        title,
        url,
      } satisfies PlayableLink
    }

    if (host.endsWith('mixcloud.com')) {
      return {
        embedSrc: `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=${encodeURIComponent(parsed.pathname)}`,
        kind: 'iframe',
        title,
        url,
      } satisfies PlayableLink
    }

    if (host.endsWith('spotify.com')) {
      const path = parsed.pathname.replace(/^\//, '')

      if (path) {
        return {
          embedSrc: `https://open.spotify.com/embed/${path}`,
          kind: 'iframe',
          title,
          url,
        } satisfies PlayableLink
      }
    }
  } catch {
    return null
  }

  return null
}

export function InlineAudioPlayer({ onClose, player }: InlineAudioPlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const sourceLabel = useMemo(() => {
    if (!player) {
      return null
    }

    try {
      return new URL(player.url).hostname.replace(/^www\./, '')
    } catch {
      return player.url
    }
  }, [player])

  if (!player) {
    return null
  }

  return (
    <aside className="inline-player" data-minimized={isMinimized} aria-label="Audio player">
      <div className="inline-player-bar">
        <div className="inline-player-meta">
          <span>Now playing</span>
          <strong>{player.title}</strong>
          {sourceLabel ? <a href={player.url} target="_blank" rel="noreferrer">{sourceLabel}</a> : null}
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
      {isMinimized ? null : player.kind === 'audio' ? (
        <audio autoPlay controls src={player.url} />
      ) : (
        <iframe
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          src={player.embedSrc}
          title={player.title}
        />
      )}
    </aside>
  )
}
