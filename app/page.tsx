import HomeClient from '@/components/widget/home-client'
import { getSortedBlogListItems } from '@/lib/blog'

export default function HomePage() {
  const blogPosts = getSortedBlogListItems()

  return <HomeClient blogPosts={blogPosts} />
}
