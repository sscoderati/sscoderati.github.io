import { WEBSITE_URL } from '@/constants/common'
import { getBlogPosts } from '@/lib/blog-posts'
import { getLogPosts } from '@/lib/log-posts'
import type { MetadataRoute } from 'next'

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
    {
      url: `${WEBSITE_URL}/logs/`,
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

  const logPosts = await getLogPosts()

  const logs: MetadataRoute.Sitemap = logPosts.map((post) => ({
    url: `${WEBSITE_URL}${post.link}/`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...routes, ...posts, ...logs]
}
