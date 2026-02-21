import { promises as fs } from 'node:fs'
import path from 'node:path'

export type BlogPost = {
  title: string
  description: string
  date: string
  link: string
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'app', 'blog')

function extractField(
  source: string,
  field: 'title' | 'description' | 'date' | 'canonical',
) {
  const patterns = {
    title: /title:\s*'([^']+)'/,
    description: /description:\s*(?:\n\s*)?'([^']+)'/,
    date: /date:\s*'([^']+)'/,
    canonical: /canonical:\s*'([^']+)'/,
  }

  const match = source.match(patterns[field])
  if (!match?.[1]) {
    throw new Error(`Missing "${field}" in blog post metadata.`)
  }

  return match[1]
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await fs.readdir(BLOG_DIRECTORY, { withFileTypes: true })
  const postDirectories = entries.filter((entry) => entry.isDirectory())

  const posts = await Promise.all(
    postDirectories.map(async (entry) => {
      const filePath = path.join(BLOG_DIRECTORY, entry.name, 'page.mdx')
      const source = await fs.readFile(filePath, 'utf8')

      return {
        title: extractField(source, 'title'),
        description: extractField(source, 'description'),
        date: extractField(source, 'date'),
        link: extractField(source, 'canonical'),
      }
    }),
  )

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
