'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Leaf, Lock, Loader2, LogOut, Trash2, CalendarDays, Clock3, Settings2,
  FileText, Inbox, Plus, Pencil, Check, X, Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const DAYS = [
  { k: '1', label: 'Luned\u00ec' }, { k: '2', label: 'Marted\u00ec' }, { k: '3', label: 'Mercoled\u00ec' },
  { k: '4', label: 'Gioved\u00ec' }, { k: '5', label: 'Venerd\u00ec' }, { k: '6', label: 'Sabato' }, { k: '0', label: 'Domenica' },
]

const STATUS_MAP = {
  pending: { label: 'In attesa', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed: { label: 'Confermato', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Annullato', className: 'bg-red-100 text-red-700 border-red-200' },
}

const EMPTY_POST = { title: '', category: 'Psicologia', excerpt: '', cover: '', readingTime: 4, content: '', published: true }

export default function Admin() {
  const [token, setToken] = useState(null)
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('admin-token')
    if (t) setToken(t)
  }, [])

  const login = async (e) => {
    e.preventDefault()
    setLoggingIn(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Password errata'); return }
      localStorage.setItem('admin-token', data.token)
      setToken(data.token)
      toast.success('Benvenuta, Giulia!')
    } catch { toast.error('Errore di connessione') } finally { setLoggingIn(false) }
  }

  const logout = () => { localStorage.removeItem('admin-token'); setToken(null) }

  if (!token) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary/30 px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-8 shadow-lift">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Leaf className="h-5 w-5" /></span>
            <div>
              <p className="font-serif text-lg text-foreground">Area Riservata</p>
              <p className="text-xs text-muted-foreground">Dott.ssa Giulia Flori</p>
            </div>
          </div>
          <div className="mt-6 grid gap-2">
            <Label htmlFor="pw">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" />
            </div>
          </div>
          <Button type="submit" disabled={loggingIn} className="mt-6 w-full rounded-full">
            {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accedi'}
          </Button>
        </form>
      </div>
    )
  }

  return <Dashboard token={token} onLogout={logout} />
}

