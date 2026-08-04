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
                  Sono una psicologa iscritta nell&rsquo;Albo del Lazio, con un&rsquo;esperienza che
                  negli anni si &egrave; costruita attraverso l&rsquo;ambito clinico, riabilitativo ed
                  educativo. Il mio interesse per la sofferenza umana, per&ograve;, affonda le radici
                  molto prima dell&rsquo;inizio del mio percorso professionale: a soli tredici anni ho
                  avuto l&rsquo;opportunit&agrave; di entrare in contatto diretto con una comunit&agrave;
                  psichiatrica, dove mia madre lavorava come infermiera. Fu l&igrave; che, osservando da
                  vicino la complessit&agrave; della fragilit&agrave; psichica, cominciai a intuire il
                  valore autentico della cura.
                </p>
                <p>
                  Da quell&rsquo;esperienza &egrave; nato un desiderio che non mi ha pi&ugrave;
                  abbandonata: capire davvero chi vive un momento di difficolt&agrave;, e trovare il modo
                  per starle accanto. Per seguire questa vocazione ho costruito un percorso di studi che
                  intreccia sociologia, criminologia e psicologia, completandolo poi con un Master in
                  Psicologia Investigativa e Forense.
                </p>
                <p>
                  Nel corso degli anni ho lavorato presso il Centro di Riabilitazione Mentale Mario
                  Gozzano (ASL Roma 2), oltre che in diverse strutture psichiatriche e centri diurni,
                  incontrando persone alle prese con ansia, depressione, trauma, disturbi di
                  personalit&agrave;, burnout, stress e PTSD.
                </p>
                <p>
                  Il mio impegno si &egrave; esteso anche al mondo del volontariato: presso la Croce
                  Rossa Italiana ricopro il ruolo di psicologa del SEP, occupandomi del supporto emotivo
                  e della prevenzione del burnout tra i volontari, che quotidianamente si confrontano con
                  situazioni di forte impatto emotivo. Affianco inoltre l&rsquo;attivit&agrave; come
                  psicologa dell&rsquo;emergenza, intervenendo nei contesti di crisi per offrire un primo
                  sostegno psicologico a chi vive momenti di grande vulnerabilit&agrave;.
                </p>
                <p className="font-medium text-foreground">
                  Da tutto questo cammino porto con me una convinzione che guida ancora oggi il mio
                  lavoro: ognuno di noi possiede, dentro di s&eacute;, le risorse per ritrovare il proprio
                  equilibrio &mdash; a patto di essere accolto senza giudizio.
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
                  <Newspaper className="h-4 w-4" /> Pubblicazioni scientifiche
                </span>
                <h3 className="mt-3 font-serif text-2xl md:text-3xl text-foreground">
                  Rivista Salute 33 &mdash; Rivista di Divulgazione Scientifica
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
