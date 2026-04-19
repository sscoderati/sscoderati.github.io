'use client'

import type { WikiGraph, WikiGraphNode } from '@/lib/wiki-graph'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import type { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'
import { quadtree } from 'd3-quadtree'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tags } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type WikiSearchItem = {
  id: string
  label: string
  slug: string
  tags: string[]
}

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

const SCALE_EXTENT: [number, number] = [0.2, 8]

type SimNode = WikiGraphNode &
  SimulationNodeDatum & {
    degree: number
  }

type SimLink = SimulationLinkDatum<SimNode> & {
  source: string | SimNode
  target: string | SimNode
}

type Transform = { x: number; y: number; k: number }

const INITIAL_TRANSFORM: Transform = { x: 0, y: 0, k: 1 }

function nodeRadius(node: SimNode): number {
  if (node.kind === 'ghost') return 3.5
  return Math.max(5, 4.5 + Math.sqrt(node.degree) * 1.2)
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

type WikiGraphCanvasProps = {
  graph: WikiGraph
}

export function WikiGraphCanvas({ graph }: WikiGraphCanvasProps) {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [themeMounted, setThemeMounted] = useState(false)
  useEffect(() => {
    setThemeMounted(true)
  }, [])
  const isDark = themeMounted && resolvedTheme === 'dark'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulation state lives outside React to avoid triggering re-renders
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null)
  const simLinksRef = useRef<SimLink[]>([])
  const qtRef = useRef<ReturnType<typeof quadtree<SimNode>> | null>(null)
  const transformRef = useRef<Transform>(INITIAL_TRANSFORM)
  const hoverNodeIdRef = useRef<string | null>(null)
  const focusedNodeIdRef = useRef<string | null>(null)
  const isDraggingRef = useRef(false)
  const dragNodeRef = useRef<SimNode | null>(null)
  const isPanningRef = useRef(false)
  const panStartRef = useRef<{
    px: number
    py: number
    tx: number
    ty: number
  } | null>(null)

  // Derived data
  const { nodes, links, tags, nodeById, neighborsByNodeId } = useMemo(() => {
    const degreeMap = new Map<string, number>()
    for (const l of graph.links) {
      degreeMap.set(l.source, (degreeMap.get(l.source) ?? 0) + 1)
      degreeMap.set(l.target, (degreeMap.get(l.target) ?? 0) + 1)
    }

    const nodeList: SimNode[] = graph.nodes.map((n) => ({
      ...n,
      degree: degreeMap.get(n.id) ?? 0,
    }))
    const linkList: SimLink[] = graph.links.map((l) => ({ ...l }))

    const allTags = [
      ...new Set(nodeList.flatMap((n) => n.tags)),
    ].sort((a, b) => a.localeCompare(b, 'ko-KR'))

    const byId = new Map<string, SimNode>()
    for (const n of nodeList) byId.set(n.id, n)

    const neighbors = new Map<string, Set<string>>()
    for (const l of graph.links) {
      if (!neighbors.has(l.source)) neighbors.set(l.source, new Set())
      if (!neighbors.has(l.target)) neighbors.set(l.target, new Set())
      neighbors.get(l.source)!.add(l.target)
      neighbors.get(l.target)!.add(l.source)
    }

    return {
      nodes: nodeList,
      links: linkList,
      tags: allTags,
      nodeById: byId,
      neighborsByNodeId: neighbors,
    }
  }, [graph])

  const [enabledTags, setEnabledTags] = useState<string[]>(tags)
  useEffect(() => {
    setEnabledTags(tags)
  }, [tags])
  const enabledTagSet = useMemo(() => new Set(enabledTags), [enabledTags])

  const [searchMessage, setSearchMessage] = useState('')

  const wikiSearchItems = useMemo((): WikiSearchItem[] => {
    return nodes
      .filter((n) => n.kind === 'wiki')
      .map((n) => ({
        id: n.id,
        label: n.label,
        slug: n.slug,
        tags: n.tags,
      }))
  }, [nodes])

  const wikiFilter = useCallback((item: WikiSearchItem, query: string) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      item.slug.toLowerCase().includes(q) ||
      item.label.toLowerCase().includes(q)
    )
  }, [])

  const tagColorMap = useMemo(() => {
    const palette = isDark ? DARK_TAG_COLORS : LIGHT_TAG_COLORS
    return new Map(tags.map((tag, i) => [tag, palette[i % palette.length]]))
  }, [isDark, tags])

  // Refs for values read inside the draw loop (avoids stale closure issues)
  const isDarkRef = useRef(isDark)
  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  const tagColorMapRef = useRef(tagColorMap)
  useEffect(() => {
    tagColorMapRef.current = tagColorMap
  }, [tagColorMap])

  const enabledTagSetRef = useRef(enabledTagSet)
  useEffect(() => {
    enabledTagSetRef.current = enabledTagSet
  }, [enabledTagSet])

  const neighborsByNodeIdRef = useRef(neighborsByNodeId)
  useEffect(() => {
    neighborsByNodeIdRef.current = neighborsByNodeId
  }, [neighborsByNodeId])

  // Visible node IDs based on active tag filter
  const visibleNodeIds = useMemo(() => {
    const visible = new Set<string>()
    for (const node of nodes) {
      if (node.kind === 'ghost') continue
      if (
        node.tags.length === 0 ||
        node.tags.some((t) => enabledTagSet.has(t))
      ) {
        visible.add(node.id)
      }
    }
    // Ghost nodes referenced by visible nodes stay visible
    for (const link of graph.links) {
      if (visible.has(link.source)) {
        const tgt = nodeById.get(link.target)
        if (tgt?.kind === 'ghost') visible.add(link.target)
      }
      if (visible.has(link.target)) {
        const src = nodeById.get(link.source)
        if (src?.kind === 'ghost') visible.add(link.source)
      }
    }
    return visible
  }, [nodes, graph.links, enabledTagSet, nodeById])

  const visibleNodeIdsRef = useRef(visibleNodeIds)
  useEffect(() => {
    visibleNodeIdsRef.current = visibleNodeIds
  }, [visibleNodeIds])

  const dimsRef = useRef({ w: 0, h: 0 })
  const [canvasHeight, setCanvasHeight] = useState(0)

  // Core draw function — reads all state from refs
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { w, h } = dimsRef.current
    if (w === 0 || h === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const dark = isDarkRef.current
    const transform = transformRef.current
    const visibleIds = visibleNodeIdsRef.current
    const hoveredId = hoverNodeIdRef.current
    const focusedId = focusedNodeIdRef.current
    const colorMap = tagColorMapRef.current
    const enabledSet = enabledTagSetRef.current
    const neighbors = neighborsByNodeIdRef.current

    const sim = simRef.current
    if (!sim) return
    const simNodes = sim.nodes()
    const simLinks = simLinksRef.current

    const neighborIds: Set<string> = hoveredId
      ? (neighbors.get(hoveredId) ?? new Set())
      : new Set()

    // Background clear
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = dark ? '#09090b' : '#fafafa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Apply DPR + pan + zoom, centered on canvas midpoint
    const cx = (w / 2) * dpr
    const cy = (h / 2) * dpr
    ctx.setTransform(
      transform.k * dpr,
      0,
      0,
      transform.k * dpr,
      cx + transform.x * dpr,
      cy + transform.y * dpr,
    )

    // Draw links
    for (const link of simLinks) {
      const src = link.source as SimNode
      const tgt = link.target as SimNode
      if (
        typeof src !== 'object' ||
        typeof tgt !== 'object' ||
        !visibleIds.has(src.id) ||
        !visibleIds.has(tgt.id)
      )
        continue

      const isHighlighted =
        !hoveredId || src.id === hoveredId || tgt.id === hoveredId

      ctx.beginPath()
      ctx.moveTo(src.x ?? 0, src.y ?? 0)
      ctx.lineTo(tgt.x ?? 0, tgt.y ?? 0)
      ctx.strokeStyle = isHighlighted
        ? dark
          ? 'rgba(212,212,216,0.6)'
          : 'rgba(63,63,70,0.45)'
        : dark
          ? 'rgba(82,82,91,0.12)'
          : 'rgba(113,113,122,0.12)'
      ctx.lineWidth = isHighlighted ? 1.5 : 0.7
      ctx.stroke()
    }

    // Draw nodes
    for (const node of simNodes) {
      if (!visibleIds.has(node.id)) continue
      const x = node.x ?? 0
      const y = node.y ?? 0
      const r = nodeRadius(node)
      const isHighlighted =
        !hoveredId || node.id === hoveredId || neighborIds.has(node.id)
      const isFocused = focusedId === node.id
      const alpha = isHighlighted ? 1 : 0.15

      let fillColor: string
      if (node.kind === 'ghost') {
        fillColor = dark ? '#52525b' : '#a1a1aa'
      } else {
        const matchingTag =
          node.tags.find((t) => enabledSet.has(t)) ?? node.tags[0]
        const fallback = dark ? '#60a5fa' : '#2563eb'
        fillColor = matchingTag
          ? (colorMap.get(matchingTag) ?? fallback)
          : fallback
      }

      ctx.save()
      ctx.globalAlpha = alpha

      if (node.kind === 'ghost') {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fillStyle = fillColor
        ctx.fill()
        ctx.setLineDash([2, 2])
        ctx.strokeStyle = dark ? '#71717a' : '#a1a1aa'
        ctx.lineWidth = 1 / transform.k
        ctx.stroke()
        ctx.setLineDash([])
      } else {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fillStyle = fillColor
        ctx.fill()
      }

      if (isFocused) {
        ctx.beginPath()
        ctx.arc(x, y, r + 3.5, 0, 2 * Math.PI)
        ctx.strokeStyle = dark ? '#f8fafc' : '#0f172a'
        ctx.lineWidth = 1.8 / transform.k
        ctx.stroke()
      }

      ctx.restore()

      // Labels: show on hover, focus, or high zoom
      const showLabel =
        isFocused || node.id === hoveredId || transform.k > 2.2
      if (!showLabel) continue

      const fontSize = Math.max(11, 14 / transform.k)
      const text = node.kind === 'ghost' ? node.slug : node.label
      const textX = x + r + 3
      const textY = y

      ctx.save()
      ctx.font = `${fontSize}px var(--font-pretendard, sans-serif)`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      const textWidth = ctx.measureText(text).width
      ctx.fillStyle = dark ? 'rgba(9,9,11,0.85)' : 'rgba(255,255,255,0.85)'
      ctx.fillRect(textX - 2, textY - fontSize * 0.65, textWidth + 4, fontSize * 1.3)
      ctx.fillStyle = dark ? '#f4f4f5' : '#18181b'
      ctx.fillText(text, textX, textY)
      ctx.restore()
    }
  }, []) // No deps — reads everything from refs

  const drawRef = useRef(draw)
  useEffect(() => {
    drawRef.current = draw
  }, [draw])

  // Redraw when theme, tags, or color map changes (simulation may be idle)
  useEffect(() => {
    drawRef.current()
  }, [isDark, visibleNodeIds, tagColorMap])

  // Setup d3-force simulation
  useEffect(() => {
    const nodesCopy: SimNode[] = nodes.map((n) => ({ ...n }))
    const linksCopy: SimLink[] = links.map((l) => ({ ...l }))
    simLinksRef.current = linksCopy

    const sim = forceSimulation<SimNode>(nodesCopy)
      .force(
        'link',
        forceLink<SimNode, SimLink>(linksCopy)
          .id((d) => d.id)
          .distance(40)
          .strength(0.6),
      )
      .force('charge', forceManyBody<SimNode>().strength(-120).theta(0.9))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide<SimNode>((d) => nodeRadius(d) + 2))
      .velocityDecay(0.22)

    simRef.current = sim

    sim.on('tick', () => {
      const visibleIds = visibleNodeIdsRef.current
      qtRef.current = quadtree<SimNode>()
        .x((d) => d.x ?? 0)
        .y((d) => d.y ?? 0)
        .addAll(nodesCopy.filter((n) => visibleIds.has(n.id)))
      drawRef.current()
    })

    return () => {
      sim.stop()
      simRef.current = null
    }
  }, [nodes, links])

  // Canvas setup: dimensions, zoom (wheel), pan, drag, hover, click
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const updateDims = () => {
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const footer = document.querySelector('footer')
      const footerBox = footer?.getBoundingClientRect()
      const footerReserve =
        (footerBox?.height ?? 52) +
        // layout: footer mt-24 — 캔버스 아래에 남겨 둘 여백(패딩은 페이지에서 최소화)
        96 +
        4
      const h = Math.max(
        320,
        window.innerHeight - rect.top - footerReserve,
      )
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      dimsRef.current = { w, h }
      setCanvasHeight(h)
      drawRef.current()
    }

    updateDims()
    const ro = new ResizeObserver(updateDims)
    ro.observe(container)

    // Helper: convert client coords → simulation coords
    const toSim = (clientX: number, clientY: number) => {
      const { w, h } = dimsRef.current
      const rect = canvas.getBoundingClientRect()
      const t = transformRef.current
      const px = clientX - rect.left - w / 2
      const py = clientY - rect.top - h / 2
      return { sx: (px - t.x) / t.k, sy: (py - t.y) / t.k }
    }

    // Hit-test: find node near sim coords
    const findNodeAt = (sx: number, sy: number): SimNode | null => {
      const qt = qtRef.current
      if (!qt) return null
      const searchR = 20 / transformRef.current.k
      const found = qt.find(sx, sy, searchR)
      if (!found) return null
      const dx = (found.x ?? 0) - sx
      const dy = (found.y ?? 0) - sy
      if (
        Math.sqrt(dx * dx + dy * dy) <=
        nodeRadius(found) + 4 / transformRef.current.k
      )
        return found
      return null
    }

    // Wheel zoom toward cursor
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { w, h } = dimsRef.current
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left - w / 2
      const my = e.clientY - rect.top - h / 2
      const t = transformRef.current
      const delta = -e.deltaY * (e.deltaMode === 1 ? 40 : 1) * 0.001
      const newK = Math.max(
        SCALE_EXTENT[0],
        Math.min(SCALE_EXTENT[1], t.k * Math.exp(delta)),
      )
      const ratio = newK / t.k
      transformRef.current = {
        x: mx - ratio * (mx - t.x),
        y: my - ratio * (my - t.y),
        k: newK,
      }
      drawRef.current()
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current && dragNodeRef.current) {
        const { sx, sy } = toSim(e.clientX, e.clientY)
        dragNodeRef.current.fx = sx
        dragNodeRef.current.fy = sy
        simRef.current?.alphaTarget(0.3).restart()
        return
      }

      if (isPanningRef.current && panStartRef.current) {
        const { w, h } = dimsRef.current
        const rect = canvas.getBoundingClientRect()
        const px = e.clientX - rect.left - w / 2
        const py = e.clientY - rect.top - h / 2
        transformRef.current = {
          ...transformRef.current,
          x: panStartRef.current.tx + (px - panStartRef.current.px),
          y: panStartRef.current.ty + (py - panStartRef.current.py),
        }
        drawRef.current()
        return
      }

      const { sx, sy } = toSim(e.clientX, e.clientY)
      const found = findNodeAt(sx, sy)
      const newId = found?.id ?? null
      if (newId !== hoverNodeIdRef.current) {
        hoverNodeIdRef.current = newId
        canvas.style.cursor = newId ? 'pointer' : 'grab'
        drawRef.current()
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      canvas.setPointerCapture(e.pointerId)
      const { sx, sy } = toSim(e.clientX, e.clientY)
      const found = findNodeAt(sx, sy)
      if (found && visibleNodeIdsRef.current.has(found.id)) {
        isDraggingRef.current = true
        dragNodeRef.current = found
        found.fx = found.x
        found.fy = found.y
        canvas.style.cursor = 'grabbing'
      } else {
        isPanningRef.current = true
        const { w, h } = dimsRef.current
        const rect = canvas.getBoundingClientRect()
        panStartRef.current = {
          px: e.clientX - rect.left - w / 2,
          py: e.clientY - rect.top - h / 2,
          tx: transformRef.current.x,
          ty: transformRef.current.y,
        }
        canvas.style.cursor = 'grabbing'
      }
    }

    const handlePointerUp = () => {
      if (isDraggingRef.current && dragNodeRef.current) {
        dragNodeRef.current.fx = null
        dragNodeRef.current.fy = null
        simRef.current?.alphaTarget(0).restart()
        dragNodeRef.current = null
      }
      isDraggingRef.current = false
      isPanningRef.current = false
      panStartRef.current = null
      canvas.style.cursor = hoverNodeIdRef.current ? 'pointer' : 'grab'
    }

    const handleClick = (e: MouseEvent) => {
      if (isDraggingRef.current) return
      const { sx, sy } = toSim(e.clientX, e.clientY)
      const found = findNodeAt(sx, sy)
      if (found) {
        if (found.kind === 'wiki') router.push(`/wiki/${found.slug}`)
        focusedNodeIdRef.current = found.id
      } else {
        focusedNodeIdRef.current = null
        setSearchMessage('')
      }
      drawRef.current()
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('click', handleClick)
    canvas.style.cursor = 'grab'

    return () => {
      ro.disconnect()
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('click', handleClick)
    }
  }, [router])

  const focusWikiFromPick = useCallback((item: WikiSearchItem | null) => {
    if (!item) return
    const sim = simRef.current
    if (!sim) return

    const target = sim
      .nodes()
      .find((n) => n.id === item.id && n.kind === 'wiki')
    if (!target) {
      setSearchMessage('노드를 찾지 못했습니다.')
      return
    }

    if (!visibleNodeIdsRef.current.has(target.id)) {
      setEnabledTags((prev) => [...new Set([...prev, ...item.tags])])
    }

    focusedNodeIdRef.current = target.id
    setSearchMessage(`"${target.label}" 노드로 이동했습니다.`)

    const targetK = 3.5
    const targetX = -(target.x ?? 0) * targetK
    const targetY = -(target.y ?? 0) * targetK
    const start = { ...transformRef.current }
    const startTime = performance.now()
    const duration = 500

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = easeInOut(progress)
      transformRef.current = {
        x: start.x + (targetX - start.x) * eased,
        y: start.y + (targetY - start.y) * eased,
        k: start.k + (targetK - start.k) * eased,
      }
      drawRef.current()
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [])

  return (
    <div ref={containerRef} className="relative -mx-4">
      <div
        className="relative w-full border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
        style={{
          height:
            canvasHeight > 0
              ? `${canvasHeight}px`
              : 'min(52dvh, calc(100dvh - 14rem))',
        }}
      >
        <canvas ref={canvasRef} className="block" />

        <div className="absolute top-3 left-1/2 z-10 w-[min(92vw,15.5rem)] -translate-x-1/2">
          <Combobox
            items={wikiSearchItems}
            filter={wikiFilter}
            itemToStringLabel={(doc) => doc.label}
            isItemEqualToValue={(a, b) => a.id === b.id}
            onValueChange={(doc) => focusWikiFromPick(doc)}
            autoHighlight
          >
            <ComboboxInput
              aria-label="Wiki graph 문서 검색"
              placeholder="문서 검색…"
              showTrigger
              showClear
              className="h-7 w-full min-w-0 rounded-full border-zinc-300/90 bg-white/92 text-xs shadow-sm backdrop-blur-md dark:border-zinc-700/90 dark:bg-zinc-900/88 [&_input]:placeholder:text-zinc-400 dark:[&_input]:placeholder:text-zinc-500"
            />
            <ComboboxContent className="rounded-xl border-zinc-200/90 dark:border-zinc-800/90">
              <ComboboxEmpty className="text-xs">
                일치하는 문서가 없습니다
              </ComboboxEmpty>
              <ComboboxList className="max-h-[min(40dvh,12rem)]">
                {(doc: WikiSearchItem) => (
                  <ComboboxItem key={doc.id} value={doc}>
                    <span className="min-w-0 flex-1 truncate">{doc.label}</span>
                    <span className="max-w-[40%] shrink-0 truncate text-[10px] text-muted-foreground">
                      {doc.slug}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="absolute right-4 bottom-4 z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-full border-zinc-300/90 bg-white/92 shadow-sm backdrop-blur-md dark:border-zinc-700/90 dark:bg-zinc-900/88"
                aria-label="태그 필터 열기"
              >
                <Tags className="size-4 text-zinc-600 dark:text-zinc-300" />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[min(85dvh,28rem)] flex-col gap-0 sm:max-w-sm">
              <DialogHeader className="shrink-0 space-y-3 text-left">
                <div className="pr-8">
                  <DialogTitle>태그 필터</DialogTitle>
                  <DialogDescription>
                    그래프에 표시할 문서 태그를 선택합니다.
                  </DialogDescription>
                </div>
                <div className="flex flex-wrap gap-1.5 pr-8">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-7 text-[10px]"
                    onClick={() => setEnabledTags(tags)}
                  >
                    전체
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-7 text-[10px]"
                    onClick={() => setEnabledTags([])}
                  >
                    해제
                  </Button>
                </div>
              </DialogHeader>
              <ul className="no-scrollbar mt-1 max-h-[min(50vh,18rem)] flex-1 space-y-0.5 overflow-y-auto overscroll-contain py-1">
                {tags.map((tag) => {
                  const checked = enabledTagSet.has(tag)
                  const color = tagColorMap.get(tag) ?? '#2563eb'
                  return (
                    <li key={tag}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                            setEnabledTags((prev) =>
                              next
                                ? [...new Set([...prev, tag])]
                                : prev.filter((t) => t !== tag),
                            )
                          }}
                          className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                        />
                        <span
                          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                          aria-hidden
                        />
                        <span>#{tag}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bottom-left controls */}
        <div className="absolute left-4 bottom-4 z-10 flex flex-col items-start gap-2">
          {searchMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-zinc-300 bg-white/95 px-3 py-2 text-xs text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-200"
            >
              {searchMessage}
            </div>
          )}
          <Link
            href="/wiki"
            className="rounded-full border border-zinc-300 bg-white/90 px-3 py-1.5 text-xs text-zinc-600 backdrop-blur transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/85 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            문서 리스트로 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
