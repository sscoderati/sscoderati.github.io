export const normalizeWikiSlug = (slug: string) =>
  slug.trim().replaceAll(' ', '-').toLowerCase()
