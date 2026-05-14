// src/modules/sorting/RaceMode.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAlgoStore }  from '@/store/useAlgoStore'
import { StepRecorder }  from '@/engine/StepRecorder'
import { soundEngine }   from '@/engine/SoundEngine'
import { useSettingsStore } from '@/store/useSettingsStore'
import { sortingModule } from './index'
import { SortRenderer }  from './SortRenderer'
import type { StepSnapshot } from '@/types/StepSnapshot'

function getDelay(speed: number): number {
  return Math.floor(Math.pow(10, (100 - speed) / 25))
}

interface RaceLane {
  algoId:  string
  steps:   readonly StepSnapshot[]
  current: number
  done:    boolean
  place:   number | null
}

const PLACE_COLORS = ['#f59e0b', '#a1a1aa', '#b45309', '#6366f1']
const PLACE_LABELS = ['1st', '2nd', '3rd', '4th']

const ALL_ALGO_IDS = sortingModule.algorithms.map((a) => a.id)

export function RaceMode() {
  const array = useAlgoStore((s) => s.array)
  const speed = useAlgoStore((s) => s.speed)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)

  const [laneAlgos, setLaneAlgos] = useState<string[]>(['bubble', 'merge'])
  const [lanes, setLanes] = useState<RaceLane[]>([])
  const [isRacing, setIsRacing] = useState(false)
  const [placeCounter, setPlaceCounter] = useState(0)

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const rendererRefs = useRef<(SortRenderer | null)[]>([])

  const buildLanes = useCallback(() => {
    setIsRacing(false)
    setPlaceCounter(0)
    const built = laneAlgos.map((id) => {
      const algo = sortingModule.algorithms.find((a) => a.id === id)!
      const recorder = new StepRecorder()
      algo.record([...array], recorder)
      return { algoId: id, steps: recorder.getSteps(), current: 0, done: false, place: null }
    })
    setLanes(built)
  }, [laneAlgos, array])

  useEffect(() => { buildLanes() }, [buildLanes])

  useEffect(() => {
    lanes.forEach((lane, i) => {
      const renderer = rendererRefs.current[i]
      const snap = lane.steps[lane.current]
      if (renderer && snap) renderer.updateSnapshot(snap)
    })
  }, [lanes])

  useEffect(() => {
    rendererRefs.current = canvasRefs.current.map((canvas) => {
      if (!canvas) return null
      const r = new SortRenderer(canvas)
      r.resize()
      return r
    })
    const onResize = () => rendererRefs.current.forEach((r) => r?.resize())
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      rendererRefs.current.forEach((r) => r?.destroy())
    }
  }, [lanes.length])

  const tick = useCallback(() => {
    setLanes((prev) => {
      let newPlaceCounter = placeCounter
      const next = prev.map((lane) => {
        if (lane.done) return lane
        const nextStep = lane.current + 1
        if (nextStep >= lane.steps.length) {
          newPlaceCounter++
          return { ...lane, current: lane.steps.length - 1, done: true, place: newPlaceCounter }
        }
        return { ...lane, current: nextStep }
      })
      setPlaceCounter(newPlaceCounter)
      const allDone = next.every((l) => l.done)
      if (allDone) setIsRacing(false)
      return next
    })
    if (soundEnabled) soundEngine.playNote(50)
  }, [placeCounter, soundEnabled])

  useEffect(() => {
    if (!isRacing) return
    const id = setTimeout(tick, getDelay(speed))
    return () => clearTimeout(id)
  }, [isRacing, lanes, speed, tick])

  const startRace = () => {
    soundEngine.init()
    buildLanes()
    setTimeout(() => setIsRacing(true), 50)
  }

  const addLane = () => {
    if (laneAlgos.length >= 4) return
    const unused = ALL_ALGO_IDS.find((id) => !laneAlgos.includes(id)) ?? ALL_ALGO_IDS[0]
    setLaneAlgos((prev) => [...prev, unused])
  }

  const removeLane = (idx: number) => {
    if (laneAlgos.length <= 2) return
    setLaneAlgos((prev) => prev.filter((_, i) => i !== idx))
  }

  const changeAlgo = (idx: number, algoId: string) => {
    setLaneAlgos((prev) => prev.map((a, i) => (i === idx ? algoId : a)))
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-3 px-4 py-2 shrink-0"
        style={{ background: 'var(--color-bg-panel, #09090b)', borderBottom: '1px solid var(--color-border, #3f3f46)' }}
      >
        {laneAlgos.map((algoId, i) => (
          <div key={i} className="flex items-center gap-1">
            <select
              value={algoId}
              onChange={(e) => changeAlgo(i, e.target.value)}
              disabled={isRacing}
              className="text-xs px-2 py-1 rounded border outline-none"
              style={{
                background: 'var(--color-bg-surface, #18181b)',
                border: '1px solid var(--color-border-light, #52525b)',
                color: PLACE_COLORS[i],
              }}
            >
              {sortingModule.algorithms.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {laneAlgos.length > 2 && (
              <button
                onClick={() => removeLane(i)}
                disabled={isRacing}
                className="text-xs px-1"
                style={{ color: 'var(--color-text-muted, #a1a1aa)' }}
                aria-label="Remove lane"
              >
                x
              </button>
            )}
          </div>
        ))}

        {laneAlgos.length < 4 && (
          <button
            onClick={addLane}
            disabled={isRacing}
            className="text-xs px-2 py-1 rounded"
            style={{
              background: 'var(--color-bg-surface, #18181b)',
              border: '1px dashed var(--color-border-light, #52525b)',
              color: 'var(--color-text-muted, #a1a1aa)',
            }}
          >
            + Add lane
          </button>
        )}

        <div className="flex-1" />

        {isRacing ? (
          <button
            onClick={() => setIsRacing(false)}
            className="text-xs px-4 py-1 rounded font-semibold"
            style={{ background: 'var(--color-red, #ef4444)', color: '#fff' }}
          >
            Stop
          </button>
        ) : (
          <button
            onClick={startRace}
            className="text-xs px-4 py-1 rounded font-semibold"
            style={{ background: 'var(--color-primary, #6366f1)', color: '#fff' }}
          >
            Start Race
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ gap: 1, background: 'var(--color-border, #3f3f46)' }}>
        {lanes.map((lane, i) => {
          const algoName = sortingModule.algorithms.find((a) => a.id === lane.algoId)?.name ?? lane.algoId
          const progress = lane.steps.length > 0 ? Math.round((lane.current / Math.max(lane.steps.length - 1, 1)) * 100) : 0
          return (
            <div
              key={`${lane.algoId}-${i}`}
              className="flex flex-col flex-1 relative overflow-hidden"
              style={{ background: 'var(--color-bg, #0a0a0b)' }}
            >
              <div
                className="flex items-center justify-between px-2 py-1 shrink-0 text-xs font-semibold"
                style={{
                  background: 'var(--color-bg-panel, #09090b)',
                  borderBottom: `2px solid ${PLACE_COLORS[i]}`,
                  color: PLACE_COLORS[i],
                }}
              >
                <span>{algoName}</span>
                <span style={{ color: 'var(--color-text-muted, #a1a1aa)' }}>
                  {lane.done
                    ? (lane.place !== null ? PLACE_LABELS[lane.place - 1] : 'done')
                    : `${progress}%`}
                </span>
              </div>

              <canvas
                ref={(el) => { canvasRefs.current[i] = el }}
                className="flex-1 block"
                style={{ width: '100%', height: '100%' }}
              />

              <div
                className="absolute top-8 left-1 text-xs font-mono px-1 rounded"
                style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--color-text-muted, #a1a1aa)' }}
              >
                {lane.steps[lane.current]
                  ? `C:${lane.steps[lane.current].opCount.comparisons} S:${lane.steps[lane.current].opCount.swaps}`
                  : ''}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
