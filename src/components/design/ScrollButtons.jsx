import { useRef, useCallback } from 'react'
import { setScrollLockBypassed } from '../../hooks/useScrollLock'

const SCROLL_SPEED = 8 // px per frame (~480px/s at 60fps)

export default function ScrollButtons() {
  const rafRef = useRef(null)

  const startScroll = useCallback((direction) => {
    setScrollLockBypassed(true)
    const step = () => {
      window.scrollBy(0, direction * SCROLL_SPEED)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [])

  const stopScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setScrollLockBypassed(false)
  }, [])

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1 rounded-full border border-outline-variant/20 bg-surface/80 backdrop-blur-sm py-2 px-1">
      {/* Up */}
      <button
        onMouseEnter={() => startScroll(-1)}
        onMouseLeave={stopScroll}
        className="w-9 h-9 flex items-center justify-center text-outline/50 hover:text-primary transition-colors cursor-pointer"
        style={{ transitionDuration: '350ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        aria-label="Scroll arriba"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 10L8 6L4 10" />
        </svg>
      </button>

      {/* Down */}
      <button
        onMouseEnter={() => startScroll(1)}
        onMouseLeave={stopScroll}
        className="w-9 h-9 flex items-center justify-center text-outline/50 hover:text-primary transition-colors cursor-pointer"
        style={{ transitionDuration: '350ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        aria-label="Scroll abajo"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6L8 10L12 6" />
        </svg>
      </button>
    </div>
  )
}
