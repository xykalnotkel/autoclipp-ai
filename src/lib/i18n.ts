export const locales = ['id', 'en'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'id'

export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  
  const lower = acceptLanguage.toLowerCase()
  if (lower.includes('id') || lower.includes('indonesia')) return 'id'
  if (lower.includes('en')) return 'en'
  
  return defaultLocale
}

export function getLocaleFromCountry(country: string | null): Locale {
  if (!country) return defaultLocale
  if (country.toUpperCase() === 'ID') return 'id'
  return 'en'
}

export async function getMessages(locale: Locale) {
  try {
    const messages = await import(`@/messages/${locale}.json`)
    return messages.default
  } catch {
    const fallback = await import(`@/messages/${defaultLocale}.json`)
    return fallback.default
  }
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
