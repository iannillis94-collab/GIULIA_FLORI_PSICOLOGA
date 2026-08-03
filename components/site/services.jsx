'use client'

import { Reveal, SectionHeading } from './reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Check, ArrowUpRight } from 'lucide-react'
import { SERVICES } from './data'

export function Services() {
  return (
    <section id="servizi" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Servizi"
          title="Percorsi pensati intorno a te"
          subtitle="Ogni percorso è costruito su misura, nel rispetto dei tuoi tempi e dei tuoi obiettivi."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.1}>
                <div className="group flex h-full flex-col rounded-3xl border border-border/60 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <Badge variant="secondary" className="rounded-full font-normal">
                      <Clock className="mr-1 h-3 w-3" /> {s.duration}
                    </Badge>
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <ul className="mt-4 space-y-2">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 shrink-0 text-primary" /> {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#prenota"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Prenota questo percorso
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
