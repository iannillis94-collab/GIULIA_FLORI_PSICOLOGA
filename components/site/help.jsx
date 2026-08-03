'use client'

import { Reveal, SectionHeading } from './reveal'
import { HELP_TOPICS } from './data'

export function Help() {
  return (
    <section id="aiuto" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Come posso aiutarti"
          title="Un supporto per ciò che stai attraversando"
          subtitle="Ogni difficoltà ha la sua storia. Insieme troviamo lo spazio e gli strumenti per affrontarla con delicatezza."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {HELP_TOPICS.map((t, i) => {
            const Icon = t.icon
            return (
              <Reveal key={t.title} delay={(i % 4) * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-secondary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="relative mt-4 font-serif text-lg text-foreground">{t.title}</h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
