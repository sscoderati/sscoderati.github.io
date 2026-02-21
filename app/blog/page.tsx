import Link from 'next/link'
import { BLOG_POSTS } from '@/app/data'

export const metadata = {
  title: '블로그',
  description: '홍창기의 개발 블로그 글 목록입니다.',
  alternates: {
    canonical: '/blog',
  },
}

const sortedPosts = [...BLOG_POSTS].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
})

export default function BlogIndexPage() {
  return (
    <main className="mt-24 pb-20">
      <h1 className="text-xl font-semibold">블로그</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        작성한 글 목록입니다.
      </p>
      <div className="mt-8 flex flex-col gap-5">
        {sortedPosts.map((post) => (
          <article key={post.uid} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{post.date}</p>
            <h2 className="mt-1 text-base font-medium">
              <Link href={post.link} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{post.description}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
