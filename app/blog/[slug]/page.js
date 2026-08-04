'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock, CalendarDays, HeartHandshake, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function fmt(d) {
  try { return format(parseISO(d), 'd MMMM yyyy', { locale: it }) } catch { return d || '' }
}

function Inline({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

function Article({ content }) {
  const lines = String(content || '').split('\n')
  const blocks = []
  let para = []
  const flush = () => { if (para.length) { blocks.push({ t: 'p', v: para.join(' ') }); para = [] } }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flush(); continue }
    const img = line.match(/^!\[(.*?)\]\((.*?)\)$/)
    if (img) { flush(); blocks.push({ t: 'img', alt: img[1], src: img[2] }); continue }
    if (line.startsWith('### ')) { flush(); blocks.push({ t: 'h3', v: line.slice(4) }); continue }
    if (line.startsWith('## ')) { flush(); blocks.push({ t: 'h2', v: line.slice(3) }); continue }
    if (line.startsWith('# ')) { flush(); blocks.push({ t: 'h2', v: line.slice(2) }); continue }
    para.push(line)
  }
  flush()
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (b.t === 'h2') return <h2 key={i} className="mt-10 font-serif text-2xl md:text-3xl text-foreground">{b.v}</h2>
        if (b.t === 'h3') return <h3 key={i} className="mt-8 font-serif text-xl md:text-2xl text-foreground">{b.v}</h3>
        if (b.t === 'img') return <img key={i} src={b.src} alt={b.alt} className="my-6 w-full rounded-2xl object-cover shadow-soft" loading="lazy" />
        return <p key={i} className="text-[1.05rem] leading-relaxed text-muted-foreground"><Inline text={b.v} /></p>
      })}
    </div>
  )
}

export default function BlogArticle() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blog/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setPost(d); setStatus('ok'); if (d?.title) document.title = `${d.title} | Dott.ssa Giulia Flori` })
      .catch(() => setStatus('notfound'))
  }, [slug])

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 glass-strong">
        <div className="container flex items-center justify-between py-3">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><HeartHandshake className="h-5 w-5" /></span>
            <span className="leading-tight">
              <span className="block font-serif text-base text-foreground">Giulia Flori</span>
              <span className="block text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">Psicologa iscritta all&rsquo;Albo del Lazio</span>
            </span>
          </a>
          <Button asChild variant="outline" size="sm" className="rounded-full"><a href="/#blog"><ArrowLeft className="mr-1.5 h-4 w-4" /> Torna al Blog</a></Button>
        </div>
      </header>

      {status === 'loading' && (
        <div className="container flex items-center justify-center py-40 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carico l&rsquo;articolo&hellip;</div>
      )}

      {status === 'notfound' && (
        <div className="container flex flex-col items-center py-40 text-center">
          <h1 className="font-serif text-3xl text-foreground">Articolo non trovato</h1>
          <p className="mt-3 text-muted-foreground">L&rsquo;articolo che cerchi non esiste o non &egrave; pi&ugrave; disponibile.</p>
          <Button asChild className="mt-8 rounded-full"><a href="/#blog">Torna al Blog</a></Button>
        </div>
      )}

      {status === 'ok' && post && (
        <>
          <article className="container max-w-3xl py-12 md:py-16">
            <Badge variant="secondary" className="rounded-full">{post.category}</Badge>
            <h1 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-foreground text-balance">{post.title}</h1>
            {post.subtitle && <p className="mt-4 text-lg md:text-xl leading-relaxed text-muted-foreground">{post.subtitle}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.date && <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {fmt(post.date)}</span>}
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readingTime} min di lettura</span>
            </div>
            <img src={post.cover} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-[1.5rem] object-cover shadow-lift" />
            <div className="mt-10"><Article content={post.content} /></div>

            <div className="mt-14 flex justify-center border-t border-border/60 pt-10">
              <Button asChild variant="outline" className="rounded-full"><a href="/#blog"><ArrowLeft className="mr-1.5 h-4 w-4" /> Torna al Blog</a></Button>
            </div>
          </article>

          <section className="border-t border-border/60 bg-secondary/30 py-14">
            <div className="container max-w-3xl text-center">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground">Vuoi parlarne insieme?</h2>
              <p className="mt-3 text-muted-foreground">Se senti che &egrave; il momento di prenderti cura di te, richiedi un primo colloquio.</p>
              <Button asChild className="mt-6 rounded-full px-7"><a href="/#prenota">Richiedi un primo colloquio</a></Button>
            </div>
          </section>
        </>
      )}

      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Dott.ssa Giulia Flori &middot; Psicologa</p>
          <div className="flex gap-4">
            <a href="/#chi-sono" className="hover:text-primary">Chi sono</a>
            <a href="/#servizi" className="hover:text-primary">Servizi</a>
            <a href="/#contatti" className="hover:text-primary">Contatti</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
