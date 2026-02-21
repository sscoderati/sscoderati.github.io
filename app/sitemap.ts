import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { getBlogPosts } from '@/lib/blog-posts'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const blogPosts = await getBlogPosts()

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${WEBSITE_URL}${post.link}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...routes, ...posts]
}
