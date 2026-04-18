'use client'

import { AnimatedBackground } from '@/components/ui/animated-background'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type WikiListItem = {
  slug: string
  title: string
  description?: string
  tags: string[]
  updatedAt: string
}

type WikiListProps = {
  posts: WikiListItem[]
  tags: string[]
}

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function WikiList({ posts, tags }: WikiListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return posts
    }

    return posts.filter((post) => post.tags.includes(selectedTag))
  }, [posts, selectedTag])

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTag(null)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            selectedTag === null
              ? 'border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500'
          }`}
        >
          전체
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag((prevTag) => (prevTag === tag ? null : tag))}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              selectedTag === tag
                ? 'border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <AnimatedBackground
          enableHover
          className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              className="-mx-3 rounded-xl px-3 py-3 no-underline hover:no-underline"
              href={`/wiki/${post.slug}`}
              data-id={post.slug}
            >
              <div className="flex flex-col gap-2">
                <h4 className="m-0! font-normal dark:text-zinc-100">{post.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={`${post.slug}-${tag}`}
                      className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mb-0! flex flex-col gap-1 text-zinc-500 dark:text-zinc-400">
                  {post.description && <span className="text-sm">{post.description}</span>}
                  <span className="text-xs">{formatDate(post.updatedAt)}</span>
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
        {filteredPosts.length === 0 && (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            선택한 태그에 해당하는 문서가 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
