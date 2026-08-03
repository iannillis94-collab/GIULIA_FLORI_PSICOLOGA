const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://salvia-psicologia.preview.emergentagent.com'

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
