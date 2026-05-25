// src/modules/pathfinding/PathfindingPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { GridStepRecorder } from '@/engine/GridStepRecorder'
import { CodeView }         from '@/components/CodeView'
import { DebuggerControls } from '@/components/DebuggerControls'
import { ShareButton }      from '@/components/ShareButton'
import { GridControls, type EditMode } from '@/components/GridControls'
import { CELL } from '@/types/GridSnapshot'
import type { GridSnapshot } from '@/types/GridSnapshot'
import { pathfindingModule } from './index'
import { GridRenderer } from './GridRenderer'

function getDelay(speed: number): number {
  return Math.floor(Math.pow(10, (100 - speed) / 25))
}

function makeInitialCells(w: number, h: number): { cells: Uint8Array; start: number; end: number } {
  const cells = new Uint8Array(w * h).fill(CELL.OPEN)
  const start = Math.floor(h / 2) * w + Math.floor(w / 4)
  const end   = Math.floor(h / 2) * w + Math.floor(w * 3 / 4)
  cells[start] = CELL.START
  cells[end]   = CELL.END
  return { cells, start, end }
}

export default function PathfindingPage() {
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

  const { width: w, height: h } = pathfindingModule.defaultGrid
  const [algoId, setAlgoId]     = useState(pathfindingModule.defaultAlgoId)
  const [editMode, setEditMode] = useState<EditMode>('wall')
  const [heatMap, setHeatMap]   = useState(false)
  const [seed, setSeed]         = useState(0)

  const editorRef  = useRef<{ cells: Uint8Array; start: number; end: number }>(makeInitialCells(w, h))
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<GridRenderer | null>(null)
  const isPainting = useRef(false)

  const activeAlgo = pathfindingModule.algorithms.find((a) => a.id === algoId)
    ?? pathfindingModule.algorithms[0]

  const editorSnapshot = useMemo<GridSnapshot>(() => {
    const ed = editorRef.current
    return {
      width: w, height: h,
      cells: new Uint8Array(ed.cells),
      start: ed.start, end: ed.end,
      visitOrder: new Int32Array(w * h).fill(-1),
      opCount: { cellsVisited: 0, pathLength: 0 },
      codeLine: 0,
      description: 'Edit the grid, then press Play',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, w, h])

  useEffect(() => {
    if (!canvasRef.current) return
    rendererRef.current = new GridRenderer(canvasRef.current)
    rendererRef.current.resize()
    rendererRef.current.heatMapEnabled = heatMap
    const onResize = () => rendererRef.current?.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      rendererRef.current?.destroy()
      rendererRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!rendererRef.current) return
    rendererRef.current.heatMapEnabled = heatMap
    const snap = (steps[currentStep] as GridSnapshot | undefined) ?? editorSnapshot
    rendererRef.current.updateSnapshot(snap)
  }, [steps, currentStep, editorSnapshot, heatMap])

  useEffect(() => { setIsRunning(isPlaying) }, [isPlaying, setIsRunning])

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= totalSteps - 1) { pause(); return }
    const id = setTimeout(stepForward, getDelay(speed))
    return () => clearTimeout(id)
  }, [isPlaying, currentStep, totalSteps, speed, stepForward, pause])

  const recordSteps = useCallback(() => {
    const ed = editorRef.current
    const r = new GridStepRecorder()
    activeAlgo.record({ width: w, height: h, cells: new Uint8Array(ed.cells), start: ed.start, end: ed.end }, r)
    loadSteps(r.getSteps())
  }, [activeAlgo, w, h, loadSteps])

  useEffect(() => {
    resetDebugger()
    recordSteps()
  }, [algoId, seed, recordSteps, resetDebugger])

  const cellAtPointer = useCallback((ev: React.PointerEvent<HTMLCanvasElement>): number | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor(((ev.clientX - rect.left) / rect.width) * w)
    const y = Math.floor(((ev.clientY - rect.top) / rect.height) * h)
    if (x < 0 || y < 0 || x >= w || y >= h) return null
    return y * w + x
  }, [w, h])

  const applyEdit = useCallback((idx: number) => {
    const ed = editorRef.current
    if (idx === ed.start || idx === ed.end) {
      if (editMode !== 'start' && editMode !== 'end') return
    }
    if (editMode === 'wall')  ed.cells[idx] = CELL.WALL
    if (editMode === 'heavy') ed.cells[idx] = CELL.HEAVY
    if (editMode === 'erase') ed.cells[idx] = CELL.OPEN
    if (editMode === 'start') {
      ed.cells[ed.start] = CELL.OPEN
      ed.start = idx
      ed.cells[idx] = CELL.START
    }
    if (editMode === 'end') {
      ed.cells[ed.end] = CELL.OPEN
      ed.end = idx
      ed.cells[idx] = CELL.END
    }
    setSeed((s) => s + 1)
  }, [editMode])

  const onPointerDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPlaying) return
    const idx = cellAtPointer(ev)
    if (idx === null) return
    isPainting.current = true
    canvasRef.current?.setPointerCapture(ev.pointerId)
    applyEdit(idx)
  }
  const onPointerMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPainting.current) return
    const idx = cellAtPointer(ev)
    if (idx !== null) applyEdit(idx)
  }
  const onPointerUp = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    isPainting.current = false
    canvasRef.current?.releasePointerCapture(ev.pointerId)
  }

  const handleGenerateMaze = useCallback((mazeId: string) => {
    const maze = pathfindingModule.mazes.find((m) => m.id === mazeId)
    if (!maze) return
    const generated = maze.generate(w, h)
    const ed = editorRef.current
    ed.cells = generated
    if (ed.cells[ed.start] === CELL.WALL) ed.start = findOpen(ed.cells, 0)
    if (ed.cells[ed.end]   === CELL.WALL) ed.end   = findOpen(ed.cells, ed.cells.length - 1, true)
    ed.cells[ed.start] = CELL.START
    ed.cells[ed.end]   = CELL.END
    setSeed((s) => s + 1)
  }, [w, h])

  const handleClear = useCallback(() => {
    editorRef.current = makeInitialCells(w, h)
    setSeed((s) => s + 1)
  }, [w, h])

  const opCount = (steps[currentStep] as GridSnapshot | undefined)?.opCount

  const ed = editorRef.current
  const sharePayload = useMemo(() => ({
    width: w, height: h, cells: new Uint8Array(ed.cells), start: ed.start, end: ed.end,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [seed, w, h])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-2 shrink-0"
        style={{ background: 'var(--color-bg-panel, #09090b)', borderBottom: '1px solid var(--color-border, #3f3f46)' }}
      >
        <GridControls
          module={pathfindingModule}
          algoId={algoId}
          onAlgoChange={setAlgoId}
          editMode={editMode}
          onEditMode={setEditMode}
          onGenerateMaze={handleGenerateMaze}
          onClear={handleClear}
          heatMap={heatMap}
          onHeatMap={setHeatMap}
          disabled={isPlaying}
        />
        <div className="flex-1" />
        <ShareButton grid={sharePayload} module="pathfinding" />
        <button
          onClick={toggleCodeView}
          className="text-xs px-2 py-1 rounded"
          style={{
            background: showCodeView ? 'rgba(99,102,241,0.15)' : 'var(--color-bg-surface, #18181b)',
            border: '1px solid var(--color-border-light, #52525b)',
            color: showCodeView ? '#a5b4fc' : 'var(--color-text-muted, #a1a1aa)',
          }}
        >
          &lt;/&gt; Code
        </button>
      </div>

      <div
        className="flex items-center gap-4 px-4 py-2 shrink-0"
        style={{ background: 'var(--color-bg-surface, #18181b)', borderBottom: '1px solid var(--color-border, #3f3f46)' }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--color-primary, #6366f1)' }}>
          {activeAlgo.timeComplexity.average}
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted, #a1a1aa)' }}>
          {activeAlgo.weighted ? 'weighted' : 'unweighted'}
        </span>
        {opCount && (
          <>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted, #a1a1aa)' }}>
              visited <span style={{ color: 'var(--color-yellow, #eab308)' }}>{opCount.cellsVisited}</span>
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted, #a1a1aa)' }}>
              path <span style={{ color: 'var(--color-green, #10b981)' }}>{opCount.pathLength}</span>
            </span>
          </>
        )}
        <div className="flex-1" />
        <DebuggerControls />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair touch-none"
            style={{ width: '100%', height: '100%' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>

        {showCodeView && (
          <div
            className="flex flex-col shrink-0 overflow-hidden"
            style={{ width: 260, borderLeft: '1px solid var(--color-border, #3f3f46)' }}
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

function findOpen(cells: Uint8Array, from: number, reverse = false): number {
  const step = reverse ? -1 : 1
  let i = from
  while (i >= 0 && i < cells.length) {
    if (cells[i] !== CELL.WALL) return i
    i += step
  }
  return 0
}
