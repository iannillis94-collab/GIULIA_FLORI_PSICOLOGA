'use client'

import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarCheck, Clock, Loader2, CheckCircle2, MapPin, Video, ArrowRight, Check, Send,
} from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Reveal, SectionHeading } from './reveal'
import { SERVICES } from './data'

export function Booking() {
  const [availability, setAvailability] = useState(null)
  const [date, setDate] = useState(null)
  const [booked, setBooked] = useState([])
  const [time, setTime] = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: SERVICES[0].title,
    modality: 'Online', message: '', consent: false, website: '',
  })

  useEffect(() => {
    fetch('/api/availability')
      .then((r) => r.json())
      .then((d) => setAvailability(d?.days || null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!date) return
    setTime(null)
    setLoadingSlots(true)
    const ds = format(date, 'yyyy-MM-dd')
    fetch(`/api/appointments/booked?date=${ds}`)
      .then((r) => r.json())
      .then((d) => setBooked(d?.booked || []))
      .catch(() => setBooked([]))
      .finally(() => setLoadingSlots(false))
  }, [date])

  const isDayDisabled = (d) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (d < today) return true
    if (!availability) return false
    const cfg = availability[String(d.getDay())]
    return !cfg || !cfg.enabled || (cfg.slots || []).length === 0
  }

  const slots = useMemo(() => {
    if (!date || !availability) return []
    const cfg = availability[String(date.getDay())]
    if (!cfg) return []
    return (cfg.slots || []).map((s) => ({ time: s, taken: booked.includes(s) }))
  }, [date, availability, booked])

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!date || !time) { toast.error('Scegli data e orario'); return }
    if (!form.name || !form.email) { toast.error('Inserisci nome ed email'); return }
    if (!form.consent) { toast.error('Devi accettare il trattamento dei dati'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: format(date, 'yyyy-MM-dd'), time }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Errore durante l\u2019invio della richiesta'); return }
      setDone({ ...form, date: format(date, 'EEEE d MMMM yyyy', { locale: it }), time })
      toast.success('Grazie! La tua richiesta \u00e8 stata inviata con successo. Ti ricontatter\u00f2 al pi\u00f9 presto.')
    } catch (e) {
      toast.error('Si \u00e8 verificato un errore durante l\u2019invio. Riprova, oppure scrivimi via email o WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setDone(null); setDate(null); setTime(null)
    setForm({ name: '', email: '', phone: '', service: SERVICES[0].title, modality: 'In studio', message: '', consent: false, website: '' })
  }

  return (
    <section id="prenota" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionHeading
          eyebrow="Richiesta colloquio"
          title="Richiedi un primo colloquio"
          subtitle="Compila il modulo sottostante per inviare una richiesta di appuntamento. Ti ricontatterò personalmente nel più breve tempo possibile per concordare insieme data, orario e modalità del colloquio."
        />

        <Reveal>
          <div className="mt-14 mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-lift">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center px-8 py-16 text-center"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl md:text-3xl text-foreground">Richiesta ricevuta, {done.name.split(' ')[0]}!</h3>
                  <p className="mt-3 max-w-md text-muted-foreground">
                    Ho registrato la tua richiesta per <span className="font-medium text-foreground">{done.service}</span> ({done.modality.toLowerCase()}):
                  </p>
                  <div className="mt-4 inline-flex flex-col items-center gap-1 rounded-2xl bg-secondary/60 px-6 py-4">
                    <span className="flex items-center gap-2 font-serif text-lg capitalize text-foreground">
                      <CalendarCheck className="h-5 w-5 text-primary" /> {done.date}
                    </span>
                    <span className="flex items-center gap-2 text-foreground/80">
                      <Clock className="h-4 w-4 text-primary" /> ore {done.time}
                    </span>
                  </div>
                  <p className="mt-5 max-w-md text-sm text-muted-foreground">
                    Ti contatterò all’indirizzo <span className="text-foreground">{done.email}</span> per confermare l’appuntamento. A presto.
                  </p>
                  <Button onClick={reset} variant="outline" className="mt-8 rounded-full">
                    Prenota un altro colloquio
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="form" className="grid lg:grid-cols-2">
                  {/* Left: calendar + slots */}
                  <div className="border-b border-border/60 p-6 md:p-8 lg:border-b-0 lg:border-r">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">1</span>
                      <p className="font-serif text-lg text-foreground">Scegli data e orario</p>
                    </div>
                    <div className="mt-4 flex justify-center rounded-2xl bg-background/60 p-2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={isDayDisabled}
                        locale={it}
                        weekStartsOn={1}
                        className="rounded-md"
                      />
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-medium text-foreground">Orari disponibili</p>
                      {!date && <p className="mt-2 text-sm text-muted-foreground">Seleziona prima un giorno dal calendario.</p>}
                      {date && loadingSlots && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> Carico gli orari…
                        </div>
                      )}
                      {date && !loadingSlots && slots.length === 0 && (
                        <p className="mt-2 text-sm text-muted-foreground">Nessun orario disponibile in questa data.</p>
                      )}
                      {date && !loadingSlots && slots.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slots.map((s) => (
                            <button
                              key={s.time}
                              disabled={s.taken}
                              onClick={() => setTime(s.time)}
                              className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                                s.taken
                                  ? 'cursor-not-allowed border-border/50 bg-muted text-muted-foreground/50 line-through'
                                  : time === s.time
                                  ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                                  : 'border-border bg-background hover:border-primary/50 hover:bg-secondary/50'
                              }`}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: form */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">2</span>
                      <p className="font-serif text-lg text-foreground">I tuoi dati</p>
                    </div>
                    <div className="mt-5 space-y-5">
                      <div className="grid gap-2">
                        <Label>Servizio</Label>
                        <Select value={form.service} onValueChange={(v) => update('service', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {SERVICES.map((s) => (
                              <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2.5">
                        <Label>Modalit&agrave; del colloquio</Label>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {/* Online - selezionabile */}
                          <button
                            type="button"
                            onClick={() => update('modality', 'Online')}
                            className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                              form.modality === 'Online'
                                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                                : 'border-border bg-background hover:border-primary/40'
                            }`}
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Video className="h-4.5 w-4.5" /></span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-foreground">Consulenza online</span>
                              <span className="block text-xs text-muted-foreground">In videochiamata, ovunque tu sia</span>
                            </span>
                            {form.modality === 'Online' && <Check className="h-4 w-4 shrink-0 text-primary" />}
                          </button>

                          {/* In presenza - disabilitata / non selezionabile */}
                          <div
                            aria-disabled="true"
                            title="Attualmente non disponibile"
                            className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3.5 text-left opacity-70"
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"><MapPin className="h-4.5 w-4.5" /></span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-muted-foreground">Consulenza in presenza</span>
                              <span className="mt-1 inline-block rounded-full bg-secondary/80 px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">Disponibile prossimamente</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="b-name">Nome e cognome</Label>
                        <Input id="b-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Il tuo nome" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="b-email">Email</Label>
                          <Input id="b-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="nome@email.it" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="b-phone">Telefono</Label>
                          <Input id="b-phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Facoltativo" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="b-msg">Messaggio</Label>
                        <Textarea id="b-msg" rows={2} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Se vuoi, raccontami brevemente come posso aiutarti (facoltativo)" />
                      </div>

                      {/* honeypot */}
                      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} className="hidden" aria-hidden />

                      <div className="flex items-start gap-2.5">
                        <Checkbox id="b-consent" checked={form.consent} onCheckedChange={(v) => update('consent', !!v)} className="mt-0.5" />
                        <Label htmlFor="b-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
                          Ho letto e accetto il trattamento dei dati personali secondo la Privacy Policy (GDPR).
                        </Label>
                      </div>

                      <Button onClick={submit} disabled={submitting} className="w-full rounded-full py-6 text-base shadow-soft">
                        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Invio in corso…</> : <>Invia richiesta <Send className="ml-1.5 h-4 w-4" /></>}
                      </Button>
                      <p className="text-center text-xs leading-relaxed text-muted-foreground">
                        Inviando il modulo invii una <span className="font-medium text-foreground">richiesta di contatto</span>: non &egrave; una prenotazione confermata. Ti ricontatter&ograve; personalmente per concordare i dettagli.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
