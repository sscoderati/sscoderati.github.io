import { AnimatedBackground } from '@/components/ui/animated-background'
import { getBooks } from '@/lib/books'
import Link from 'next/link'

export const metadata = {
  title: 'Books',
  description: '읽은 책과 서평을 기록한 목록입니다.',
  alternates: {
    canonical: '/books',
  },
}

export default function BooksPage() {
  const bookList = getBooks()

  return (
    <main className="mt-24 pb-20">
      <h1 className="text-xl font-semibold">Books</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        읽은 책과 한줄평을 기록합니다.
      </p>
      <div className="mt-8 flex flex-col gap-1">
        <AnimatedBackground
          enableHover
          className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {bookList.map((book) => {
            const link = `/books/${book.slug}`
            return (
              <Link
                key={book.slug}
                className="-mx-3 rounded-xl px-3 py-3 no-underline hover:no-underline"
                href={link}
                data-id={link}
              >
                <div className="flex flex-col gap-1">
                  <h4 className="m-0! font-normal dark:text-zinc-100">
                    {book.title}
                  </h4>
                  <p className="mb-0! text-sm text-zinc-500 dark:text-zinc-400">
                    {book.author} · {book.readDate}
                  </p>
                  <p className="mb-0! text-sm text-zinc-600 dark:text-zinc-300">
                    {book.summary}
                  </p>
                </div>
              </Link>
            )
          })}
        </AnimatedBackground>
      </div>
    </main>
  )
}
