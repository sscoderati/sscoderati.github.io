import { getWikiPosts, type WikiPost } from '@/lib/wiki-posts'
import { normalizeWikiSlug } from '@/lib/wiki-slug'

export type WikiGraphNode = {
  id: string
  label: string
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

export const getGraph = (): WikiGraph => {
  const posts = getWikiPosts()
  const nodes = new Map<string, WikiGraphNode>()
  const links = new Map<string, WikiGraphLink>()

  for (const post of posts) {
    nodes.set(post.slugAsParams, {
      id: post.slugAsParams,
      label: post.title,
      kind: 'wiki',
    })
  }

  for (const post of posts) {
    for (const targetSlug of post.wikilinks) {
      const normalizedTargetSlug = normalizeWikiSlug(targetSlug)
      if (!normalizedTargetSlug) {
        continue
      }

      if (!nodes.has(normalizedTargetSlug)) {
        nodes.set(normalizedTargetSlug, {
          id: normalizedTargetSlug,
          label: normalizedTargetSlug,
          kind: 'ghost',
        })
      }

      const key = `${post.slugAsParams}->${normalizedTargetSlug}`
      links.set(key, {
        source: post.slugAsParams,
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
  return getWikiPosts().filter((post) => post.wikilinks.includes(normalizedSlug))
}
