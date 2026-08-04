'use client'

import { Star, ShieldCheck } from 'lucide-react'
import { Reveal, SectionHeading } from './reveal'
import { CONTACT } from './data'

export function Testimonials() {
  return (
    <section id="recensioni" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Recensioni Google"
          title="La voce di chi ha scelto un percorso"
          subtitle="Le recensioni pubblicate in questa sezione provengono esclusivamente dal mio profilo Google Business Profile e rappresentano l&rsquo;esperienza autentica delle persone che hanno scelto di intraprendere un percorso con me."
        />

        <Reveal>
          <div className="mt-14 mx-auto max-w-4xl">
            {/* Contenitore predisposto per il widget delle Recensioni Google.
                Nessuna recensione viene mostrata finché il widget non sarà collegato. */}
            <div
              id="google-reviews-widget"
              data-google-reviews-placeholder="true"
              className="relative overflow-hidden rounded-[2rem] border border-dashed border-border bg-card/60 p-10 text-center shadow-soft md:p-16"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                {/* Logo Google stilizzato */}
                <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3 0-5.6-2-6.5-4.8h-4v3.1A12 12 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.5 14.5a7.2 7.2 0 0 1 0-4.6V6.8h-4a12 12 0 0 0 0 10.8l4-3.1z" />
                  <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 12 0 12 12 0 0 0 1.5 6.8l4 3.1C6.4 6.8 9 4.8 12 4.8z" />
                </svg>
              </div>

              <div className="mt-5 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-[#D9B24C]" />
                ))}
              </div>

              <h3 className="mt-4 font-serif text-xl text-foreground md:text-2xl">Recensioni Google in arrivo</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Le recensioni verificate del profilo Google di Giulia Flori saranno mostrate qui a breve.
                Nel frattempo puoi visitare il profilo Google per leggere le esperienze autentiche.
              </p>

              <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Recensioni 100% autentiche &middot; solo da Google Business Profile
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
