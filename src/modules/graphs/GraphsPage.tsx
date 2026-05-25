// src/modules/graphs/GraphsPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { GraphStepRecorder } from '@/engine/GraphStepRecorder'
import { CodeView }         from '@/components/CodeView'
import { DebuggerControls } from '@/components/DebuggerControls'
import { graphsModule } from './index'
import { GraphRenderer } from './GraphRenderer'
import type { GraphSnapshot, Vertex, Edge } from '@/types/GraphSnapshot'

const DEFAULT_VERTICES: Vertex[] = [
  { id: 0, label: 'A', x: 0.2,  y: 0.3 },
  { id: 1, label: 'B', x: 0.5,  y: 0.2 },
  { id: 2, label: 'C', x: 0.8,  y: 0.3 },
  { id: 3, label: 'D', x: 0.25, y: 0.7 },
  { id: 4, label: 'E', x: 0.5,  y: 0.8 },
  { id: 5, label: 'F', x: 0.75, y: 0.7 }
]

const DEFAULT_EDGES: Edge[] = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 3, weight: 2 },
  { from: 1, to: 2, weight: 5 },
  { from: 1, to: 4, weight: 1 },
  { from: 2, to: 5, weight: 3 },
  { from: 3, to: 4, weight: 8 },
  { from: 4, to: 5, weight: 6 },
  { from: 3, to: 1, weight: 3 }
]

function getDelay(speed: number): number {
  return Math.floor(Math.pow(10, (100 - speed) / 25))
}

