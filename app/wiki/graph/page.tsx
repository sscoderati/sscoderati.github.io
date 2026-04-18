import { WikiGraphCanvas } from '@/components/widget/wiki-graph-canvas'
import { getGraph } from '@/lib/wiki-graph'

export const metadata = {
  title: 'Wiki Graph',
  description:
    'Wiki 문서 간 연결 구조를 인터랙티브 그래프로 탐색할 수 있습니다.',
  alternates: {
    canonical: '/wiki/graph',
  },
}

export default function WikiGraphPage() {
  const graph = getGraph()

  return (
    <main className="mt-24 pb-20">
      <h1 className="sr-only">Wiki Graph</h1>
      <WikiGraphCanvas graph={graph} />
    </main>
  )
}
