'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FEATURED_CHANNELS } from '@/config/channels'

const CHANNEL_THEMES = new Map(FEATURED_CHANNELS.map((channel) => [channel.slug, channel.theme]))

type NavLinkStyle = CSSProperties & {
  '--nav-link-bg'?: string
  '--nav-link-bg-dark'?: string
}

function slugFromHref(href: string) {
  return href.split('/').filter(Boolean)[0]
}

function navLinkStyle(href: string): NavLinkStyle | undefined {
  const theme = CHANNEL_THEMES.get(slugFromHref(href))

  if (!theme) {
    return undefined
  }

  return {
    '--nav-link-bg': theme.light,
    '--nav-link-bg-dark': theme.dark,
  }
}

type NavItem = {
  href: string
  id: number | string
  title: string
}

type NavLinksProps = {
  items: NavItem[]
}

export function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary navigation" className="nav-list">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname === item.href.replace(/\/$/, '')

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className="nav-link"
            href={item.href}
            key={item.id}
            style={navLinkStyle(item.href)}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
