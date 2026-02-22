import { promises as fs } from 'node:fs'
import path from 'node:path'

export type LogPost = {
  title: string
  description: string
  link: string
  category: string
  categoryLabel: string
  series: string
  seriesLabel: string
  order: number
}

export type LogSeries = {
  slug: string
  label: string
  category: string
  categoryLabel: string
  description: string
  postCount: number
  link: string
}

export type LogCategory = {
  key: string
  label: string
  series: LogSeries[]
}

const LOGS_DIRECTORY = path.join(process.cwd(), 'app', 'logs')

function extractStringField(source: string, field: string): string {
  const pattern = new RegExp(`${field}:\\s*'([^']*)'`)
  const match = source.match(pattern)
  return match?.[1] ?? ''
}

function extractNumberField(source: string, field: string): number {
  const pattern = new RegExp(`${field}:\\s*(\\d+)`)
  const match = source.match(pattern)
  return match?.[1] ? Number(match[1]) : 0
}

export async function getLogPosts(
  seriesSlug?: string,
): Promise<LogPost[]> {
  const seriesDirs = await fs.readdir(LOGS_DIRECTORY, { withFileTypes: true })
  const allPosts: LogPost[] = []

  for (const seriesDir of seriesDirs) {
    if (!seriesDir.isDirectory()) continue
    if (seriesSlug && seriesDir.name !== seriesSlug) continue

    const seriesPath = path.join(LOGS_DIRECTORY, seriesDir.name)
    const postDirs = await fs.readdir(seriesPath, { withFileTypes: true })

    for (const postDir of postDirs) {
      if (!postDir.isDirectory()) continue

      const filePath = path.join(seriesPath, postDir.name, 'page.mdx')
      try {
        const source = await fs.readFile(filePath, 'utf8')
        allPosts.push({
          title: extractStringField(source, 'title'),
          description: extractStringField(source, 'description'),
          link: `/logs/${seriesDir.name}/${postDir.name}`,
          category: extractStringField(source, 'category'),
          categoryLabel: extractStringField(source, 'categoryLabel'),
          series: extractStringField(source, 'series'),
          seriesLabel: extractStringField(source, 'seriesLabel'),
          order: extractNumberField(source, 'order'),
        })
      } catch {
        // skip if page.mdx not found
      }
    }
  }

  return allPosts.sort((a, b) => a.order - b.order)
}

export async function getLogSeries(): Promise<LogCategory[]> {
  const posts = await getLogPosts()

  const seriesMap = new Map<string, LogSeries>()
  for (const post of posts) {
    if (!seriesMap.has(post.series)) {
      seriesMap.set(post.series, {
        slug: post.series,
        label: post.seriesLabel,
        category: post.category,
        categoryLabel: post.categoryLabel,
        description: '',
        postCount: 0,
        link: `/logs/${post.series}`,
      })
    }
    const series = seriesMap.get(post.series)!
    series.postCount++
  }

  const categoryMap = new Map<string, LogCategory>()
  for (const series of seriesMap.values()) {
    if (!categoryMap.has(series.category)) {
      categoryMap.set(series.category, {
        key: series.category,
        label: series.categoryLabel,
        series: [],
      })
    }
    categoryMap.get(series.category)!.series.push(series)
  }

  return Array.from(categoryMap.values())
}
