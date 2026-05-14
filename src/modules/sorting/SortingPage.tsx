// src/modules/sorting/SortingPage.tsx
import { useEffect, useRef, useState } from 'react'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { StepRecorder }     from '@/engine/StepRecorder'
import { soundEngine }      from '@/engine/SoundEngine'
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer'
import { DebuggerControls }  from '@/components/DebuggerControls'
import { CodeView }          from '@/components/CodeView'
import { ComplexityChart }   from '@/components/ComplexityChart'
import { PatternSelector }   from '@/components/PatternSelector'
import { ShareButton }       from '@/components/ShareButton'
import type { StepSnapshot } from '@/types/StepSnapshot'
import { sortingModule }     from './index'
import { RaceMode }          from './RaceMode'

function getDelay(speed: number): number {
  return Math.floor(Math.pow(10, (100 - speed) / 25))
}

export default function SortingPage() {
  const activeAlgoId   = useAlgoStore((s) => s.activeAlgoId)
  const setActiveAlgo  = useAlgoStore((s) => s.setActiveAlgo)
  const array          = useAlgoStore((s) => s.array)
  const speed          = useAlgoStore((s) => s.speed)
  const setIsRunning   = useAlgoStore((s) => s.setIsRunning)
  const generateArray  = useAlgoStore((s) => s.generateArray)
  const soundEnabled   = useSettingsStore((s) => s.soundEnabled)
  const showCodeView   = useSettingsStore((s) => s.showCodeView)
  const showComplexity = useSettingsStore((s) => s.showComplexityChart)
  const toggleCodeView = useSettingsStore((s) => s.toggleCodeView)
  const toggleComplexity = useSettingsStore((s) => s.toggleComplexity)

  const steps        = useDebuggerStore((s) => s.steps)
  const currentStep  = useDebuggerStore((s) => s.currentStep)
  const totalSteps   = useDebuggerStore((s) => s.totalSteps)
  const isPlaying    = useDebuggerStore((s) => s.isPlaying)
  const loadSteps    = useDebuggerStore((s) => s.loadSteps)
  const stepForward  = useDebuggerStore((s) => s.stepForward)
  const pause        = useDebuggerStore((s) => s.pause)
  const resetDebugger = useDebuggerStore((s) => s.reset)

  const activeAlgo = sortingModule.algorithms.find((a) => a.id === activeAlgoId)
    ?? sortingModule.algorithms[0]

  const complexityType = (['merge','quick','heap','shell'].includes(activeAlgoId) ? 'nlogn'
    : ['counting','radix'].includes(activeAlgoId) ? 'nk'
    : 'n2') as 'n2' | 'nlogn' | 'nk'

  const currentSnapshot = (steps[currentStep] as StepSnapshot | undefined) ?? null

  const canvasRef = useCanvasRenderer(sortingModule.Renderer, currentSnapshot)

  const soundInitRef = useRef(false)

  useEffect(() => {
    if (array.length === 0) { generateArray(); return }
    const recorder = new StepRecorder()
    activeAlgo.record([...array], recorder)
    loadSteps(recorder.getSteps())
  }, [activeAlgoId, array]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setIsRunning(isPlaying) }, [isPlaying, setIsRunning])

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= totalSteps - 1) { pause(); return }
    const id = setTimeout(() => {
      stepForward()
      if (soundEnabled && currentSnapshot) {
        if (!soundInitRef.current) { soundEngine.init(); soundInitRef.current = true }
        const maxVal = currentSnapshot.array.length > 0 ? Math.max(...currentSnapshot.array) : 100
        const firstHighlighted = [...currentSnapshot.highlights.entries()][0]
        if (firstHighlighted) {
          soundEngine.playNote((currentSnapshot.array[firstHighlighted[0]] / maxVal) * 100)
        }
      }
    }, getDelay(speed))
    return () => clearTimeout(id)
  }, [isPlaying, currentStep, totalSteps, speed, soundEnabled, currentSnapshot, stepForward, pause])

  const opCount = (steps[currentStep] as StepSnapshot | undefined)?.opCount
  const stableLabel = activeAlgo.stable ? 'stable' : 'unstable'

  const [view, setView] = useState<'visualizer' | 'race'>('visualizer')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex shrink-0"
        style={{ background: 'var(--color-bg-panel, #09090b)', borderBottom: '1px solid var(--color-border, #3f3f46)' }}
      >
        {(['visualizer', 'race'] as const).map((v) => (
          <button
            key={v}
            onClick={() => { setView(v); pause() }}
            className="px-4 py-2 text-xs font-semibold capitalize transition-colors"
            style={{
              color: view === v ? '#fff' : 'var(--color-text-muted, #a1a1aa)',
              borderBottom: view === v ? '2px solid var(--color-primary, #6366f1)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {v === 'race' ? 'Race Mode' : 'Visualizer'}
          </button>
        ))}
      </div>

      {view === 'race' ? <RaceMode /> : (
      <>
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-2 shrink-0"
        style={{ background: 'var(--color-bg-panel, #09090b)', borderBottom: '1px solid var(--color-border, #3f3f46)' }}
      >
        <select
          value={activeAlgoId}
          onChange={(e) => { resetDebugger(); setActiveAlgo(e.target.value) }}
          disabled={isPlaying}
          className="text-sm px-2 py-1 rounded border outline-none"
          style={{
            background: 'var(--color-bg-surface, #18181b)',
            border: '1px solid var(--color-border-light, #52525b)',
            color: 'var(--color-text, #fafafa)',
          }}
          aria-label="Select algorithm"
        >
          {sortingModule.algorithms.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <PatternSelector />
        <div className="flex-1" />
        <ShareButton />

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
        <button
          onClick={toggleComplexity}
          className="text-xs px-2 py-1 rounded"
          style={{
            background: showComplexity ? 'rgba(99,102,241,0.15)' : 'var(--color-bg-surface, #18181b)',
            border: '1px solid var(--color-border-light, #52525b)',
            color: showComplexity ? '#a5b4fc' : 'var(--color-text-muted, #a1a1aa)',
          }}
        >
          Chart
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
          space {activeAlgo.spaceComplexity}
        </span>
        <span className="text-xs" style={{ color: activeAlgo.stable ? 'var(--color-green, #10b981)' : 'var(--color-red, #ef4444)' }}>
          {stableLabel}
        </span>

        {opCount && (
          <>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted, #a1a1aa)' }}>
              cmp <span style={{ color: 'var(--color-yellow, #eab308)' }}>{opCount.comparisons}</span>
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted, #a1a1aa)' }}>
              swp <span style={{ color: 'var(--color-red, #ef4444)' }}>{opCount.swaps}</span>
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
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {(showCodeView || showComplexity) && (
          <div
            className="flex flex-col shrink-0 overflow-hidden"
            style={{ width: 260, borderLeft: '1px solid var(--color-border, #3f3f46)' }}
          >
            {showCodeView && (
              <div className="flex-1 overflow-hidden min-h-0">
                <CodeView snippets={activeAlgo.codeSnippets} />
              </div>
            )}
            {showComplexity && (
              <ComplexityChart complexity={complexityType} arraySize={array.length} />
            )}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  )
}
