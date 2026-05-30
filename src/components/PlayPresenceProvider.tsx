'use client'

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const PlayPresenceClient = dynamic(() => import('@/components/PlayPresenceClient'), {
  ssr: false,
})

type PlayPresenceProviderProps = {
  children: ReactNode
}

export function PlayPresenceProvider({ children }: PlayPresenceProviderProps) {
  return <PlayPresenceClient>{children}</PlayPresenceClient>
}
