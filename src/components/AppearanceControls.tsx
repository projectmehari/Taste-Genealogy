'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FEATURED_CHANNELS, FEATURED_CHANNEL_SLUGS } from '@/config/channels'

const CHANNEL_THEMES = new Map(FEATURED_CHANNELS.map((channel) => [channel.slug, channel.theme]))

function channelFromPathname(pathname: string | null) {
  const slug = pathname?.split('/').filter(Boolean)[0]

  if (slug && FEATURED_CHANNEL_SLUGS.includes(slug)) {
    return slug
  }

  return 'home'
}

export function AppearanceControls() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

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

  useEffect(() => {
    const channel = channelFromPathname(pathname)
    const theme = CHANNEL_THEMES.get(channel)

    if (theme) {
      document.documentElement.style.setProperty('--page-background', theme[isDark ? 'dark' : 'light'])
    } else {
      document.documentElement.style.removeProperty('--page-background')
    }
  }, [isDark, pathname])

  return (
    <div className="header-controls">
      <button
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="theme-toggle"
        onClick={() => setIsDark((current) => !current)}
        type="button"
      >
        {isDark ? 'Light' : 'Dark'}
      </button>
      <button
        aria-controls="about-panel"
        aria-expanded={isAboutOpen}
        className="about-toggle"
        onClick={() => setIsAboutOpen((current) => !current)}
        type="button"
      >
        About
      </button>
      {isAboutOpen ? (
        <section aria-labelledby="about-heading" className="about-panel prose" id="about-panel">
          <div className="about-panel-header">
            <h2 id="about-heading">About Taste Genealogy</h2>
            <button
              aria-label="Close about panel"
              className="about-close"
              onClick={() => setIsAboutOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
          <p>
            Taste Genealogy is a living map of music taste: a rolling curation of records,
            videos, posters, scenes, textures, DJ mixes, and other sonic references collected by
            Are.na users.
          </p>
          <p>
            Instead of treating taste like a fixed profile, it follows trails between people and
            channels — who saves what, which worlds cluster together, and how music culture moves
            through fragments.
          </p>
          <p>
            Built with the{' '}
            <a href="https://github.com/aredotna/api-examples" rel="noreferrer" target="_blank">
              Are.na API
            </a>
            . Shout out to{' '}
            <a href="https://github.com/dzucconi" rel="noreferrer" target="_blank">
              Damon Zucconi
            </a>{' '}
            for creating Are.na.
          </p>
        </section>
      ) : null}
    </div>
  )
}
