import HomeClient from '@/components/widget/home-client'
import { blog } from '#site/content'
import { getLogSeries } from '@/lib/log-posts'

export default async function HomePage() {
  const blogPosts = blog
    .filter((post) => !post.draft)
    .sort(
      (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    )
    .map((post) => ({
      title: post.title,
      description: post.description ?? '',
      date: post.date ?? '',
      link: `/blog/${post.slug.replace(/^blog\//, '')}`,
    }))
  const logCategories = await getLogSeries()

  return <HomeClient blogPosts={blogPosts} logCategories={logCategories} />
}
