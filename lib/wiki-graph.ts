import { getWikiPosts, type WikiPost } from '@/lib/wiki-posts'
import { normalizeWikiSlug } from '@/lib/wiki-slug'

export type WikiGraphNode = {
  id: string
  label: string
  slug: string
  tags: string[]
  kind: 'wiki' | 'ghost'
}

export type WikiGraphLink = {
  source: string
  target: string
}

export type WikiGraph = {
  nodes: WikiGraphNode[]
  links: WikiGraphLink[]
}

const getCanonicalSlug = (slug: string) => normalizeWikiSlug(slug) || slug

export const getGraph = (): WikiGraph => {
  const posts = getWikiPosts()
  const nodes = new Map<string, WikiGraphNode>()
  const links = new Map<string, WikiGraphLink>()

  for (const post of posts) {
    const canonicalSlug = getCanonicalSlug(post.slugAsParams)

    nodes.set(canonicalSlug, {
      id: canonicalSlug,
      label: post.title,
      slug: post.slugAsParams,
      tags: post.tags,
      kind: 'wiki',
    })
  }

  for (const post of posts) {
    const sourceSlug = getCanonicalSlug(post.slugAsParams)

    for (const targetSlug of post.wikilinks) {
      const normalizedTargetSlug = normalizeWikiSlug(targetSlug)
      if (!normalizedTargetSlug) {
        continue
      }

      if (!nodes.has(normalizedTargetSlug)) {
        nodes.set(normalizedTargetSlug, {
          id: normalizedTargetSlug,
          label: normalizedTargetSlug,
          slug: normalizedTargetSlug,
          tags: [],
          kind: 'ghost',
        })
      }

      const key = `${sourceSlug}->${normalizedTargetSlug}`
      links.set(key, {
        source: sourceSlug,
        target: normalizedTargetSlug,
      })
    }
  }

  return {
    nodes: [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id, 'ko-KR')),
    links: [...links.values()].sort((a, b) =>
      `${a.source}->${a.target}`.localeCompare(`${b.source}->${b.target}`, 'ko-KR'),
    ),
  }
}

export const getBacklinks = (slug: string): WikiPost[] => {
  const normalizedSlug = normalizeWikiSlug(slug)
  if (!normalizedSlug) {
    return []
  }

  return getWikiPosts().filter((post) => post.wikilinks.includes(normalizedSlug))
}
