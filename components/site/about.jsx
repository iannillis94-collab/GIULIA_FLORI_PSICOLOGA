'use client'

import { Reveal } from './reveal'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Award, HeartHandshake, GraduationCap, Cross, Newspaper } from 'lucide-react'
import { IMAGES, STATS, CONTACT } from './data'

const TIMELINE = [
  { icon: GraduationCap, title: 'Sociologia e Criminologia', text: 'Studio dei fenomeni sociali, criminologici e delle dinamiche del comportamento umano.' },
  { icon: GraduationCap, title: 'Scienze e Tecniche Psicologiche', text: 'Formazione sulle basi teoriche, valutazione psicologica e relazione d’aiuto professionale.' },
  { icon: Award, title: 'Laurea in Psicologia Clinica', text: 'Approfondimento clinico su diagnosi, benessere psicologico, ascolto e intervento terapeutico.' },
  { icon: Award, title: 'Master in Psicologia Investigativa e Forense', text: 'Specializzazione in psicologia forense, investigativa, valutazione e consulenza giudiziaria specialistica.' },
  { icon: Cross, title: 'Volontaria Croce Rossa Italiana · Albo Nazionale Psicologi CRI', text: 'Supporto psicologico nelle emergenze, vulnerabilità, resilienza e interventi umanitari qualificati.' },
]

export function About() {
  return (
    <section id="chi-sono" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Image */}
          <Reveal>
            <div className="relative pb-10 pr-6 md:pb-0 md:pr-0">
              <div className="absolute -left-4 -top-4 hidden h-[92%] w-[86%] rounded-[2rem] border border-primary/20 md:block" />
              <img
                src={IMAGES.about}
                alt="Dott.ssa Giulia Flori, Psicologa"
                className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift"
              />
              {/* Foto collage sovrapposta */}
              <div className="absolute -bottom-2 right-0 w-28 overflow-hidden rounded-2xl border-4 border-background shadow-lift sm:w-40 md:-bottom-8 md:-right-8">
                <img
                  src={IMAGES.portraitStanding}
                  alt="Dott.ssa Giulia Flori nel suo studio"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              {/* Chip accoglienza */}
              <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1.5 shadow-soft">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Accoglienza senza giudizio</span>
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

        {/* Come vista su - Press */}
        <div className="mt-16">
          <Reveal>
            <div className="grid items-center gap-6 overflow-hidden rounded-[2rem] border border-border/60 bg-card p-4 shadow-soft sm:grid-cols-[240px_1fr] md:p-6">
              <img
                src={IMAGES.press}
                alt="Dott.ssa Giulia Flori sulla rivista Salute33"
                className="h-60 w-full rounded-2xl object-cover sm:h-72"
              />
              <div className="px-2 pb-3 sm:pb-0">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  <Newspaper className="h-4 w-4" /> Come vista su
                </span>
                <h3 className="mt-3 font-serif text-2xl md:text-3xl text-foreground">
                  Rivista Salute33 &mdash; Rubrica di Psicologia
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  &ldquo;Lo stress non &egrave; solo nella testa: come impatta davvero sulla nostra
                  vita.&rdquo; Un contributo divulgativo per raccontare il benessere psicologico con
                  parole semplici, vicine alle persone e alla loro quotidianit&agrave;.
                </p>
              </div>
            </div>
          </Reveal>
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
