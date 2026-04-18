import { WEBSITE_URL } from '@/constants/common'
import { getPublishedBlogPosts, normalizeBlogSlug } from '@/lib/blog'
import { getBooks } from '@/lib/books'
import { getWikiPosts } from '@/lib/wiki-posts'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${WEBSITE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${WEBSITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${WEBSITE_URL}/books`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${WEBSITE_URL}/wiki`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const blogPosts = getPublishedBlogPosts()

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${WEBSITE_URL}/blog/${normalizeBlogSlug(post.slug)}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const bookEntries: MetadataRoute.Sitemap = getBooks().map((book) => ({
    url: `${WEBSITE_URL}/books/${book.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const wikiEntries: MetadataRoute.Sitemap = getWikiPosts().map((post) => ({
    url: `${WEBSITE_URL}/wiki/${post.slugAsParams}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...routes, ...posts, ...bookEntries, ...wikiEntries]
}
