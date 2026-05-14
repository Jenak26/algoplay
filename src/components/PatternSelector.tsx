// src/components/PatternSelector.tsx
import { useAlgoStore } from '@/store/useAlgoStore'

export function PatternSelector() {
  const arraySize    = useAlgoStore((s) => s.arraySize)
  const arrayPattern = useAlgoStore((s) => s.arrayPattern)
  const setArraySize = useAlgoStore((s) => s.setArraySize)
  const setPattern   = useAlgoStore((s) => s.setArrayPattern)
  const generate     = useAlgoStore((s) => s.generateArray)
  const isRunning    = useAlgoStore((s) => s.isRunning)

  const patterns = [
    { value: 'random',        label: 'Random' },
    { value: 'nearly-sorted', label: 'Nearly Sorted' },
    { value: 'reversed',      label: 'Reversed' },
    { value: 'few-unique',    label: 'Few Unique' },
  ] as const

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={arrayPattern}
        onChange={(e) => setPattern(e.target.value as typeof arrayPattern)}
        disabled={isRunning}
        className="text-xs px-2 py-1 rounded border outline-none"
        style={{
          background: 'var(--color-bg-surface, #18181b)',
          border: '1px solid var(--color-border-light, #52525b)',
          color: 'var(--color-text, #fafafa)',
        }}
        aria-label="Array pattern"
      >
        {patterns.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <label
        className="flex items-center gap-2 text-xs"
        style={{ color: 'var(--color-text-muted, #a1a1aa)' }}
      >
        n = {arraySize}
        <input
          type="range"
          min={5}
          max={200}
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          disabled={isRunning}
          className="w-20 accent-indigo-500"
          aria-label="Array size"
        />
      </label>

      <button
        onClick={generate}
        disabled={isRunning}
        className="text-xs px-3 py-1 rounded transition-colors"
        style={{
          background: 'var(--color-bg-surface, #18181b)',
          border: '1px solid var(--color-border-light, #52525b)',
          color: 'var(--color-text-muted, #a1a1aa)',
        }}
        aria-label="Generate new array (R)"
        title="Generate new array (R)"
      >
        New
      </button>
    </div>
  )
}
