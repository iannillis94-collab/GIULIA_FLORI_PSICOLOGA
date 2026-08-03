'use client'

import { useEffect, useState } from 'react'
import { Clock, ArrowRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Reveal, SectionHeading } from './reveal'

export function Blog() {
  const [posts, setPosts] = useState([])
  const [cat, setCat] = useState('Tutti')
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetch('/api/blog').then((r) => r.json()).then((d) => Array.isArray(d) && setPosts(d)).catch(() => {})
  }, [])

  const cats = ['Tutti', ...Array.from(new Set(posts.map((p) => p.category)))]
  const filtered = cat === 'Tutti' ? posts : posts.filter((p) => p.category === cat)

  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Blog & Benessere"
          title="Parole per comprendersi meglio"
          subtitle="Articoli e riflessioni su ansia, stress, relazioni e benessere psicologico."
        />

        <Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                  cat === c ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-secondary/60 text-foreground/70 hover:bg-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <article
                onClick={() => setActive(p)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <Badge className="absolute left-4 top-4 rounded-full bg-white/90 text-foreground hover:bg-white">{p.category}</Badge>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {p.readingTime} min di lettura
                  </div>
                  <h3 className="mt-3 font-serif text-xl leading-snug text-foreground">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Leggi l’articolo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
          {active && (
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                <img src={active.cover} alt={active.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <DialogHeader>
                  <Badge variant="secondary" className="w-fit rounded-full">{active.category}</Badge>
                  <DialogTitle className="mt-3 font-serif text-2xl md:text-3xl leading-tight">{active.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {String(active.content || '').split('\n\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
