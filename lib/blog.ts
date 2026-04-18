import { blog, type Blog } from '#site/content'

export type BlogListItem = {
  title: string
  description: string
  date: string
  link: string
}

export function normalizeBlogSlug(slug: string) {
  return slug.replace(/^blog\//, '')
}

export function getPublishedBlogPosts() {
  return blog.filter((post) => !post.draft)
}

export function getSortedBlogListItems(): BlogListItem[] {
  const publishedPosts = [...getPublishedBlogPosts()]
  publishedPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return publishedPosts.map((post) => ({
    title: post.title,
    description: post.description ?? '',
    date: post.date,
    link: `/blog/${normalizeBlogSlug(post.slug)}`,
  }))
}

export function findPublishedBlogPostBySlug(slug: string): Blog | undefined {
  return getPublishedBlogPosts().find(
    (post) => normalizeBlogSlug(post.slug) === slug,
  )
}
