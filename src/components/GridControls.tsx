// src/components/GridControls.tsx
import type { PathfindingModule } from '@/types/PathfindingModule'

export type EditMode = 'wall' | 'heavy' | 'start' | 'end' | 'erase'

interface Props {
  module:         PathfindingModule
  algoId:         string
  onAlgoChange:   (id: string) => void
  editMode:       EditMode
  onEditMode:     (m: EditMode) => void
  onGenerateMaze: (mazeId: string) => void
  onClear:        () => void
  heatMap:        boolean
  onHeatMap:      (v: boolean) => void
  disabled?:      boolean
}

export function GridControls({
  module, algoId, onAlgoChange,
  editMode, onEditMode,
  onGenerateMaze, onClear,
  heatMap, onHeatMap,
  disabled = false,
}: Props) {
  const modes: { id: EditMode; label: string; color: string }[] = [
    { id: 'wall',  label: 'Wall',  color: '#52525b' },
    { id: 'heavy', label: 'Heavy', color: '#7c2d12' },
    { id: 'start', label: 'Start', color: '#10b981' },
    { id: 'end',   label: 'End',   color: '#ef4444' },
    { id: 'erase', label: 'Erase', color: '#a1a1aa' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={algoId}
        onChange={(e) => onAlgoChange(e.target.value)}
        disabled={disabled}
        className="text-sm px-2 py-1 rounded border outline-none"
        style={{
          background: 'var(--color-bg-surface, #18181b)',
          border: '1px solid var(--color-border-light, #52525b)',
          color: 'var(--color-text, #fafafa)',
        }}
        aria-label="Select pathfinding algorithm"
      >
        {module.algorithms.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <div className="flex items-center gap-1" role="group" aria-label="Edit mode">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onEditMode(m.id)}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded"
            style={{
              background: editMode === m.id ? m.color : 'var(--color-bg-surface, #18181b)',
              color:      editMode === m.id ? '#fff'  : 'var(--color-text-muted, #a1a1aa)',
              border:     '1px solid var(--color-border-light, #52525b)',
              opacity:    disabled ? 0.5 : 1,
            }}
            aria-pressed={editMode === m.id}
            title={`Edit mode: ${m.label}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <select
        defaultValue=""
        onChange={(e) => {
          const v = e.target.value
          e.currentTarget.value = ''
          if (v) onGenerateMaze(v)
        }}
        disabled={disabled}
        className="text-xs px-2 py-1 rounded border outline-none"
        style={{
          background: 'var(--color-bg-surface, #18181b)',
          border: '1px solid var(--color-border-light, #52525b)',
          color: 'var(--color-text-muted, #a1a1aa)',
        }}
        aria-label="Generate maze"
      >
        <option value="">Generate maze…</option>
        {module.mazes.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <button
        onClick={onClear}
        disabled={disabled}
        className="text-xs px-2 py-1 rounded"
        style={{
          background: 'var(--color-bg-surface, #18181b)',
          border: '1px solid var(--color-border-light, #52525b)',
          color: 'var(--color-text-muted, #a1a1aa)',
        }}
      >
        Clear
      </button>

      <label
        className="flex items-center gap-1 text-xs select-none"
        style={{ color: 'var(--color-text-muted, #a1a1aa)' }}
      >
        <input
          type="checkbox"
          checked={heatMap}
          onChange={(e) => onHeatMap(e.target.checked)}
          className="accent-indigo-500"
        />
        Heat map
      </label>
    </div>
  )
}
