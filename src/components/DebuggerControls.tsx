// src/components/DebuggerControls.tsx
import { useDebuggerStore } from '@/store/useDebuggerStore'

interface Props {
  compact?: boolean
}

export function DebuggerControls({ compact = false }: Props) {
  const currentStep  = useDebuggerStore((s) => s.currentStep)
  const totalSteps   = useDebuggerStore((s) => s.totalSteps)
  const isPlaying    = useDebuggerStore((s) => s.isPlaying)
  const play         = useDebuggerStore((s) => s.play)
  const pause        = useDebuggerStore((s) => s.pause)
  const stepForward  = useDebuggerStore((s) => s.stepForward)
  const stepBackward = useDebuggerStore((s) => s.stepBackward)
  const seekTo       = useDebuggerStore((s) => s.seekTo)

  const atStart = currentStep === 0
  const atEnd   = totalSteps === 0 || currentStep >= totalSteps - 1
  const hasSteps = totalSteps > 0

  const btnBase = 'flex items-center justify-center rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
  const btnSm   = compact ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={stepBackward}
        disabled={atStart || !hasSteps}
        className={`${btnBase} ${btnSm} hover:bg-zinc-700`}
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="Step backward"
        title="Step backward (Left arrow)"
      >
        {'<<'}
      </button>

      <button
        onClick={isPlaying ? pause : play}
        disabled={!hasSteps || (atEnd && !isPlaying)}
        className={`${btnBase} ${compact ? 'w-8 h-8 text-sm' : 'w-10 h-10'} rounded-full`}
        style={{ background: hasSteps ? 'var(--color-primary, #6366f1)' : 'var(--color-border, #3f3f46)', color: '#fff' }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? '||' : '>'}
      </button>

      <button
        onClick={stepForward}
        disabled={atEnd || !hasSteps}
        className={`${btnBase} ${btnSm} hover:bg-zinc-700`}
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="Step forward"
        title="Step forward (Right arrow)"
      >
        {'>>'}
      </button>

      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={currentStep}
        onChange={(e) => seekTo(Number(e.target.value))}
        disabled={!hasSteps}
        className="flex-1 accent-indigo-500 disabled:opacity-30"
        style={{ minWidth: compact ? 80 : 120 }}
        aria-label="Seek to step"
      />

      <span
        className="text-xs font-mono tabular-nums shrink-0"
        style={{ color: 'var(--color-text-muted, #a1a1aa)', minWidth: compact ? 60 : 80 }}
      >
        {hasSteps ? `${currentStep + 1} / ${totalSteps}` : '— / —'}
      </span>
    </div>
  )
}
