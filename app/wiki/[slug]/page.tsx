import { MDXContent } from '@/components/mdx-content'
import { formatWikiDate } from '@/lib/wiki-date'
import { getBacklinks } from '@/lib/wiki-graph'
import { getWikiPost, getWikiPosts } from '@/lib/wiki-posts'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type WikiDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getWikiPosts().map((post) => ({
    slug: post.slugAsParams,
  }))
}

export default async function WikiDetailPage({ params }: WikiDetailPageProps) {
  const { slug } = await params
  const post = getWikiPost(slug)

  if (!post) {
    notFound()
  }

  const backlinks = getBacklinks(post.slugAsParams)

  return (
    <main className="mt-24 pb-20">
      <div className="mb-4">
        <Link
          href="/wiki"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {'<'} Wiki
        </Link>
      </div>
      <article className="prose prose-gray max-w-none dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-100 prose-pre:text-zinc-800 dark:prose-pre:border-zinc-800 dark:prose-pre:bg-zinc-900 dark:prose-pre:text-zinc-100">
        <h1>{post.title}</h1>
        {post.description && <p className="mt-2 text-zinc-600">{post.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={`${post.slugAsParams}-${tag}`}
              className="not-prose rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              #{tag}
            </span>
          ))}
          <span className="not-prose text-xs text-zinc-500 dark:text-zinc-400">
            업데이트: {formatWikiDate(post.updatedAt)}
          </span>
        </div>
        <div className="mt-8">
          <MDXContent code={post.body} />
        </div>
      </article>
      <section className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-base font-semibold">Backlinks</h2>
        {backlinks.length === 0 && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            연결된 역링크가 아직 없습니다.
          </p>
        )}
        {backlinks.length > 0 && (
          <ul className="mt-3 space-y-2">
            {backlinks.map((backlink) => (
              <li key={`${post.slugAsParams}-backlink-${backlink.slugAsParams}`}>
                <Link
                  href={`/wiki/${backlink.slugAsParams}`}
                  className="text-sm text-zinc-700 underline-offset-2 transition-colors hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                  {backlink.title}
                </Link>
                {backlink.description && (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {backlink.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
