import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from './data'
import { WEBSITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${WEBSITE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${WEBSITE_URL}/blog/`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${WEBSITE_URL}${post.link}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...routes, ...posts]
}
