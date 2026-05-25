// src/modules/dp/DPPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { DPStepRecorder }   from '@/engine/DPStepRecorder'
import { CodeView }         from '@/components/CodeView'
import { DebuggerControls } from '@/components/DebuggerControls'
import { dpModule } from './index'
import { DPRenderer } from './DPRenderer'
import type { DPSnapshot } from '@/types/DPSnapshot'

function getDelay(speed: number): number {
  return Math.floor(Math.pow(10, (100 - speed) / 25))
}

export default function DPPage() {
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

  const [algoId, setAlgoId]     = useState(dpModule.defaultAlgoId)
  const [strA, setStrA]         = useState('STONE')
  const [strB, setStrB]         = useState('LONGEST')
  const [capacity, setCapacity] = useState(7)
  const [coinsInput, setCoinsInput] = useState('1,2,5')
  const [seed, setSeed]         = useState(0)

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<DPRenderer | null>(null)

  const activeAlgo = dpModule.algorithms.find((a) => a.id === algoId) ?? dpModule.algorithms[0]

  const editorSnapshot = useMemo<DPSnapshot>(() => {
    let H = 5
    let W = capacity + 1
    let rowLabels = ['-']
    let colLabels = ['-']

    if (algoId === 'knapsack') {
      H = 5
      W = capacity + 1
      rowLabels = ['-', 'A(w:2,v:3)', 'B(w:3,v:4)', 'C(w:4,v:5)', 'D(w:5,v:8)']
      colLabels = Array.from({ length: W }, (_, i) => i.toString())
    } else if (algoId === 'coin_change') {
      const coins = coinsInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0)
      H = coins.length + 1
      W = capacity + 1
      rowLabels = ['-', ...coins.map(c => `Coin(${c})`)]
      colLabels = Array.from({ length: W }, (_, i) => i.toString())
    } else {
      H = strA.length + 1
      W = strB.length + 1
      rowLabels = ['-', ...strA.split('')]
      colLabels = ['-', ...strB.split('')]
    }

    const table = Array.from({ length: H }, () => Array(W).fill(0))

    return {
      table, rowLabels, colLabels,
      currentRow: null, currentCol: null,
      dependencyCells: [],
      opCount: { comparisons: 0, operations: 0 },
      codeLine: 0,
      description: 'Configure DP inputs. Press Play to animate the matrix tabulation.',
    }
  }, [algoId, strA, strB, capacity, coinsInput])

  useEffect(() => {
    if (!canvasRef.current) return
    rendererRef.current = new DPRenderer(canvasRef.current)
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
    const snap = (steps[currentStep] as DPSnapshot | undefined) ?? editorSnapshot
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
    const r = new DPStepRecorder()
    if (algoId === 'knapsack') {
      activeAlgo.record({ rowString: '', colString: capacity.toString() }, r)
    } else if (algoId === 'coin_change') {
      activeAlgo.record({ rowString: coinsInput, colString: capacity.toString() }, r)
    } else {
      activeAlgo.record({ rowString: strA, colString: strB }, r)
    }
    loadSteps(r.getSteps())
  }, [activeAlgo, algoId, strA, strB, capacity, coinsInput, loadSteps])

  useEffect(() => {
    resetDebugger()
    recordSteps()
  }, [algoId, seed, recordSteps, resetDebugger])

  const handleApplyConfig = () => {
    setSeed(s => s + 1)
  }

  const activeSnap = (steps[currentStep] as DPSnapshot | undefined)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Visual top controls bar */}
      <div
        className="flex flex-wrap items-center gap-4 px-6 py-3 shrink-0 glass-panel border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">DP Problem</span>
          <select
            value={algoId}
            onChange={(e) => {
              setAlgoId(e.target.value)
              setSeed(s => s + 1)
            }}
            disabled={isPlaying}
            className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500"
          >
            {dpModule.algorithms.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {algoId === 'knapsack' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Max Capacity</span>
            <input
              type="number"
              min={1} max={10}
              value={capacity > 10 ? 7 : capacity}
              onChange={(e) => setCapacity(Math.min(10, Math.max(1, Number(e.target.value))))}
              disabled={isPlaying}
              className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg w-16 px-2 py-1 text-center"
            />
            <button
              onClick={handleApplyConfig}
              disabled={isPlaying}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/20 text-xs font-medium rounded-lg text-white"
            >
              Apply W
            </button>
          </div>
        )}

        {algoId === 'coin_change' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Coins</span>
              <input
                type="text"
                value={coinsInput}
                onChange={(e) => setCoinsInput(e.target.value)}
                disabled={isPlaying}
                className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg w-24 px-2 py-1 text-center"
                placeholder="e.g. 1,2,5"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target Amount</span>
              <input
                type="number"
                min={1} max={15}
                value={capacity}
                onChange={(e) => setCapacity(Math.min(15, Math.max(1, Number(e.target.value))))}
                disabled={isPlaying}
                className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg w-16 px-2 py-1 text-center"
              />
            </div>
            <button
              onClick={handleApplyConfig}
              disabled={isPlaying}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/20 text-xs font-medium rounded-lg text-white"
            >
              Apply Coins
            </button>
          </div>
        )}

        {(algoId === 'lcs' || algoId === 'edit_distance') && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">String A</span>
              <input
                type="text"
                maxLength={8}
                value={strA}
                onChange={(e) => setStrA(e.target.value.toUpperCase())}
                disabled={isPlaying}
                className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg w-24 px-2 py-1 text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">String B</span>
              <input
                type="text"
                maxLength={8}
                value={strB}
                onChange={(e) => setStrB(e.target.value.toUpperCase())}
                disabled={isPlaying}
                className="bg-zinc-800/80 border border-zinc-700/40 text-sm text-zinc-100 rounded-lg w-24 px-2 py-1 text-center"
              />
            </div>
            <button
              onClick={handleApplyConfig}
              disabled={isPlaying}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/20 text-xs font-medium rounded-lg text-white"
            >
              Apply Strings
            </button>
          </div>
        )}

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
        {activeSnap && 'opCount' in activeSnap && (
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span>
              Comparisons: <span className="text-amber-400 font-bold">{activeSnap.opCount.comparisons}</span>
            </span>
            <span>
              Operations: <span className="text-emerald-400 font-bold">{activeSnap.opCount.operations}</span>
            </span>
          </div>
        )}
        <div className="flex-1" />
        <DebuggerControls />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table / Grid panel */}
        <div className="flex-1 relative overflow-hidden bg-zinc-950/40">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none"
            style={{ width: '100%', height: '100%' }}
          />
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
