import { MDXContent } from '@/components/mdx-content'
import { blog } from '#site/content'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

function normalizeSlug(slug: string) {
  return slug.replace(/^blog\//, '')
}

function getPostBySlug(slug: string) {
  return blog.find((post) => !post.draft && normalizeSlug(post.slug) === slug)
}

export function generateStaticParams() {
  return blog
    .filter((post) => !post.draft)
    .map((post) => ({ slug: normalizeSlug(post.slug) }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <MDXContent code={post.body} />
}
