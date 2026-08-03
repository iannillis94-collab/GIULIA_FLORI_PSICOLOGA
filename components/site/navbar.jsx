'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, Moon, Sun, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { NAV_LINKS } from './data'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div
        className={`container flex items-center justify-between rounded-full transition-all duration-500 ${
          scrolled ? 'glass-strong shadow-soft px-5 py-2.5' : 'px-2 py-2'
        }`}
      >
        <a href="#home" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <HeartHandshake className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="leading-tight">
            <span className={`block font-serif text-lg transition-colors ${scrolled ? 'text-foreground' : 'text-white drop-shadow'}`}>Giulia Flori</span>
            <span className={`block text-[0.6rem] uppercase tracking-[0.1em] transition-colors ${scrolled ? 'text-muted-foreground' : 'text-white/80'}`}>Psicologa iscritta all&rsquo;Albo del Lazio</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors ${scrolled ? 'text-foreground/70 hover:text-foreground hover:bg-secondary/60' : 'text-white/85 hover:text-white hover:bg-white/10'}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              aria-label="Cambia tema"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${scrolled ? 'text-foreground/70 hover:bg-secondary/60 hover:text-foreground' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          )}
          <Button asChild className="hidden sm:inline-flex rounded-full px-5 shadow-soft">
            <a href="#prenota">Prenota</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Menu" className={`lg:hidden grid h-9 w-9 place-items-center rounded-full transition-colors ${scrolled ? 'text-foreground hover:bg-secondary/60' : 'text-white hover:bg-white/10'}`}>
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82%] max-w-sm bg-background">
              <SheetTitle className="font-serif text-2xl">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-lg text-foreground/80 transition-colors hover:bg-secondary/60 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <Button asChild className="mt-6 w-full rounded-full" onClick={() => setOpen(false)}>
                <a href="#prenota">Prenota un colloquio</a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