export default function GraphsPage() {
  const speed          = useAlgoStore((s) => s.speed)
  const setIsRunning   = useAlgoStore((s) => s.setIsRunning)
  const showCodeView   = useSettingsStore((s) => s.showCodeView)
  const toggleCodeView = useSettingsStore((s) => s.toggleCodeView)

  const steps         = useDebuggerStore((s) => s.steps)
  const currentStep   = useDebuggerStore((s) => s.currentStep)
  const totalSteps    = useDebuggerStore((s) => s.totalSteps)
  const isPlaying     = useDebuggerStore((s) => s.isPlaying)
  const loadSteps     = useDebuggerStore((s) => s.loadSteps)
  const stepForward   = useDebuggerStore((s) => s.stepForward)
  const pause         = useDebuggerStore((s) => s.pause)
  const resetDebugger = useDebuggerStore((s) => s.reset)

  const [algoId, setAlgoId]         = useState(graphsModule.defaultAlgoId)
  const [vertices, setVertices]     = useState<Vertex[]>(DEFAULT_VERTICES)
  const [edges, setEdges]           = useState<Edge[]>(DEFAULT_EDGES)
  const [startNode, setStartNode]   = useState(0)
  const [seed, setSeed]             = useState(0)

  // Edge editing panel inputs
  const [newFrom, setNewFrom]       = useState(0)
  const [newTo, setNewTo]           = useState(1)
  const [newWeight, setNewWeight]   = useState(5)

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<GraphRenderer | null>(null)
  
  // Dragging states
  const isDragging = useRef(false)
  const draggedNodeId = useRef<number | null>(null)

  const activeAlgo = graphsModule.algorithms.find((a) => a.id === algoId) ?? graphsModule.algorithms[0]

  const editorSnapshot = useMemo<GraphSnapshot>(() => {
    const dists: Record<number, number> = {}
    for (const v of vertices) dists[v.id] = v.id === startNode ? 0 : Infinity
    return {
      vertices, edges,
      visited: {},
      activeNode: null,
      activeEdge: null,
      visitOrder: {},
      parent: {},
      path: [],
      queue: [],
      distance: dists,
      opCount: { comparisons: 0, operations: 0 },
      codeLine: 0,
      description: 'Drag vertices to position. Press Play to start simulation.',
    }
  }, [vertices, edges, startNode])

  useEffect(() => {
    if (!canvasRef.current) return
    rendererRef.current = new GraphRenderer(canvasRef.current)
    return () => {
      rendererRef.current?.destroy()
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!rendererRef.current) return
    const snap = (steps[currentStep] as GraphSnapshot | undefined) ?? editorSnapshot
    rendererRef.current.updateSnapshot(snap)
  }, [steps, currentStep, editorSnapshot])

  useEffect(() => { setIsRunning(isPlaying) }, [isPlaying, setIsRunning])

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= totalSteps - 1) { pause(); return }
    const id = setTimeout(stepForward, getDelay(speed))
    return () => clearTimeout(id)
  }, [isPlaying, currentStep, totalSteps, speed, stepForward, pause])

  const recordSteps = useCallback(() => {
    const r = new GraphStepRecorder()
    activeAlgo.record({ vertices, edges, startNode }, r)
    loadSteps(r.getSteps())
  }, [activeAlgo, vertices, edges, startNode, loadSteps])

  useEffect(() => {
    resetDebugger()
    recordSteps()
  }, [algoId, seed, recordSteps, resetDebugger])

  // Mouse Dragging Node Handler
  const getNodeAtPointer = useCallback((ev: React.PointerEvent<HTMLCanvasElement>): number | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const px = (ev.clientX - rect.left) / rect.width
    const py = (ev.clientY - rect.top) / rect.height

    const threshold = 0.04 // radius threshold (4% of canvas size)
    for (const node of vertices) {
      const dx = node.x - px
      const dy = node.y - py
      if (Math.sqrt(dx * dx + dy * dy) < threshold) {
        return node.id
      }
    }
    return null
  }, [vertices])

  const onPointerDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPlaying) return
    const nodeId = getNodeAtPointer(ev)
    if (nodeId !== null) {
      isDragging.current = true
      draggedNodeId.current = nodeId
      canvasRef.current?.setPointerCapture(ev.pointerId)
    }
  }

  const onPointerMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || draggedNodeId.current === null) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = Math.max(0.05, Math.min(0.95, (ev.clientX - rect.left) / rect.width))
    const py = Math.max(0.05, Math.min(0.95, (ev.clientY - rect.top) / rect.height))

    setVertices(prev => prev.map(v => v.id === draggedNodeId.current ? { ...v, x: px, y: py } : v))
  }

  const onPointerUp = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      isDragging.current = false
      draggedNodeId.current = null
      canvasRef.current?.releasePointerCapture(ev.pointerId)
      setSeed(s => s + 1) // trigger recalculation of paths
    }
  }

  const handleAddEdge = () => {
    if (newFrom === newTo) return
    // Check if edge already exists
    const exists = edges.some(e => 
      (e.from === newFrom && e.to === newTo) || 
      (e.from === newTo && e.to === newFrom)
    )
    if (exists) return

    setEdges(prev => [...prev, { from: newFrom, to: newTo, weight: newWeight }])
    setSeed(s => s + 1)
  }

  const handleAddNode = () => {
    if (vertices.length >= 10) return // limit size
    const nextId = vertices.length === 0 ? 0 : Math.max(...vertices.map(v => v.id)) + 1
    const label = String.fromCharCode(65 + nextId) // A, B, C...
    const rx = 0.2 + Math.random() * 0.6
    const ry = 0.2 + Math.random() * 0.6

    setVertices(prev => [...prev, { id: nextId, label, x: rx, y: ry }])
    setSeed(s => s + 1)
  }

  const handleClear = () => {
    setVertices([])
    setEdges([])
    setSeed(s => s + 1)
  }

  const handleResetPresets = () => {
    setVertices(DEFAULT_VERTICES)
    setEdges(DEFAULT_EDGES)
    setStartNode(0)
    setSeed(s => s + 1)
  }

  const activeSnap = (steps[currentStep] as GraphSnapshot | undefined)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Visual top controls bar */}
      <div
        className="flex flex-wrap items-center gap-4 px-6 py-3 shrink-0 glass-panel border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Algorithm</span>
          <select
            value={algoId}
            onChange={(e) => setAlgoId(e.target.value)}
            disabled={isPlaying}
            className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500"
          >
            {graphsModule.algorithms.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Start</span>
          <select
            value={startNode}
            onChange={(e) => {
              setStartNode(Number(e.target.value))
              setSeed(s => s + 1)
            }}
            disabled={isPlaying || vertices.length === 0}
            className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 w-16"
          >
            {vertices.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>

        <div className="h-6 w-[1px] bg-white/10" />

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNode}
            disabled={isPlaying || vertices.length >= 10}
            className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-700 border border-zinc-700/40 text-xs font-medium rounded-lg disabled:opacity-30 text-zinc-200"
          >
            + Node
          </button>
          <button
            onClick={handleResetPresets}
            disabled={isPlaying}
            className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-700 border border-zinc-700/40 text-xs font-medium rounded-lg text-zinc-200"
          >
            Reset Preset
          </button>
          <button
            onClick={handleClear}
            disabled={isPlaying}
            className="px-3 py-1.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-xs font-medium rounded-lg text-red-400"
          >
            Clear All
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={toggleCodeView}
          className="text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all"
          style={{
            background: showCodeView ? 'rgba(99,102,241,0.15)' : 'var(--color-bg-surface)',
            borderColor: showCodeView ? 'var(--color-primary)' : 'var(--color-border)',
            color: showCodeView ? '#a5b4fc' : 'var(--color-text-muted)',
          }}
        >
          <span>&lt;/&gt;</span>
          <span>Code View</span>
        </button>
      </div>

      {/* Editor & Configuration overlay bar */}
      {!isPlaying && vertices.length > 1 && (
        <div className="flex flex-wrap items-center gap-4 px-6 py-2 shrink-0 bg-white/5 border-b border-white/5 text-xs text-zinc-400 select-none">
          <div className="flex items-center gap-2">
            <span>Connect Edges:</span>
            <select
              value={newFrom}
              onChange={(e) => setNewFrom(Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded px-1.5 py-0.5"
            >
              {vertices.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
            <span>to</span>
            <select
              value={newTo}
              onChange={(e) => setNewTo(Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded px-1.5 py-0.5"
            >
              {vertices.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
            <span>Weight:</span>
            <input
              type="number" min={1} max={99} value={newWeight}
              onChange={(e) => setNewWeight(Math.max(1, Number(e.target.value)))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded w-12 px-1.5 py-0.5 text-center"
            />
            <button
              onClick={handleAddEdge}
              className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded font-medium ml-1"
            >
              Add Edge
            </button>
          </div>
        </div>
      )}

      {/* Visual status bar */}
      <div
        className="flex items-center gap-6 px-6 py-2.5 shrink-0 bg-white/5 border-b border-white/5"
      >
        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
          {activeAlgo.timeComplexity.average}
        </span>
        <span className="text-xs font-mono font-medium text-zinc-500">
          Space: {activeAlgo.spaceComplexity}
        </span>
        {activeSnap && 'queue' in activeSnap && (
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span>
              Comparisons: <span className="text-amber-400 font-bold">{activeSnap.opCount.comparisons}</span>
            </span>
            <span>
              Operations: <span className="text-emerald-400 font-bold">{activeSnap.opCount.operations}</span>
            </span>
            {activeSnap.queue && activeSnap.queue.length > 0 && (
              <span className="text-zinc-500">
                Active Structure: <span className="text-cyan-400 font-semibold">{`[${activeSnap.queue.map(id => vertices.find(v => v.id === id)?.label ?? id).join(', ')}]`}</span>
              </span>
            )}
          </div>
        )}
        <div className="flex-1" />
        <DebuggerControls />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas panel */}
        <div className="flex-1 relative overflow-hidden bg-zinc-950/40">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-move touch-none"
            style={{ width: '100%', height: '100%' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />

          {/* Recursion Stack overlay (Wow Factor!) */}
          {activeSnap && 'queue' in activeSnap && algoId === 'dfs' && activeSnap.queue && activeSnap.queue.length > 0 && (
            <div className="absolute top-4 right-4 bg-zinc-950/90 border border-white/10 p-4 rounded-2xl w-48 shadow-2xl glass-panel animate-in fade-in slide-in-from-right duration-300 z-20">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Recursion Stack
              </h3>
              <div className="flex flex-col-reverse gap-2 max-h-56 overflow-y-auto">
                {activeSnap.queue.map((nodeId, idx) => {
                  const nodeLabel = vertices.find(v => v.id === nodeId)?.label ?? nodeId
                  return (
                    <div 
                      key={idx}
                      className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 rounded-xl flex items-center justify-between"
                      style={{ animation: 'slide-in-from-bottom 0.15s ease-out' }}
                    >
                      <span>{`DFS( ${nodeLabel} )`}</span>
                      <span className="text-[9px] text-indigo-500 font-mono">{`#${idx}`}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Overlay state description */}
          <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/80 border border-white/5 px-4 py-3 rounded-xl select-none pointer-events-none">
            <p className="text-xs text-zinc-400 font-medium">
              {activeSnap?.description ?? editorSnapshot.description}
            </p>
          </div>
        </div>

        {/* Code panel */}
        {showCodeView && (
          <div
            className="flex flex-col shrink-0 overflow-hidden"
            style={{ width: 280, borderLeft: '1px solid var(--color-border)' }}
          >
            <div className="flex-1 overflow-hidden min-h-0">
              <CodeView snippets={activeAlgo.codeSnippets} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
