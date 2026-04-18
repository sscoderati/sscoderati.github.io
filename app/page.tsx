import HomeClient from '@/components/widget/home-client'
import { getSortedBlogListItems } from '@/lib/blog'
import { getBooks } from '@/lib/books'
import { getWikiPosts } from '@/lib/wiki-posts'

export default function HomePage() {
  const blogPosts = getSortedBlogListItems()
  const recentBooks = getBooks()
    .slice(0, 3)
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      author: book.author,
      readDate: book.readDate,
    }))

  const recentWikiPosts = getWikiPosts()
    .slice(0, 5)
    .map((post) => ({
      slug: post.slugAsParams,
      title: post.title,
      updatedAt: post.updatedAt,
    }))

  return (
    <HomeClient
      blogPosts={blogPosts}
      recentBooks={recentBooks}
      recentWikiPosts={recentWikiPosts}
    />
  )
}
