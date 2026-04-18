import HomeClient from '@/components/widget/home-client'
import { getSortedBlogListItems } from '@/lib/blog'
import { getLogSeries } from '@/lib/log-posts'

export default async function HomePage() {
  const blogPosts = getSortedBlogListItems()
  const logCategories = await getLogSeries()

  return <HomeClient blogPosts={blogPosts} logCategories={logCategories} />
}
