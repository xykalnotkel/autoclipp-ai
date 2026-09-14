import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://autoclipp-ai.vercel.app'
  const lastModified = new Date()

  const locales = ['id', 'en']
  const pages = ['', '/editor', '/projects', '/subscription', '/terms', '/privacy', '/legal', '/docs', '/faq']

  const entries: MetadataRoute.Sitemap = []

  // Root redirect
  entries.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily',
    priority: 1,
  })

  // Locale pages
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified,
        changeFrequency: page === '' ? 'daily' : page.includes('editor') ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/editor' ? 0.9 : page === '/subscription' ? 0.8 : 0.5,
        alternates: {
          languages: {
            id: `${baseUrl}/id${page}`,
            en: `${baseUrl}/en${page}`,
          }
        }
      })
    }
  }

  // Admin (noindex but include for completeness)
  entries.push({
    url: `${baseUrl}/admin/login`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.1,
  })

  return entries
}
