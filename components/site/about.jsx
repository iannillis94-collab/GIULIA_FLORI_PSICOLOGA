'use client'

import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Award, HeartHandshake, GraduationCap, Cross } from 'lucide-react'
import { IMAGES, STATS, CONTACT } from './data'

const TIMELINE = [
  { icon: GraduationCap, title: 'Sociologia e Criminologia', text: 'La prima laurea, per comprendere l’essere umano nel suo contesto.' },
  { icon: GraduationCap, title: 'Scienze e Tecniche Psicologiche', text: 'L’incontro con la psicologia come vocazione e metodo.' },
  { icon: Award, title: 'Laurea in Psicologia — massimo dei voti', text: 'Un percorso completato con dedizione e passione.' },
  { icon: Award, title: 'Master in Psicologia Investigativa e Forense', text: 'Uno sguardo più profondo sulla complessità umana.' },
  { icon: Cross, title: 'Volontaria Croce Rossa Italiana · Albo CRI', text: 'Iscritta al SeP, Albo Nazionale Psicologi CRI.' },
]

export function About() {
  return (
    <section id="chi-sono" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Image */}
          <Reveal>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-primary/20" />
              <img
                src={IMAGES.about}
                alt="Dott.ssa Giulia Flori, Psicologa"
                className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift"
              />
              <div className="absolute -bottom-6 -right-2 md:right-6 rounded-2xl glass-strong border border-border/60 p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-serif text-base leading-tight text-foreground">Accoglienza</p>
                    <p className="text-xs text-muted-foreground">senza giudizio</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <span className="h-px w-6 bg-primary/50" /> Chi sono
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight text-foreground text-balance">
                Comprendere e accompagnare chi si trova in difficoltà
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Sono una psicologa iscritta all’Albo, con esperienza in ambito clinico,
                  riabilitativo ed educativo. Il mio interesse per la sofferenza umana nasce presto:
                  a 13 anni, grazie al contatto diretto con una comunità psichiatrica in cui lavorava
                  mia madre, infermiera, ho potuto osservare da vicino la complessità della fragilità
                  psichica e il valore della cura.
                </p>
                <p>
                  Da lì è nato un desiderio profondo: comprendere e aiutare chi vive un momento
                  difficile. Il mio percorso integra sociologia, criminologia e psicologia,
                  completato con un Master in Psicologia Investigativa e Forense.
                </p>
                <p>
                  Presso il Centro di Riabilitazione Mentale Mario Gozzano (ASL Roma 2), strutture
                  psichiatriche e centri diurni, ho lavorato con persone che vivevano ansia,
                  depressione, trauma, disturbi di personalità, burnout, stress e PTSD.
                </p>
                <p className="font-medium text-foreground">
                  Credo profondamente che ogni persona abbia dentro di sé le risorse per ritrovare
                  il proprio equilibrio, quando viene accolta senza giudizio.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <Button asChild className="mt-8 rounded-full px-6">
                <a href="#prenota">Prenota un primo colloquio</a>
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft">
                <p className="font-serif text-3xl md:text-4xl text-primary">{s.value}</p>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-20">
          <Reveal>
            <h3 className="text-center font-serif text-2xl md:text-3xl text-foreground">Il mio percorso</h3>
          </Reveal>
          <div className="mt-10 mx-auto max-w-3xl">
            {TIMELINE.map((t, i) => {
              const Icon = t.icon
              return (
                <Reveal key={t.title} delay={i * 0.06}>
                  <div className="flex gap-5 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      {i < TIMELINE.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="pt-1.5">
                      <p className="font-serif text-lg text-foreground">{t.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
