'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Reveal, SectionHeading } from './reveal'
import { FAQS } from './data'

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionHeading
          eyebrow="Domande frequenti"
          title="Le risposte alle domande più comuni"
          subtitle="Se hai altri dubbi, sarò felice di risponderti personalmente."
        />
        <Reveal>
          <div className="mt-12 mx-auto max-w-3xl rounded-3xl border border-border/60 bg-card px-6 shadow-soft md:px-8">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
                  <AccordionTrigger className="text-left font-serif text-lg hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
