import HomeClient from '@/components/widget/home-client'
import { getBlogPosts } from '@/lib/blog-posts'
import { getLogSeries } from '@/lib/log-posts'

export default async function HomePage() {
  const blogPosts = await getBlogPosts()
  const logCategories = await getLogSeries()

  return <HomeClient blogPosts={blogPosts} logCategories={logCategories} />
}
