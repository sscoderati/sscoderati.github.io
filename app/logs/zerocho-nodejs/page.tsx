import { AnimatedBackground } from '@/components/ui/animated-background'
import { getLogPosts } from '@/lib/log-posts'
import Link from 'next/link'

export const metadata = {
  title: '제로초의 Node.js 교과서',
  description: '제로초의 Node.js 교과서 시리즈 목록',
  alternates: {
    canonical: '/logs/zerocho-nodejs',
  },
}

export default async function SeriesPage() {
  const posts = await getLogPosts('zerocho-nodejs')

  return (
    <main className="mt-24 pb-20">
      <div className="mb-2">
        <Link
          href="/logs"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {'<'} Logs
        </Link>
      </div>
      <h1 className="text-xl font-semibold">제로초의 Node.js 교과서</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Books
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
          {posts.map((post) => (
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
                <p className="mb-0! text-sm text-zinc-500 dark:text-zinc-400">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </main>
  )
}
