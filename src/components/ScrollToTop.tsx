'use client'

import { useEffect, useState } from 'react'

function shouldShowScrollButton() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const threshold = Math.min(240, Math.max(80, maxScroll * 0.25))

  return maxScroll > 80 && window.scrollY > threshold
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(shouldShowScrollButton())
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <button
      aria-label="Scroll back to top"
      className="scroll-to-top"
      data-visible={isVisible}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      type="button"
    >
      ↑
    </button>
  )
}