function Dashboard({ token, onLogout }) {
  const api = useCallback(async (path, opts = {}) => {
    const res = await fetch(`/api${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers || {}) },
    })
    return res
  }, [token])

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-20 border-b border-border/60 glass-strong">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Leaf className="h-4.5 w-4.5" /></span>
            <div>
              <p className="font-serif text-base leading-tight text-foreground">Dashboard</p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Giulia Flori</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">Vai al sito</a>
            <Button variant="outline" size="sm" onClick={onLogout} className="rounded-full"><LogOut className="mr-1 h-4 w-4" /> Esci</Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="appointments"><CalendarDays className="mr-1.5 h-4 w-4" /> Appuntamenti</TabsTrigger>
            <TabsTrigger value="availability"><Settings2 className="mr-1.5 h-4 w-4" /> Disponibilit\u00e0</TabsTrigger>
            <TabsTrigger value="blog"><FileText className="mr-1.5 h-4 w-4" /> Blog</TabsTrigger>
            <TabsTrigger value="messages"><Inbox className="mr-1.5 h-4 w-4" /> Messaggi</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments"><Appointments api={api} /></TabsContent>
          <TabsContent value="availability"><Availability api={api} /></TabsContent>
          <TabsContent value="blog"><BlogAdmin api={api} /></TabsContent>
          <TabsContent value="messages"><Messages api={api} /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Appointments({ api }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    api('/appointments').then((r) => r.json()).then((d) => Array.isArray(d) && setItems(d)).finally(() => setLoading(false))
  }, [api])
  useEffect(() => { load() }, [load])

  const setStatus = async (id, status) => {
    await api(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })
    toast.success('Stato aggiornato'); load()
  }
  const del = async (id) => {
    await api(`/appointments/${id}`, { method: 'DELETE' })
    toast.success('Appuntamento eliminato'); load()
  }

  if (loading) return <Loading />
  if (!items.length) return <Empty text="Nessun appuntamento al momento." />

  return (
    <div className="space-y-3">
      {items.map((a) => (
        <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-soft md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-serif text-lg text-foreground">{a.name}</p>
              <Badge variant="outline" className={STATUS_MAP[a.status]?.className}>{STATUS_MAP[a.status]?.label || a.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              <CalendarDays className="mr-1 inline h-3.5 w-3.5" />{a.date} \u00b7 <Clock3 className="mr-1 inline h-3.5 w-3.5" />{a.time} \u00b7 {a.service} \u00b7 {a.modality}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.email}{a.phone ? ` \u00b7 ${a.phone}` : ''}</p>
            {a.message && <p className="mt-1 text-xs italic text-muted-foreground">\u201c{a.message}\u201d</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Select value={a.status} onValueChange={(v) => setStatus(a.id, v)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">In attesa</SelectItem>
                <SelectItem value="confirmed">Conferma</SelectItem>
                <SelectItem value="cancelled">Annulla</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => del(a.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Availability({ api }) {
  const [days, setDays] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api('/availability').then((r) => r.json()).then((d) => setDays(d?.days || {}))
  }, [api])

  const toggle = (k, enabled) => setDays((d) => ({ ...d, [k]: { ...(d[k] || { slots: [] }), enabled } }))
  const setSlots = (k, text) => {
    const slots = text.split(',').map((s) => s.trim()).filter(Boolean)
    setDays((d) => ({ ...d, [k]: { ...(d[k] || { enabled: true }), slots } }))
  }

  const save = async () => {
    setSaving(true)
    await api('/availability', { method: 'PUT', body: JSON.stringify({ days }) })
    toast.success('Disponibilit\u00e0 salvata'); setSaving(false)
  }

  if (!days) return <Loading />

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft md:p-7">
      <p className="font-serif text-lg text-foreground">Giorni e orari disponibili</p>
      <p className="mt-1 text-sm text-muted-foreground">Attiva i giorni e inserisci gli orari separati da virgola (es. 09:00, 10:00, 15:00).</p>
      <div className="mt-6 space-y-4">
        {DAYS.map(({ k, label }) => {
          const cfg = days[k] || { enabled: false, slots: [] }
          return (
            <div key={k} className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center">
              <div className="flex w-40 items-center gap-3">
                <Switch checked={!!cfg.enabled} onCheckedChange={(v) => toggle(k, v)} />
                <span className="font-medium text-foreground">{label}</span>
              </div>
              <Input
                disabled={!cfg.enabled}
                defaultValue={(cfg.slots || []).join(', ')}
                onBlur={(e) => setSlots(k, e.target.value)}
                placeholder="09:00, 10:00, 11:00"
                className="flex-1"
              />
            </div>
          )
        })}
      </div>
      <Button onClick={save} disabled={saving} className="mt-6 rounded-full">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Salva disponibilit\u00e0
      </Button>
    </div>
  )
}

function BlogAdmin({ api }) {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null) // null | 'new' | post
  const [form, setForm] = useState(EMPTY_POST)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    api('/blog?all=true').then((r) => r.json()).then((d) => Array.isArray(d) && setPosts(d))
  }, [api])
  useEffect(() => { load() }, [load])

  const startNew = () => { setForm(EMPTY_POST); setEditing('new') }
  const startEdit = (p) => { setForm({ ...p }); setEditing(p) }
  const cancel = () => { setEditing(null); setForm(EMPTY_POST) }
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title) { toast.error('Titolo obbligatorio'); return }
    setSaving(true)
    if (editing === 'new') {
      await api('/blog', { method: 'POST', body: JSON.stringify(form) })
    } else {
      await api(`/blog/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
    }
    toast.success('Articolo salvato'); setSaving(false); cancel(); load()
  }
  const del = async (id) => { await api(`/blog/${id}`, { method: 'DELETE' }); toast.success('Articolo eliminato'); load() }
  const togglePub = async (p) => { await api(`/blog/${p.id}`, { method: 'PUT', body: JSON.stringify({ published: !p.published }) }); load() }

  if (editing) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft md:p-7">
        <div className="flex items-center justify-between">
          <p className="font-serif text-lg text-foreground">{editing === 'new' ? 'Nuovo articolo' : 'Modifica articolo'}</p>
          <Button variant="ghost" size="sm" onClick={cancel}><X className="mr-1 h-4 w-4" /> Annulla</Button>
        </div>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-2"><Label>Titolo</Label><Input value={form.title} onChange={(e) => update('title', e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => update('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Ansia', 'Stress', 'Burnout', 'Trauma', 'Psicologia', 'Benessere'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Tempo di lettura (min)</Label><Input type="number" value={form.readingTime} onChange={(e) => update('readingTime', Number(e.target.value))} /></div>
          </div>
          <div className="grid gap-2"><Label>Immagine di copertina (URL)</Label><Input value={form.cover} onChange={(e) => update('cover', e.target.value)} placeholder="https://\u2026" /></div>
          <div className="grid gap-2"><Label>Estratto</Label><Textarea rows={2} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} /></div>
          <div className="grid gap-2"><Label>Contenuto (paragrafi separati da riga vuota)</Label><Textarea rows={10} value={form.content} onChange={(e) => update('content', e.target.value)} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={(v) => update('published', v)} /><Label>Pubblicato</Label></div>
          <Button onClick={save} disabled={saving} className="w-fit rounded-full">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Salva articolo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex justify-end"><Button onClick={startNew} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> Nuovo articolo</Button></div>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
            <img src={p.cover} alt="" className="hidden h-14 w-20 shrink-0 rounded-lg object-cover sm:block" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-serif text-base text-foreground">{p.title}</p>
                {!p.published && <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Bozza</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{p.category} \u00b7 {p.readingTime} min</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => togglePub(p)} title="Pubblica/Bozza">{p.published ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-amber-600" />}</Button>
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => del(p.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Messages({ api }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api('/contact').then((r) => r.json()).then((d) => Array.isArray(d) && setItems(d)).finally(() => setLoading(false))
  }, [api])

  if (loading) return <Loading />
  if (!items.length) return <Empty text="Nessun messaggio ricevuto." />
  return (
    <div className="space-y-3">
      {items.map((m) => (
        <div key={m.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg text-foreground">{m.name}</p>
            <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">{m.email}</a>
          </div>
          {m.phone && <p className="text-xs text-muted-foreground">{m.phone}</p>}
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">{m.message}</p>
        </div>
      ))}
    </div>
  )
}

const Loading = () => (
  <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carico\u2026</div>
)
const Empty = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">{text}</div>
)
