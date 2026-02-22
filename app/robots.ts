import { WEBSITE_URL } from '@/lib/common'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${WEBSITE_URL}/sitemap.xml`,
  }
}
