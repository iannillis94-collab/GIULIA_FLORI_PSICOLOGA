'use client'

import { Reveal } from './reveal'
import { VALUES } from './data'

export function Values() {
  return (
    <section className="relative z-10 -mt-20 md:-mt-24">
      <div className="container">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="group h-full rounded-3xl glass-strong border border-border/60 p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
