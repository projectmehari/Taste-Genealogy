'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const CHANNEL_SLUGS = [
  'sonic-diversity-zewocbw6otq',
  'cinema-9yfvn85suew',
  'aura-3jsxrom9yya',
]

function channelFromPathname(pathname: string | null) {
  const slug = pathname?.split('/').filter(Boolean)[0]

  if (slug && CHANNEL_SLUGS.includes(slug)) {
    return slug
  }

  return 'home'
}

export function AppearanceControls() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('taste-genealogy-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    setIsDark(savedTheme ? savedTheme === 'dark' : prefersDark)
  }, [])

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light'

    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('taste-genealogy-theme', theme)
  }, [isDark])

  useEffect(() => {
    document.documentElement.dataset.channel = channelFromPathname(pathname)
  }, [pathname])

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
      onClick={() => setIsDark((current) => !current)}
      type="button"
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}
