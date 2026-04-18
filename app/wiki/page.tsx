import { getWikiPosts, getWikiTags } from '@/lib/wiki-posts'
import Link from 'next/link'
import { WikiList } from './wiki-list'

export const metadata = {
  title: 'Wiki',
  description: '공부 노트와 연결된 문서 목록입니다.',
  alternates: {
    canonical: '/wiki',
  },
}

export default function WikiIndexPage() {
  const posts = getWikiPosts().map((post) => ({
    slug: post.slugAsParams,
    title: post.title,
    description: post.description,
    tags: post.tags,
    updatedAt: post.updatedAt,
  }))
  const tags = getWikiTags()

  return (
    <main className="mt-24 pb-20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Wiki</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            학습 기록을 연결형 노트로 정리한 문서 목록입니다.
          </p>
        </div>
        <Link
          href="/wiki/graph"
          className="shrink-0 rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          Graph 보기 (준비 중)
        </Link>
      </div>
      <WikiList posts={posts} tags={tags} />
    </main>
  )
}
