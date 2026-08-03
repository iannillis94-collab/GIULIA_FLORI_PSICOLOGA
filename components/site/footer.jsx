'use client'

import { HeartHandshake, Instagram, Linkedin, Mail, MessageCircle, BadgeCheck } from 'lucide-react'
import { NAV_LINKS, CONTACT } from './data'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><HeartHandshake className="h-5 w-5" /></span>
              <span className="leading-tight">
                <span className="block font-serif text-lg text-foreground">Dott.ssa Giulia Flori</span>
                <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Psicologa · iscritta all’Albo del Lazio</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Un luogo sicuro dove ritrovare equilibrio, comprensione e serenità. Percorsi di sostegno
              psicologico in studio e online, con empatia e professionalità.
            </p>
            <a href={CONTACT.albo} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
              <BadgeCheck className="h-4 w-4" /> Verifica iscrizione all’Albo
            </a>
          </div>

          <div>
            <p className="font-serif text-base text-foreground">Naviga</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-serif text-base text-foreground">Contatti</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" /> {CONTACT.email}</a></li>
              <li><a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><MessageCircle className="h-4 w-4" /> {CONTACT.phoneDisplay}</a></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"><Instagram className="h-4.5 w-4.5" /></a>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"><Linkedin className="h-4.5 w-4.5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Dott.ssa Giulia Flori · P.IVA _____ · Tutti i diritti riservati</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#privacy" className="hover:text-primary">Privacy Policy</a>
            <a href="#cookie" className="hover:text-primary">Cookie Policy</a>
            <span>Design premium · realizzato con cura</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
