import remarkWikiLink from '@flowershow/remark-wiki-link'
import { defineCollection, defineConfig, s } from 'velite'

const wikiLinkRemarkPlugin = remarkWikiLink as any

const baseContentSchema = s.object({
  title: s.string(),
  description: s.string().optional(),
  draft: s.boolean().default(false),
  tags: s.array(s.string()).default([]),
  slug: s.path(),
  excerpt: s.excerpt(),
  metadata: s.metadata(),
  content: s.mdx(),
})

const blog = defineCollection({
  name: 'Blog',
  pattern: 'blog/**/*.{md,mdx}',
  schema: baseContentSchema,
})

const books = defineCollection({
  name: 'Book',
  pattern: 'books/**/*.{md,mdx}',
  schema: baseContentSchema,
})

const wiki = defineCollection({
  name: 'Wiki',
  pattern: 'wiki/**/*.{md,mdx}',
  schema: baseContentSchema,
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
