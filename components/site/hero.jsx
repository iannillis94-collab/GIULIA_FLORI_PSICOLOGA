'use client'

import { ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IMAGES } from './data'

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Un ambiente sereno e luminoso che trasmette calma e fiducia"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(26,32,28,0.85) 0%, rgba(26,32,28,0.58) 40%, rgba(26,32,28,0.22) 70%, rgba(26,32,28,0.02) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(24,36,29,0.4) 0%, rgba(24,36,29,0) 28%, rgba(24,36,29,0) 72%, hsl(var(--background)) 100%)',
          }}
        />
      </div>

      <div className="container relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-20">
        <div className="max-w-2xl animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white ring-1 ring-white/25">
            <ShieldCheck className="h-4 w-4" />
            Psicologa iscritta all&rsquo;Albo
          </span>

          <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] text-white drop-shadow-sm sm:text-5xl lg:text-6xl text-balance">
            Un luogo sicuro dove ritrovare equilibrio, comprensione e serenit&agrave;.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
            La relazione &egrave; il primo passo della cura. Ti accompagno con empatia e
            professionalit&agrave; in un percorso di crescita personale.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-full px-7 py-6 text-base shadow-lift group">
              <a href="#prenota">
                Prenota un colloquio
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/50 bg-white/10 px-7 py-6 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <a href="#chi-sono">Scopri di pi&ugrave;</a>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-3 text-white/85">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current text-[#E8D9A8]" />
              ))}
            </div>
            <span className="text-sm">Percorsi in studio e online &middot; Ascolto senza giudizio</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
        </div>
      </div>
    </section>
  )
}
