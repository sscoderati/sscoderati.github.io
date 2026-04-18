import { MDXContent } from '@/components/mdx-content'
import {
  findPublishedBlogPostBySlug,
  getPublishedBlogPosts,
  normalizeBlogSlug,
} from '@/lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({
    slug: normalizeBlogSlug(post.slug),
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = findPublishedBlogPostBySlug(slug)

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
  const post = findPublishedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <MDXContent code={post.body} />
}
