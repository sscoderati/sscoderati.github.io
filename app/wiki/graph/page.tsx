export const metadata = {
  title: 'Wiki Graph',
  description: 'Wiki 그래프 뷰 플레이스홀더 페이지',
  alternates: {
    canonical: '/wiki/graph',
  },
}

export default function WikiGraphPlaceholderPage() {
  return (
    <main className="mt-24 pb-20">
      <h1 className="text-xl font-semibold">Wiki Graph</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        그래프 뷰는 후속 이슈에서 구현 예정입니다.
      </p>
    </main>
  )
}
