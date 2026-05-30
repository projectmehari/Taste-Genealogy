'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { PlayProvider } from '@playhtml/react'
import { LiveSignals } from '@/components/LiveSignals'

type PlayPresenceClientProps = {
  children: ReactNode
}

export default function PlayPresenceClient({ children }: PlayPresenceClientProps) {
  const pathname = usePathname()
  const host = process.env.NEXT_PUBLIC_PLAYHTML_HOST
  const room = useMemo(() => {
    return pathname || '/'
  }, [pathname])

  const initOptions = useMemo(
    () => ({
      host,
      cursors: {
        enabled: true,
        room,
        cursorStyle: 'dot',
        visibilityThreshold: 12_000,
      },
      onError: () => {
        console.warn('[playhtml] live presence failed to connect')
      },
    }),
    [host, room],
  )

  useEffect(() => {
    if (!host && process.env.NODE_ENV === 'development') {
      console.warn('[playhtml] NEXT_PUBLIC_PLAYHTML_HOST is not set; live presence is disabled')
    }
  }, [host])

  if (!host) {
    return <>{children}</>
  }

  return (
    <PlayProvider initOptions={initOptions} pathname={pathname}>
      {children}
      <LiveSignals />
    </PlayProvider>
  )
}
