import { defineCollection, defineConfig, s } from 'velite'

type RemarkNode = {
  type: string
  value?: string
  url?: string
  title?: string | null
  children?: RemarkNode[]
}

type RemarkFile = {
  data?: {
    data?: Record<string, unknown>
    [key: string]: unknown
  }
}

type VeliteTransformContext = {
  meta?: {
    content?: string
    mdast?: RemarkNode
    data?: {
      data?: {
        wikilinks?: unknown
      }
      wikilinks?: unknown
    }
  }
}

const WIKI_LINK_PATTERN = /\[\[([^[\]]+)\]\]/g
const NON_TRAVERSABLE_NODES = new Set([
  'code',
  'inlineCode',
  'link',
  'linkReference',
  'definition',
  'yaml',
  'html',
])

const normalizeWikiSlug = (slug: string) =>
  slug.trim().replaceAll(' ', '-').toLowerCase()

const extractWikiLinksFromRaw = (raw: string): string[] => {
  const sanitized = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]+`/g, '')
  const wikilinks = new Set<string>()

  for (const match of sanitized.matchAll(WIKI_LINK_PATTERN)) {
    const [target] = match[1].split('|')
    const normalizedTarget = normalizeWikiSlug(target ?? '')
    if (normalizedTarget) {
      wikilinks.add(normalizedTarget)
    }
  }

  return [...wikilinks]
}

const extractWikiLinksFromText = (value: string, wikilinks: Set<string>) => {
  for (const match of value.matchAll(WIKI_LINK_PATTERN)) {
    const [target] = match[1].split('|')
    const normalizedTarget = normalizeWikiSlug(target ?? '')
    if (normalizedTarget) {
      wikilinks.add(normalizedTarget)
    }
  }
}

const extractWikiLinksFromMdast = (node: RemarkNode | undefined): string[] => {
  if (!node) {
    return []
  }

  const wikilinks = new Set<string>()

  const visit = (current: RemarkNode) => {
    if (NON_TRAVERSABLE_NODES.has(current.type)) {
      return
    }

    if (isTextNode(current)) {
      extractWikiLinksFromText(current.value, wikilinks)
      return
    }

    if (!isParentNode(current)) {
      return
    }

    for (const child of current.children) {
      visit(child)
    }
  }

  visit(node)
  return [...wikilinks]
}

const sanitizeWikiLinks = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => normalizeWikiSlug(item))
    .filter(Boolean)
}

const createTextNode = (value: string): RemarkNode => ({
  type: 'text',
  value,
})

const createWikiLinkNode = (slug: string, label: string): RemarkNode => ({
  type: 'link',
  url: `/wiki/${slug}`,
  title: null,
  children: [createTextNode(label)],
})

const splitWikiLinks = (value: string, wikilinks: Set<string>): RemarkNode[] => {
  const chunks: RemarkNode[] = []
  let startIndex = 0

  for (const match of value.matchAll(WIKI_LINK_PATTERN)) {
    const [fullMatch, inner] = match
    const matchIndex = match.index ?? 0

    if (matchIndex > startIndex) {
      chunks.push(createTextNode(value.slice(startIndex, matchIndex)))
    }

    const [rawTarget, rawAlias] = inner.split('|')
    const target = normalizeWikiSlug(rawTarget ?? '')
    const label = (rawAlias ?? rawTarget ?? '').trim()

    if (!target) {
      chunks.push(createTextNode(fullMatch))
    } else {
      wikilinks.add(target)
      chunks.push(createWikiLinkNode(target, label || target))
    }

    startIndex = matchIndex + fullMatch.length
  }

  if (startIndex < value.length) {
    chunks.push(createTextNode(value.slice(startIndex)))
  }

  return chunks.length > 0 ? chunks : [createTextNode(value)]
}

const isParentNode = (
  node: RemarkNode,
): node is RemarkNode & { children: RemarkNode[] } => Array.isArray(node.children)

const isTextNode = (
  node: RemarkNode,
): node is RemarkNode & { value: string } =>
  node.type === 'text' && typeof node.value === 'string'

const transformWikiLinks = (node: RemarkNode, wikilinks: Set<string>) => {
  if (!isParentNode(node) || NON_TRAVERSABLE_NODES.has(node.type)) {
    return
  }

  const nextChildren: RemarkNode[] = []

  for (const child of node.children) {
    if (isTextNode(child)) {
      nextChildren.push(...splitWikiLinks(child.value, wikilinks))
      continue
    }

    transformWikiLinks(child, wikilinks)
    nextChildren.push(child)
  }

  node.children = nextChildren
}

const wikiLinkRemarkPlugin = () => {
  return (tree: RemarkNode, file: RemarkFile) => {
    const wikilinks = new Set<string>()
    transformWikiLinks(tree, wikilinks)
    const collectedWikiLinks = [...wikilinks]

    const fileData = file.data ?? {}
    fileData.wikilinks = collectedWikiLinks
    if (fileData.data && typeof fileData.data === 'object') {
      fileData.data.wikilinks = collectedWikiLinks
    }
    file.data = fileData
  }
}

const wikiLinkRemarkPluginPluggable = wikiLinkRemarkPlugin as any

const baseContentSchema = s.object({
  title: s.string(),
  description: s.string().optional(),
  date: s.string().optional(),
  draft: s.boolean().default(false),
  tags: s.array(s.string()).default([]),
  slug: s.path(),
  excerpt: s.excerpt(),
  metadata: s.metadata(),
  body: s.mdx(),
})

const blogContentSchema = s.object({
  title: s.string(),
  description: s.string().optional(),
  date: s.string(),
  draft: s.boolean().default(false),
  tags: s.array(s.string()).default([]),
  slug: s.path(),
  excerpt: s.excerpt(),
  metadata: s.metadata(),
  body: s.mdx(),
})

const blog = defineCollection({
  name: 'Blog',
  pattern: 'blog/**/*.{md,mdx}',
  schema: blogContentSchema,
})

const books = defineCollection({
  name: 'Book',
  pattern: 'books/**/*.{md,mdx}',
  schema: s.object({
    title: s.string(),
    author: s.string(),
    readDate: s.string(),
    summary: s.string(),
    slug: s.path().transform((slug) => slug.replace(/^books\//, '')),
    body: s.mdx(),
  }),
})

const wiki = defineCollection({
  name: 'Wiki',
  pattern: 'wiki/**/*.{md,mdx}',
  schema: s.object({
    title: s.string(),
    description: s.string().optional(),
    tags: s.array(s.string()).default([]),
    aliases: s.array(s.string()).default([]),
    updatedAt: s.isodate(),
    slug: s.path(),
    body: s.mdx(),
    wikilinks: s.raw().transform((raw, ctx) => {
      const meta = (ctx as VeliteTransformContext).meta
      const linksFromMeta = sanitizeWikiLinks(
        meta?.data?.data?.wikilinks ?? meta?.data?.wikilinks,
      )

      if (linksFromMeta.length > 0) {
        return linksFromMeta
      }

      const linksFromMdast = extractWikiLinksFromMdast(meta?.mdast)
      if (linksFromMdast.length > 0) {
        return linksFromMdast
      }

      return extractWikiLinksFromRaw(raw ?? meta?.content ?? '')
    }),
  }),
})

export default defineConfig({
  root: 'content',
  collections: {
    blog,
    books,
    wiki,
  },
  markdown: {
    remarkPlugins: [wikiLinkRemarkPluginPluggable],
  },
  mdx: {
    remarkPlugins: [wikiLinkRemarkPluginPluggable],
  },
})
