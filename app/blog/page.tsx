import { AnimatedBackground } from '@/components/ui/animated-background'
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
        <AnimatedBackground
          enableHover
          className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {sortedPosts.map((post) => (
            <Link
              key={post.link}
              className="-mx-3 rounded-xl px-3 py-3 no-underline hover:no-underline"
              href={post.link}
              data-id={post.link}
            >
              <div className="flex flex-col space-y-1">
                <h4 className="m-0! font-normal dark:text-zinc-100">
                  {post.title}
                </h4>
                <p className="mb-0! flex flex-col gap-1 text-zinc-500 dark:text-zinc-400">
                  <span className="text-sm">{post.description}</span>
                  <span className="text-xs">{post.date}</span>
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </main>
  )
}
