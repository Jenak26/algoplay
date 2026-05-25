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

  const btnBase = 'flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed border'
  const btnSize = compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'

  return (
    <div className="flex items-center gap-3 select-none bg-bg-surface border border-border px-3 py-1.5">
      <button
        onClick={stepBackward}
        disabled={atStart || !hasSteps}
        className={`${btnBase} ${btnSize} bg-bg border-border text-text-muted hover:text-text hover:border-border-light`}
        aria-label="Step backward"
        title="Step backward (Left arrow)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={isPlaying ? pause : play}
        disabled={!hasSteps || (atEnd && !isPlaying)}
        className={`${btnBase} ${compact ? 'w-9 h-9' : 'w-11 h-11'} hover:scale-105 active:scale-95`}
        style={{ 
          background: hasSteps 
            ? 'var(--color-primary)' 
            : 'transparent', 
          borderColor: hasSteps ? 'transparent' : 'var(--color-border)',
          color: hasSteps ? '#000000' : 'var(--color-text-muted)',
          boxShadow: hasSteps ? '0 0 12px rgba(0, 219, 233, 0.35)' : 'none'
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 translate-x-[1px]">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <button
        onClick={stepForward}
        disabled={atEnd || !hasSteps}
        className={`${btnBase} ${btnSize} bg-bg border-border text-text-muted hover:text-text hover:border-border-light`}
        aria-label="Step forward"
        title="Step forward (Right arrow)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={currentStep}
        onChange={(e) => seekTo(Number(e.target.value))}
        disabled={!hasSteps}
        className="flex-1 h-1 bg-bg border border-border appearance-none cursor-pointer accent-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ minWidth: compact ? 80 : 140 }}
        aria-label="Seek to step"
      />

      <span
        className="text-xs font-mono font-semibold tabular-nums shrink-0 text-text-muted text-center"
        style={{ minWidth: compact ? 60 : 70 }}
      >
        {hasSteps ? `${currentStep + 1}/${totalSteps}` : '—/—'}
      </span>
    </div>
  )
}

