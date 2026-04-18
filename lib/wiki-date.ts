const wikiDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul',
})

export const formatWikiDate = (value: string) => {
  return wikiDateFormatter.format(new Date(value))
}
