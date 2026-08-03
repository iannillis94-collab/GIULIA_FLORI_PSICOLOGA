'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTACT } from './data'

export function Floating() {
  const [showCookie, setShowCookie] = useState(false)

  useEffect(() => {
    const ok = localStorage.getItem('cookie-consent')
    if (!ok) setShowCookie(true)
  }, [])

  const accept = () => { localStorage.setItem('cookie-consent', 'accepted'); setShowCookie(false) }
  const reject = () => { localStorage.setItem('cookie-consent', 'essential'); setShowCookie(false) }

  return (
    <>
      {/* WhatsApp floating */}
      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scrivimi su WhatsApp"
        className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-4 text-white shadow-lift transition-all hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-[120px] sm:inline">Scrivimi ora</span>
      </a>

      {/* Cookie banner */}
      {showCookie && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl glass-strong border border-border/60 p-5 shadow-lift md:left-6 md:right-auto">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Cookie className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Rispettiamo la tua privacy</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Utilizziamo cookie tecnici per garantire il funzionamento del sito e, con il tuo consenso, cookie per migliorare l’esperienza. Consulta la Cookie Policy.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={accept} className="rounded-full">Accetta tutti</Button>
                <Button size="sm" variant="outline" onClick={reject} className="rounded-full">Solo essenziali</Button>
              </div>
            </div>
            <button onClick={reject} aria-label="Chiudi" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </>
  )
}
