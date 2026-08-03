const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://salvia-psicologia.preview.emergentagent.com'

export default function sitemap() {
  const now = new Date()
  const sections = ['', '#chi-sono', '#servizi', '#prenota', '#blog', '#faq', '#contatti']
  return sections.map((s) => ({
    url: `${SITE_URL}/${s}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: s === '' ? 1 : 0.7,
  }))
}
