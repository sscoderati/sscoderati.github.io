import { books } from '#site/content'

export type Book = (typeof books)[number]

export function getBooks(): Book[] {
  return [...books].sort(
    (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime(),
  )
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug)
}
