import remarkWikiLink from '@flowershow/remark-wiki-link'
import { defineCollection, defineConfig, s } from 'velite'

const wikiLinkRemarkPlugin = remarkWikiLink as any
const WIKI_LINK_PATTERN = /\[\[([^[\]]+)\]\]/g

const extractWikiLinks = (raw: string) => {
  const sanitized = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]+`/g, '')
  const links = new Set<string>()

  for (const match of sanitized.matchAll(WIKI_LINK_PATTERN)) {
    const [rawLink] = match[1].split('|')
    const normalizedLink = rawLink.trim().replaceAll(' ', '-').toLowerCase()

    if (normalizedLink) {
      links.add(normalizedLink)
    }
  }

  return [...links]
}

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
    wikilinks: s.raw().transform((raw) => extractWikiLinks(raw ?? '')),
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
    remarkPlugins: [wikiLinkRemarkPlugin],
  },
  mdx: {
    remarkPlugins: [wikiLinkRemarkPlugin],
  },
})
