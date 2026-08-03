'use client'

import { useRef, useState, useLayoutEffect } from 'react'

/**
 * Reveal: progressive-enhancement scroll animation.
 * - Content is ALWAYS visible in SSR / before hydration (no JS = no blank screen).
 * - Elements already in the viewport at mount stay visible (no flash, great for above-the-fold).
 * - Elements below the fold fade/slide in when scrolled into view.
 */
export function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const ref = useRef(null)
  const [armed, setArmed] = useState(false) // becomes true only for off-screen elements
  const [shown, setShown] = useState(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    const rect = el.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
    if (inView) return // keep visible, no animation
    setArmed(true)
    setShown(false)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hidden = armed && !shown
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        transitionDelay: `${delay}s`,
        opacity: hidden ? 0 : 1,
        transform: hidden ? `translateY(${y}px)` : 'translateY(0)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-6 bg-primary/50" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-3xl md:text-4xl lg:text-[2.75rem] leading-tight text-foreground text-balance">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
