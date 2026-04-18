import HomeClient from '@/components/widget/home-client'
import { getSortedBlogListItems } from '@/lib/blog'
import { books, wiki } from '#site/content'

export default function HomePage() {
  const blogPosts = getSortedBlogListItems()
  const recentBooks = books.slice(0, 3).map((book) => ({
    slug: book.slug,
    title: book.title,
    author: book.author,
    readDate: book.readDate,
  }))

  const recentWikiPosts = [...wiki]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)
    .map((post) => ({
      slug: post.slug.replace(/^wiki\//, ''),
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
