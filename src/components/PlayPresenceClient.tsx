'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PlayProvider } from '@playhtml/react'
import { LiveSignals } from '@/components/LiveSignals'

type PlayPresenceClientProps = {
  children: ReactNode
}

export default function PlayPresenceClient({ children }: PlayPresenceClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const room = useMemo(() => {
    const base = pathname || '/'
    const query = searchParams?.toString()
    return query ? `${base}?${query}` : base
  }, [pathname, searchParams])

  const initOptions = useMemo(
    () => ({
      host: process.env.NEXT_PUBLIC_PLAYHTML_HOST,
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
    [room],
  )

  return (
    <PlayProvider initOptions={initOptions} pathname={pathname}>
      {children}
      <LiveSignals />
    </PlayProvider>
  )
}
