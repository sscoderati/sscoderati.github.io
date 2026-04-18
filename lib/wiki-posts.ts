import { wiki } from '#site/content'
import type { Wiki } from '#site/content'

const WIKI_PREFIX = 'wiki/'

export type WikiPost = Wiki & {
  slugAsParams: string
}

const toSlugAsParams = (slug: string) =>
  slug.startsWith(WIKI_PREFIX) ? slug.slice(WIKI_PREFIX.length) : slug

export const getWikiPosts = () => {
  return wiki
    .filter((post) => post.slug.startsWith(WIKI_PREFIX))
    .map((post) => ({
      ...post,
      slugAsParams: toSlugAsParams(post.slug),
    }))
    .sort((a, b) => {
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    })
}

export const getWikiPost = (slug: string) => {
  return getWikiPosts().find((post) => post.slugAsParams === slug)
}

export const getWikiTags = () => {
  return [...new Set(getWikiPosts().flatMap((post) => post.tags))].sort((a, b) =>
    a.localeCompare(b, 'ko-KR'),
  )
}
