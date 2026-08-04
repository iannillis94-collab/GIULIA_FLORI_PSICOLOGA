'use client'

import { useState } from 'react'
import { Mail, Phone, MessageCircle, Instagram, Linkedin, MapPin, Clock, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Reveal, SectionHeading } from './reveal'
import { CONTACT } from './data'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', consent: false, website: '' })
  const [submitting, setSubmitting] = useState(false)
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Compila nome, email e messaggio'); return }
    if (!form.consent) { toast.error('Devi accettare il trattamento dei dati'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Errore'); return }
      toast.success('Messaggio inviato! Ti risponderò al più presto.')
      setForm({ name: '', email: '', phone: '', message: '', consent: false, website: '' })
    } catch { toast.error('Errore di connessione') } finally { setSubmitting(false) }
  }

  const items = [
    { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.phoneDisplay, href: `https://wa.me/${CONTACT.whatsapp}` },
    { icon: Phone, label: 'Telefono', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.whatsapp}` },
    { icon: MapPin, label: 'Studio', value: CONTACT.addressPlaceholder, href: '#' },
  ]

  return (
    <section id="contatti" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionHeading
          eyebrow="Contatti"
          title="Facciamo un primo passo insieme"
          subtitle="Scrivimi per qualsiasi domanda o per prenotare un colloquio. Sarò felice di ascoltarti."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Info */}
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((it) => {
                const Icon = it.icon
                return (
                  <a
                    key={it.label}
                    href={it.href}
                    target={it.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{it.label}</p>
                      <p className="truncate text-sm font-medium text-foreground">{it.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground"><Clock className="h-4 w-4 text-primary" /> Orari</p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex justify-between gap-4"><span>Lunedì – Venerdì</span><span className="text-foreground/80">9:00 – 18:00 · su appuntamento</span></p>
                <p className="flex justify-between gap-4"><span>Sabato</span><span className="text-foreground/80">9:00 – 16:00 · su appuntamento</span></p>
                <p className="flex justify-between gap-4"><span>Domenica</span><span className="text-foreground/80">Chiuso</span></p>
              </div>
              <div className="mt-4 flex gap-3">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"><Instagram className="h-5 w-5" /></a>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"><Linkedin className="h-5 w-5" /></a>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 shadow-soft">
              <iframe
                title="Mappa"
                src="https://www.openstreetmap.org/export/embed.html?bbox=12.4%2C41.8%2C12.6%2C41.95&layer=mapnik"
                className="h-48 w-full grayscale-[0.2]"
                loading="lazy"
              />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-8">
              <p className="font-serif text-xl text-foreground">Scrivimi un messaggio</p>
              <div className="mt-5 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="c-name">Nome</Label>
                  <Input id="c-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Il tuo nome" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="c-email">Email</Label>
                    <Input id="c-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="nome@email.it" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-phone">Telefono</Label>
                    <Input id="c-phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Facoltativo" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-msg">Messaggio</Label>
                  <Textarea id="c-msg" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Come posso aiutarti?" />
                </div>
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} className="hidden" aria-hidden />
                <div className="flex items-start gap-2.5">
                  <Checkbox id="c-consent" checked={form.consent} onCheckedChange={(v) => update('consent', !!v)} className="mt-0.5" />
                  <Label htmlFor="c-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
                    Acconsento al trattamento dei miei dati personali secondo la Privacy Policy (GDPR).
                  </Label>
                </div>
                <Button type="submit" disabled={submitting} className="w-full rounded-full py-6 text-base">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Invio…</> : <>Invia messaggio <Send className="ml-1 h-4 w-4" /></>}
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
