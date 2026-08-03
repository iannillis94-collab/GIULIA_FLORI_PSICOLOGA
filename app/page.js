import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { Values } from '@/components/site/values'
import { Help } from '@/components/site/help'
import { About } from '@/components/site/about'
import { Services } from '@/components/site/services'
import { Booking } from '@/components/site/booking'
import { Blog } from '@/components/site/blog'
import { Faq } from '@/components/site/faq'
import { Testimonials } from '@/components/site/testimonials'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
import { Floating } from '@/components/site/floating'

export default function App() {
  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero />
      <Values />
      <Help />
      <About />
      <Services />
      <Booking />
      <Testimonials />
      <Blog />
      <Faq />
      <Contact />
      <Footer />
      <Floating />
    </main>
  )
}
