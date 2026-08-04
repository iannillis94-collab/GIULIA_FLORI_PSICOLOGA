import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://salvia-psicologia.preview.emergentagent.com'
const OG_IMAGE = 'https://customer-assets-39nsmqrw.emergentagent.net/job_salvia-psicologia/artifacts/4qdkwnvr_WhatsApp%20Image%202026-08-03%20at%2017.30.31.jpeg'
const PORTRAIT_IMAGE = 'https://customer-assets-39nsmqrw.emergentagent.net/job_salvia-psicologia/artifacts/2da5ww12_WhatsApp%20Image%202026-08-03%20at%2017.30.31%20%281%29.jpeg'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dott.ssa Giulia Flori | Psicologa — Ansia, Stress, Burnout | Roma e Online',
    template: '%s | Dott.ssa Giulia Flori Psicologa',
  },
  description:
    'Dott.ssa Giulia Flori, Psicologa iscritta all\'Albo. Un percorso di sostegno psicologico per ansia, attacchi di panico, burnout, stress, depressione e trauma. Colloqui in studio e online. Prenota un primo colloquio.',
  keywords: [
    'psicologa', 'psicologo Roma', 'ansia', 'attacchi di panico', 'burnout',
    'stress lavoro correlato', 'depressione', 'trauma', 'PTSD', 'sostegno psicologico',
    'colloquio psicologico', 'Giulia Flori', 'psicologa online',
  ],
  authors: [{ name: 'Dott.ssa Giulia Flori' }],
  creator: 'Dott.ssa Giulia Flori',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: SITE_URL,
    siteName: 'Dott.ssa Giulia Flori — Psicologa',
    title: 'Dott.ssa Giulia Flori | Psicologa — Un luogo sicuro dove ritrovare equilibrio',
    description:
      'Sostegno psicologico con empatia e professionalità: ansia, panico, burnout, stress, depressione e trauma. Prenota un primo colloquio.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Dott.ssa Giulia Flori, Psicologa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dott.ssa Giulia Flori | Psicologa',
    description: 'Un luogo sicuro dove ritrovare equilibrio, comprensione e serenità.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport = {
  themeColor: '#F9F8F6',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Psychologist', 'LocalBusiness'],
  '@id': SITE_URL,
  name: 'Dott.ssa Giulia Flori — Psicologa',
  image: PORTRAIT_IMAGE,
  url: SITE_URL,
  email: 'giuliaflori@hotmail.it',
  description:
    'Psicologa iscritta all\'Albo. Sostegno psicologico per ansia, attacchi di panico, burnout, stress, depressione, trauma e PTSD. Colloqui in studio e online.',
  priceRange: '€€',
  areaServed: 'Italia',
  knowsLanguage: 'it',
  medicalSpecialty: 'Psychiatric',
  sameAs: [
    'https://www.instagram.com/psicologa.giuliaflori/',
    'https://linkedin.com/in/giulia-f-8189bb189',
    'https://ordinepsicologilazio.it/albo/giulia-flori',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
