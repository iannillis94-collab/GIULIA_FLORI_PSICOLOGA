'use client'

import { useEffect, useState } from 'react'
import { Clock, ArrowRight, CalendarDays, BookOpen } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Reveal, SectionHeading } from './reveal'

function formatDate(d) {
  try {
    return format(parseISO(d), 'd MMMM yyyy', { locale: it })
  } catch {
    return d || ''
  }
}

export function Blog() {
  const [posts, setPosts] = useState([])
  const [cat, setCat] = useState('Tutti')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPosts(d))
      .catch(() => {})
      .finally(() => setLoading(false))
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

        {posts.length > 0 && (
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
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <Reveal>
            <div className="mt-12 mx-auto max-w-xl rounded-[2rem] border border-dashed border-border bg-card/60 p-12 text-center shadow-soft">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-xl text-foreground">Presto nuovi articoli</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Sto preparando contenuti dedicati al benessere psicologico. Torna presto per leggere i primi articoli.
              </p>
            </div>
          </Reveal>
        )}

        {/* Preview grid */}
        {filtered.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <a
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <Badge className="absolute left-4 top-4 rounded-full bg-white/90 text-foreground hover:bg-white">{p.category}</Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {p.date && <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(p.date)}</span>}
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {p.readingTime} min</span>
                    </div>
                    <h3 className="mt-3 font-serif text-xl leading-snug text-foreground">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.subtitle || p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Leggi l&rsquo;articolo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
