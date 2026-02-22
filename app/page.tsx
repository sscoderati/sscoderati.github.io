import { getBlogPosts } from '@/lib/blog-posts'
import HomeClient from '../components/widget/home-client'

export default async function HomePage() {
  const blogPosts = await getBlogPosts()

  return <HomeClient blogPosts={blogPosts} />
}
