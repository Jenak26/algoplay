// src/components/TopBar.tsx
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { MODULE_NAV }       from '@/modules/registry'
import { useLocation }      from 'react-router-dom'

export function TopBar() {
  const speed        = useAlgoStore((s) => s.speed)
  const setSpeed     = useAlgoStore((s) => s.setSpeed)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const toggleSound  = useSettingsStore((s) => s.toggleSound)
  const theme        = useSettingsStore((s) => s.theme)
  const toggleTheme  = useSettingsStore((s) => s.toggleTheme)
  const location     = useLocation()

  const activeModule = MODULE_NAV.find((m) => m.route === location.pathname)

  return (
    <header
      style={{
        background:   'var(--color-bg-panel)',
        borderBottom: '1px solid var(--color-border)',
        color:        'var(--color-text)',
      }}
      className="h-12 flex items-center justify-between px-4 shrink-0"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{activeModule?.icon ?? '⚡'}</span>
        <span className="font-semibold text-sm">{activeModule?.name ?? 'AlgoPlay'}</span>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Speed
          <input
            type="range" min={1} max={100} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-indigo-500"
          />
        </label>

        <button
          onClick={toggleSound}
          className="text-sm px-2 py-1 rounded transition-colors hover:bg-zinc-800"
          style={{ color: soundEnabled ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          aria-label="Toggle sound"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        <button
          onClick={toggleTheme}
          className="text-sm px-2 py-1 rounded transition-colors hover:bg-zinc-800"
          style={{ color: 'var(--color-text-muted)' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
