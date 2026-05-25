// src/modules/trees/TreesPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { TreeStepRecorder } from '@/engine/TreeStepRecorder'
import { CodeView }         from '@/components/CodeView'
import { DebuggerControls } from '@/components/DebuggerControls'
import { treesModule } from './index'
import { TreeRenderer } from './TreeRenderer'
import type { TreeSnapshot, TreeNode } from '@/types/TreeSnapshot'

const DEFAULT_NODES: TreeNode[] = [
  { id: 0, val: 50, x: 0.5,   y: 0.15, parentId: null, leftId: 1,    rightId: 2 },
  { id: 1, val: 30, x: 0.25,  y: 0.35, parentId: 0,    leftId: 3,    rightId: 4 },
  { id: 2, val: 70, x: 0.75,  y: 0.35, parentId: 0,    leftId: 5,    rightId: 6 },
  { id: 3, val: 15, x: 0.125, y: 0.55, parentId: 1,    leftId: null, rightId: null },
  { id: 4, val: 40, x: 0.375, y: 0.55, parentId: 1,    leftId: null, rightId: null },
  { id: 5, val: 60, x: 0.625, y: 0.55, parentId: 2,    leftId: null, rightId: null },
  { id: 6, val: 85, x: 0.875, y: 0.55, parentId: 2,    leftId: null, rightId: null }
]

function getDelay(speed: number): number {
  return Math.floor(Math.pow(10, (100 - speed) / 25))
}

export default function TreesPage() {
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

  const [algoId, setAlgoId]     = useState(treesModule.defaultAlgoId)
  const [nodes, setNodes]       = useState<TreeNode[]>(DEFAULT_NODES)
  const [rootId, setRootId]     = useState<number | null>(0)
  const [inputValue, setInputValue] = useState(25)
  const [seed, setSeed]         = useState(0)

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<TreeRenderer | null>(null)

  const activeAlgo = treesModule.algorithms.find((a) => a.id === algoId) ?? treesModule.algorithms[0]

  const editorSnapshot = useMemo<TreeSnapshot>(() => {
    return {
      nodes,
      activeNode: null,
      visited: {},
      traversalOutput: [],
      pointers: { curr: null, parent: null },
      activeEdge: null,
      queue: [],
      opCount: { comparisons: 0, operations: 0 },
      codeLine: 0,
      description: 'Interact with BST operations. Press Play to animate.',
    }
  }, [nodes])

  useEffect(() => {
    if (!canvasRef.current) return
    rendererRef.current = new TreeRenderer(canvasRef.current)
    rendererRef.current.resize()
    const onResize = () => rendererRef.current?.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      rendererRef.current?.destroy()
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!rendererRef.current) return
    const snap = (steps[currentStep] as TreeSnapshot | undefined) ?? editorSnapshot
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
    const r = new TreeStepRecorder()
    activeAlgo.record({ nodes, rootId, valToOperate: inputValue }, r)
    loadSteps(r.getSteps())
  }, [activeAlgo, nodes, rootId, inputValue, loadSteps])

  useEffect(() => {
    resetDebugger()
    recordSteps()
  }, [algoId, seed, recordSteps, resetDebugger])

  const handleApplyOperation = () => {
    // If the operation is "insert", we apply the final result of insertion to nodes state
    if (algoId === 'insert') {
      const r = new TreeStepRecorder()
      activeAlgo.record({ nodes, rootId, valToOperate: inputValue }, r)
      const finalStep = r.getSteps().at(-1)
      if (finalStep) {
        setNodes([...finalStep.nodes])
        if (rootId === null && finalStep.nodes.length > 0) {
          setRootId(finalStep.nodes[0].id)
        }
      }
    }
    setSeed(s => s + 1)
  }

  const handleResetPresets = () => {
    setNodes(DEFAULT_NODES)
    setRootId(0)
    setSeed(s => s + 1)
  }

  const handleClear = () => {
    setNodes([])
    setRootId(null)
    setSeed(s => s + 1)
  }

  const activeSnap = (steps[currentStep] as TreeSnapshot | undefined)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Visual top controls bar */}
      <div
        className="flex flex-wrap items-center gap-4 px-6 py-3 shrink-0 glass-panel border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Operation</span>
          <select
            value={algoId}
            onChange={(e) => setAlgoId(e.target.value)}
            disabled={isPlaying}
            className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500"
          >
            {treesModule.algorithms.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {(algoId === 'insert' || algoId === 'search') && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Value</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              disabled={isPlaying}
              className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg w-16 px-2 py-1 text-center"
            />
            <button
              onClick={handleApplyOperation}
              disabled={isPlaying || (algoId === 'insert' && nodes.length >= 15)}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/20 text-xs font-medium rounded-lg text-white"
            >
              {algoId === 'insert' ? 'Insert Node' : 'Simulate Search'}
            </button>
          </div>
        )}

        <div className="h-6 w-[1px] bg-white/10" />

        <div className="flex items-center gap-2">
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
            Clear Tree
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
        {activeSnap && (
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span>
              Comparisons: <span className="text-amber-400 font-bold">{activeSnap.opCount.comparisons}</span>
            </span>
            <span>
              Operations: <span className="text-emerald-400 font-bold">{activeSnap.opCount.operations}</span>
            </span>
            {activeSnap.traversalOutput.length > 0 && (
              <span className="text-zinc-500">
                Traversal Path: <span className="text-cyan-400 font-semibold">{`[ ${activeSnap.traversalOutput.join(', ')} ]`}</span>
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
            className="absolute inset-0 touch-none"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Recursion Stack overlay (Wow Factor!) */}
          {activeSnap && (algoId === 'inorder' || algoId === 'preorder' || algoId === 'postorder') && activeSnap.queue.length > 0 && (
            <div className="absolute top-4 right-4 bg-zinc-950/90 border border-white/10 p-4 rounded-2xl w-48 shadow-2xl glass-panel animate-in fade-in slide-in-from-right duration-300 z-20">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Recursion Stack
              </h3>
              <div className="flex flex-col-reverse gap-2 max-h-56 overflow-y-auto">
                {activeSnap.queue.map((nodeId, idx) => {
                  const nodeVal = nodes.find(n => n.id === nodeId)?.val ?? nodeId
                  return (
                    <div 
                      key={idx}
                      className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 rounded-xl flex items-center justify-between"
                      style={{ animation: 'slide-in-from-bottom 0.15s ease-out' }}
                    >
                      <span>{`Traverse( ${nodeVal} )`}</span>
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
