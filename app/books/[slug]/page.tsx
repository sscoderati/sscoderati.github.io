import { MDXContent } from '@/components/mdx-content'
import { getBookBySlug, getBooks } from '@/lib/books'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type BookDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getBooks().map((book) => ({
    slug: book.slug,
  }))
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const book = getBookBySlug(slug)

  if (!book) {
    return {
      title: 'Books',
      description: '책 서평 페이지를 찾을 수 없습니다.',
    }
  }

  return {
    title: book.title,
    description: book.summary,
    alternates: {
      canonical: `/books/${book.slug}`,
    },
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params
  const book = getBookBySlug(slug)

  if (!book) {
    notFound()
  }

  return (
    <main className="mt-24 pb-20">
      <div className="mb-2">
        <Link
          href="/books"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {'<'} Books
        </Link>
      </div>
      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-xl font-semibold">{book.title}</h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          {book.author} · {book.readDate}
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {book.summary}
        </p>
      </header>
      <article className="prose prose-gray prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-100 prose-pre:text-zinc-800 dark:prose-invert dark:prose-pre:border-zinc-800 dark:prose-pre:bg-zinc-900 dark:prose-pre:text-zinc-100 prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium">
        <MDXContent code={book.body} />
      </article>
    </main>
  )
}
