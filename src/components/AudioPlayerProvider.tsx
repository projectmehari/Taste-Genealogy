'use client'

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { InlineAudioPlayer, type PlayableLink } from '@/components/InlineAudioPlayer'

type AudioPlayerContextValue = {
  closePlayer: () => void
  play: (player: PlayableLink) => void
  player: PlayableLink | null
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)

type AudioPlayerProviderProps = {
  children: ReactNode
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const [player, setPlayer] = useState<PlayableLink | null>(null)

  const play = useCallback((nextPlayer: PlayableLink) => {
    setPlayer(nextPlayer)
  }, [])

  const closePlayer = useCallback(() => {
    setPlayer(null)
  }, [])

  const value = useMemo(
    () => ({
      closePlayer,
      play,
      player,
    }),
    [closePlayer, play, player],
  )

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <InlineAudioPlayer onClose={closePlayer} player={player} />
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)

  if (!context) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider')
  }

  return context
}
