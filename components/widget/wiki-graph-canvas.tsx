'use client'

import type { WikiGraph, WikiGraphNode } from '@/lib/wiki-graph'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

const LIGHT_TAG_COLORS = [
  '#0d9488',
  '#0f766e',
  '#2563eb',
  '#9333ea',
  '#c2410c',
  '#059669',
  '#be123c',
  '#7c3aed',
]

const DARK_TAG_COLORS = [
  '#2dd4bf',
  '#38bdf8',
  '#60a5fa',
  '#c084fc',
  '#fb923c',
  '#34d399',
  '#fb7185',
  '#a78bfa',
]

type WikiGraphCanvasProps = {
  graph: WikiGraph
}

type GraphNode = WikiGraphNode & {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number
  fy?: number
}

type GraphLink = {
  source: string | GraphNode
  target: string | GraphNode
}

const getNodeId = (node: unknown): string => {
  if (!node) {
    return ''
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (typeof node === 'object' && node !== null && 'id' in node) {
    return String((node as { id?: string | number }).id ?? '')
  }

  return ''
}

export function WikiGraphCanvas({ graph }: WikiGraphCanvasProps) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'
  const graphRef = useRef<any>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set())
  const [highlightedLinkIds, setHighlightedLinkIds] = useState<Set<string>>(new Set())
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)

  const nodes = useMemo<GraphNode[]>(() => graph.nodes.map((node) => ({ ...node })), [graph.nodes])
  const links = useMemo<GraphLink[]>(() => graph.links.map((link) => ({ ...link })), [graph.links])

  const tags = useMemo(() => {
    return [...new Set(nodes.flatMap((node) => node.tags))].sort((a, b) =>
      a.localeCompare(b, 'ko-KR'),
    )
  }, [nodes])

  const [enabledTags, setEnabledTags] = useState<string[]>(tags)

  useEffect(() => {
    setEnabledTags(tags)
  }, [tags])

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) {
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      setCanvasWidth(rect.width)
      setCanvasHeight(Math.max(360, window.innerHeight - rect.top))
    }

    updateCanvasSize()

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', updateCanvasSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  const enabledTagSet = useMemo(() => new Set(enabledTags), [enabledTags])

  const nodeById = useMemo(() => {
    const byId = new Map<string, GraphNode>()

    for (const node of nodes) {
      byId.set(node.id, node)
    }

    return byId
  }, [nodes])

  const { neighborsByNodeId, linksByNodeId } = useMemo(() => {
    const neighbors = new Map<string, Set<string>>()
    const linksMap = new Map<string, Set<string>>()

    for (const link of links) {
      const sourceId = getNodeId(link.source)
      const targetId = getNodeId(link.target)
      const linkId = `${sourceId}->${targetId}`

      if (!neighbors.has(sourceId)) {
        neighbors.set(sourceId, new Set())
      }
      if (!neighbors.has(targetId)) {
        neighbors.set(targetId, new Set())
      }
      neighbors.get(sourceId)?.add(targetId)
      neighbors.get(targetId)?.add(sourceId)

      if (!linksMap.has(sourceId)) {
        linksMap.set(sourceId, new Set())
      }
      if (!linksMap.has(targetId)) {
        linksMap.set(targetId, new Set())
      }
      linksMap.get(sourceId)?.add(linkId)
      linksMap.get(targetId)?.add(linkId)
    }

    return {
      neighborsByNodeId: neighbors,
      linksByNodeId: linksMap,
    }
  }, [links])

  const visibleNodeIds = useMemo(() => {
    const visibleIds = new Set<string>()

    for (const node of nodes) {
      if (node.kind === 'ghost') {
        continue
      }

      if (node.tags.length === 0) {
        visibleIds.add(node.id)
        continue
      }

      if (node.tags.some((tag) => enabledTagSet.has(tag))) {
        visibleIds.add(node.id)
      }
    }

    for (const link of links) {
      const sourceId = getNodeId(link.source)
      const targetId = getNodeId(link.target)

      if (visibleIds.has(sourceId)) {
        const targetNode = nodeById.get(targetId)
        if (targetNode?.kind === 'ghost') {
          visibleIds.add(targetId)
        }
      }

      if (visibleIds.has(targetId)) {
        const sourceNode = nodeById.get(sourceId)
        if (sourceNode?.kind === 'ghost') {
          visibleIds.add(sourceId)
        }
      }
    }

    return visibleIds
  }, [enabledTagSet, links, nodeById, nodes])

  const tagColorMap = useMemo(() => {
    const palette = isDark ? DARK_TAG_COLORS : LIGHT_TAG_COLORS

    return new Map(tags.map((tag, index) => [tag, palette[index % palette.length]]))
  }, [isDark, tags])

  const graphData = useMemo(
    () => ({
      nodes,
      links,
    }),
    [links, nodes],
  )

  const nodeLabel = useCallback((node: any) => {
    const item = node as GraphNode
    if (item.kind === 'ghost') {
      return `${item.slug} (미작성)`
    }

    const tagsText = item.tags.map((tag) => `#${tag}`).join(', ')
    return `${item.label}\n/${item.slug}${tagsText ? `\n${tagsText}` : ''}`
  }, [])

  const getNodeFillColor = useCallback(
    (node: GraphNode) => {
      if (node.kind === 'ghost') {
        return isDark ? '#52525b' : '#a1a1aa'
      }

      const matchingTag = node.tags.find((tag) => enabledTagSet.has(tag)) ?? node.tags[0]
      const fallbackColor = isDark ? '#60a5fa' : '#2563eb'

      return matchingTag ? (tagColorMap.get(matchingTag) ?? fallbackColor) : fallbackColor
    },
    [enabledTagSet, isDark, tagColorMap],
  )

  const handleNodeHover = useCallback(
    (node: any | null) => {
      if (!node || !node.id) {
        setHoveredNodeId(null)
        setHighlightedNodeIds(new Set())
        setHighlightedLinkIds(new Set())
        return
      }

      const id = String(node.id)
      setHoveredNodeId(id)

      const neighborIds = neighborsByNodeId.get(id) ?? new Set<string>()
      const nodeSet = new Set<string>([id, ...neighborIds])
      const linkSet = new Set<string>(linksByNodeId.get(id) ?? new Set<string>())

      setHighlightedNodeIds(nodeSet)
      setHighlightedLinkIds(linkSet)
    },
    [linksByNodeId, neighborsByNodeId],
  )

  const focusNodeById = useCallback(
    (targetNodeId: string) => {
      let attempt = 0

      const tryFocus = () => {
        attempt += 1

        const targetNode = nodeById.get(targetNodeId)
        const graphApi = graphRef.current

        if (!targetNode || !graphApi) {
          return
        }

        if (typeof targetNode.x === 'number' && typeof targetNode.y === 'number') {
          graphApi.centerAt(targetNode.x, targetNode.y, 700)
          graphApi.zoom(3.5, 700)
          return
        }

        if (attempt < 20) {
          window.setTimeout(tryFocus, 80)
        }
      }

      tryFocus()
    },
    [nodeById],
  )

  const handleSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const keyword = searchKeyword.trim().toLowerCase()
      if (!keyword) {
        setSearchMessage('')
        return
      }

      const targetNode = nodes.find((node) => {
        if (node.kind !== 'wiki') {
          return false
        }

        return (
          node.slug.toLowerCase().includes(keyword) || node.label.toLowerCase().includes(keyword)
        )
      })

      if (!targetNode) {
        setSearchMessage('일치하는 wiki 문서를 찾지 못했습니다.')
        return
      }

      if (!visibleNodeIds.has(targetNode.id)) {
        setEnabledTags((prev) => [...new Set([...prev, ...targetNode.tags])])
      }

      setFocusedNodeId(targetNode.id)
      focusNodeById(targetNode.id)
      setSearchMessage(`"${targetNode.label}" 노드로 이동했습니다.`)
    },
    [focusNodeById, nodes, searchKeyword, visibleNodeIds],
  )

  const nodeVisibility = useCallback(
    (node: any) => {
      return visibleNodeIds.has(String(node.id))
    },
    [visibleNodeIds],
  )

  const linkVisibility = useCallback(
    (link: any) => {
      const sourceId = getNodeId(link.source)
      const targetId = getNodeId(link.target)

      return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId)
    },
    [visibleNodeIds],
  )

  const nodeCanvasObject = useCallback(
    (node: any, context: CanvasRenderingContext2D, globalScale: number) => {
      const item = node as GraphNode
      const nodeId = String(item.id)

      const isHighlighted =
        hoveredNodeId === null || highlightedNodeIds.size === 0 ? true : highlightedNodeIds.has(nodeId)
      const isFocused = focusedNodeId === nodeId

      const radius = item.kind === 'ghost' ? 3.5 : 5.5
      const opacity = isHighlighted ? 1 : 0.16
      const fillColor = getNodeFillColor(item)

      context.save()
      context.beginPath()
      context.arc(item.x ?? 0, item.y ?? 0, radius, 0, 2 * Math.PI)
      context.fillStyle = fillColor
      context.globalAlpha = opacity
      context.fill()
      context.closePath()

      if (isFocused) {
        context.beginPath()
        context.arc(item.x ?? 0, item.y ?? 0, radius + 3, 0, 2 * Math.PI)
        context.strokeStyle = isDark ? '#f8fafc' : '#0f172a'
        context.lineWidth = 1.6
        context.stroke()
        context.closePath()
      }

      const showLabel = isFocused || nodeId === hoveredNodeId || globalScale > 2.2
      if (showLabel) {
        const fontSize = Math.max(11, 14 / globalScale)
        const text = item.kind === 'ghost' ? item.slug : item.label
        const textX = (item.x ?? 0) + radius + 3
        const textY = item.y ?? 0

        context.font = `${fontSize}px var(--font-pretendard)`
        context.textAlign = 'left'
        context.textBaseline = 'middle'

        const textWidth = context.measureText(text).width
        context.fillStyle = isDark ? 'rgba(9, 9, 11, 0.82)' : 'rgba(255, 255, 255, 0.82)'
        context.fillRect(textX - 2, textY - fontSize * 0.65, textWidth + 4, fontSize * 1.3)

        context.fillStyle = isDark ? '#f4f4f5' : '#18181b'
        context.globalAlpha = opacity
        context.fillText(text, textX, textY)
      }

      context.restore()
    },
    [focusedNodeId, getNodeFillColor, highlightedNodeIds, hoveredNodeId, isDark],
  )

  const linkColor = useCallback(
    (link: any) => {
      const sourceId = getNodeId(link.source)
      const targetId = getNodeId(link.target)
      const linkId = `${sourceId}->${targetId}`
      const isHighlighted =
        hoveredNodeId === null || highlightedLinkIds.size === 0 ? true : highlightedLinkIds.has(linkId)

      if (!isHighlighted) {
        return isDark ? 'rgba(82, 82, 91, 0.18)' : 'rgba(113, 113, 122, 0.18)'
      }

      return isDark ? 'rgba(212, 212, 216, 0.6)' : 'rgba(63, 63, 70, 0.45)'
    },
    [highlightedLinkIds, hoveredNodeId, isDark],
  )

  const linkWidth = useCallback(
    (link: any) => {
      const sourceId = getNodeId(link.source)
      const targetId = getNodeId(link.target)
      const linkId = `${sourceId}->${targetId}`

      if (hoveredNodeId === null || highlightedLinkIds.size === 0) {
        return 1
      }

      return highlightedLinkIds.has(linkId) ? 2 : 0.6
    },
    [highlightedLinkIds, hoveredNodeId],
  )

  const backgroundColor = isDark ? '#09090b' : '#fafafa'

  return (
    <div ref={containerRef} className="relative -mx-4">
      <div
        className="relative w-full border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
        style={{ height: canvasHeight > 0 ? `${canvasHeight}px` : 'calc(100vh - 10rem)' }}
      >
        <form
          onSubmit={handleSearch}
          className="absolute top-4 left-1/2 z-10 flex w-[min(92vw,28rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-300 bg-white/90 p-2 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/85"
        >
          <input
            type="search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="slug 또는 title 검색"
            className="w-full bg-transparent px-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            aria-label="Wiki graph 검색"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            이동
          </button>
        </form>

        <aside className="absolute top-4 left-4 z-10 max-h-[min(70vh,34rem)] w-64 overflow-auto rounded-2xl border border-zinc-300 bg-white/92 p-3 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/88">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Tag Filter
            </h2>
            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setEnabledTags(tags)}
                className="rounded border border-zinc-300 px-1.5 py-0.5 text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
              >
                전체
              </button>
              <button
                type="button"
                onClick={() => setEnabledTags([])}
                className="rounded border border-zinc-300 px-1.5 py-0.5 text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
              >
                해제
              </button>
            </div>
          </div>

          <ul className="space-y-1">
            {tags.map((tag) => {
              const checked = enabledTagSet.has(tag)
              const color = tagColorMap.get(tag) ?? '#2563eb'

              return (
                <li key={tag}>
                  <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const nextChecked = event.target.checked

                        setEnabledTags((prev) => {
                          if (nextChecked) {
                            return [...new Set([...prev, tag])]
                          }

                          return prev.filter((item) => item !== tag)
                        })
                      }}
                      className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    />
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden={true}
                    />
                    <span>#{tag}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </aside>

        {canvasWidth > 0 && canvasHeight > 0 && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={canvasWidth}
            height={canvasHeight}
            nodeId="id"
            nodeLabel={nodeLabel}
            nodeCanvasObject={nodeCanvasObject}
            nodeVisibility={nodeVisibility}
            linkVisibility={linkVisibility}
            linkColor={linkColor}
            linkWidth={linkWidth}
            backgroundColor={backgroundColor}
            cooldownTicks={120}
            d3VelocityDecay={0.22}
            onNodeHover={handleNodeHover}
            onNodeClick={(node) => {
              const item = node as GraphNode
              if (item.kind === 'wiki') {
                router.push(`/wiki/${item.slug}`)
              }
            }}
            onBackgroundClick={() => {
              setFocusedNodeId(null)
              setSearchMessage('')
            }}
          />
        )}

        {searchMessage && (
          <div className="absolute right-4 bottom-4 z-10 rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 text-xs text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-200">
            {searchMessage}
          </div>
        )}
      </div>
    </div>
  )
}
