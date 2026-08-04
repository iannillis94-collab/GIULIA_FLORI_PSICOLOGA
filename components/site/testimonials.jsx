'use client'

import Script from 'next/script'
import { Reveal, SectionHeading } from './reveal'

export function Testimonials() {
  return (
    <section id="recensioni" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Recensioni Google"
          title="Le recensioni dei miei pazienti"
          subtitle="Le recensioni pubblicate in questa sezione provengono esclusivamente dal mio profilo Google Business Profile e rappresentano l&rsquo;esperienza autentica delle persone che hanno scelto di intraprendere un percorso con me."
        />

        <Reveal>
          <div className="mt-14 w-full">
            {/* Elfsight Google Reviews | Untitled Google Reviews */}
            <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
            <div
              className="elfsight-app-96ef2319-8904-45bf-8c7b-8c95face19fd mx-auto w-full min-h-[320px]"
              data-elfsight-app-lazy
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
