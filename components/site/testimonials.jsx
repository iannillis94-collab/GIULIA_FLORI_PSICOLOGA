'use client'

import { Star, Quote } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Reveal, SectionHeading } from './reveal'
import { TESTIMONIALS } from './data'

export function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonianze"
          title="Storie di chi ha ritrovato equilibrio"
          subtitle="Recensioni a scopo dimostrativo, che raccontano lo spirito dei percorsi."
        />

        <Reveal>
          <div className="mt-14 mx-auto max-w-5xl px-2">
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {TESTIMONIALS.map((t, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="flex h-full flex-col rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                      <Quote className="h-8 w-8 text-primary/30" />
                      <div className="mt-3 flex gap-0.5">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="h-4 w-4 fill-current text-[#D9B24C]" />
                        ))}
                      </div>
                      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/85">“{t.text}”</p>
                      <div className="mt-5 border-t border-border/60 pt-4">
                        <p className="font-serif text-base text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.topic}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex justify-center gap-3">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
            <p className="mt-6 text-center text-xs text-muted-foreground/70">
              * Le testimonianze mostrate sono simulate a scopo puramente dimostrativo.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
