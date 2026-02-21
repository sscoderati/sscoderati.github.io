import { getBlogPosts } from '@/lib/blog-posts'
import Link from 'next/link'

export const metadata = {
  title: '블로그',
  description: '홍창기의 개발 블로그 글 목록입니다.',
  alternates: {
    canonical: '/blog',
  },
}

export default async function BlogIndexPage() {
  const sortedPosts = await getBlogPosts()

  return (
    <main className="mt-24 pb-20">
      <h1 className="text-xl font-semibold">블로그</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        작성한 글 목록입니다.
      </p>
      <div className="mt-8 flex flex-col gap-1">
        {sortedPosts.map((post) => (
          <article
            key={post.link}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {post.date}
            </span>
            <Link href={post.link} className="hover:underline">
              <h2 className="text-base font-medium">{post.title}</h2>
            </Link>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {post.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}
