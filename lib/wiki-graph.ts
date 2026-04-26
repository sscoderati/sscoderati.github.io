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
const PROGRAMMERS_TAG = 'series/programmers'
const BOJ_TAG = 'series/boj'

const PS_NODE = {
  id: '__graph-ps__',
  label: 'PS',
  slug: 'PS',
}

const BOJ_NODE = {
  id: '__graph-ps-boj__',
  label: 'BOJ',
  slug: 'BOJ',
}

const PROGRAMMERS_NODE = {
  id: '__graph-ps-programmers__',
  label: 'Programmers',
  slug: 'Programmers',
}

export const getGraph = (): WikiGraph => {
  const posts = getWikiPosts()
  const nodes = new Map<string, WikiGraphNode>()
  const links = new Map<string, WikiGraphLink>()
  const addLink = (source: string, target: string) => {
    const key = `${source}->${target}`
    links.set(key, { source, target })
  }

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

      addLink(sourceSlug, normalizedTargetSlug)
    }
  }

  const programmersPosts = posts.filter((post) =>
    post.tags.includes(PROGRAMMERS_TAG),
  )
  const bojPosts = posts.filter((post) => post.tags.includes(BOJ_TAG))

  const ensureGhostNode = (id: string, label: string, slug: string) => {
    if (nodes.has(id)) return
    nodes.set(id, {
      id,
      label,
      slug,
      tags: [],
      kind: 'ghost',
    })
  }

  if (programmersPosts.length > 0 || bojPosts.length > 0) {
    ensureGhostNode(PS_NODE.id, PS_NODE.label, PS_NODE.slug)
  }

  if (bojPosts.length > 0) {
    ensureGhostNode(BOJ_NODE.id, BOJ_NODE.label, BOJ_NODE.slug)
    addLink(PS_NODE.id, BOJ_NODE.id)

    for (const post of bojPosts) {
      addLink(BOJ_NODE.id, getCanonicalSlug(post.slugAsParams))
    }
  }

  if (programmersPosts.length > 0) {
    ensureGhostNode(
      PROGRAMMERS_NODE.id,
      PROGRAMMERS_NODE.label,
      PROGRAMMERS_NODE.slug,
    )
    addLink(PS_NODE.id, PROGRAMMERS_NODE.id)

    for (const post of programmersPosts) {
      addLink(PROGRAMMERS_NODE.id, getCanonicalSlug(post.slugAsParams))
    }
  }

  return {
    nodes: [...nodes.values()].sort((a, b) =>
      a.id.localeCompare(b.id, 'ko-KR'),
    ),
    links: [...links.values()].sort((a, b) =>
      `${a.source}->${a.target}`.localeCompare(
        `${b.source}->${b.target}`,
        'ko-KR',
      ),
    ),
  }
}

export const getBacklinks = (slug: string): WikiPost[] => {
  const normalizedSlug = normalizeWikiSlug(slug)
  if (!normalizedSlug) {
    return []
  }

  return getWikiPosts().filter((post) =>
    post.wikilinks.includes(normalizedSlug),
  )
}
