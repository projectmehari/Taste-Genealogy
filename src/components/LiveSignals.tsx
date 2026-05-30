'use client'

import type { CSSProperties } from 'react'
import { useCursorPresences, usePlayContext } from '@playhtml/react'

type SignalPresence = {
  playerIdentity?: {
    name?: string
    publicKey?: string
    playerStyle?: {
      colorPalette?: string[]
    }
  }
}

const SELF_SIGNAL: SignalPresence = {
  playerIdentity: {
    name: 'you',
    publicKey: 'self',
    playerStyle: {
      colorPalette: ['#6dff9d'],
    },
  },
}

function visitorColor(presence: SignalPresence) {
  return presence.playerIdentity?.playerStyle?.colorPalette?.[0] ?? '#d9cab3'
}

function visitorLabel(presence: SignalPresence, index: number) {
  if (presence.playerIdentity?.name) {
    return presence.playerIdentity.name
  }

  const suffix = presence.playerIdentity?.publicKey?.slice(0, 2) ?? String(index + 1).padStart(2, '0')
  return `signal ${suffix}`
}

export function LiveSignals() {
  const presences = useCursorPresences()
  const { getMyPlayerIdentity, isLoading } = usePlayContext()
  const myPublicKey = getMyPlayerIdentity()?.publicKey
  const remotePeople = Array.from(presences.values()).filter(
    (presence) => presence.playerIdentity?.publicKey !== myPublicKey,
  )
  const total = isLoading ? remotePeople.length : remotePeople.length + 1
  const visibleSignals = isLoading ? remotePeople : [SELF_SIGNAL, ...remotePeople]

  if (isLoading && total === 0) {
    return null
  }

  return (
    <aside
      aria-label={`${total} ${total === 1 ? 'signal' : 'signals'} live`}
      className="live-signals"
      data-count={total}
    >
      <span className="live-signals__pulse" aria-hidden="true" />
      <span className="live-signals__count">{total}</span>
      <span className="live-signals__label">{total === 1 ? 'signal' : 'signals'} live</span>
      <span className="live-signals__dots" aria-hidden="true">
        {visibleSignals.slice(0, 5).map((presence, index) => (
          <span
            className="live-signals__dot"
            key={presence.playerIdentity?.publicKey ?? index}
            style={
              {
                '--signal-color': visitorColor(presence),
                '--signal-delay': `${index * 0.37}s`,
              } as CSSProperties
            }
            title={visitorLabel(presence, index)}
          />
        ))}
      </span>
      {remotePeople.length > 0 ? <span className="live-signals__hint">same page</span> : null}
    </aside>
  )
}
