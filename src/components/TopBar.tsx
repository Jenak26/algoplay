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
        borderBottom: '1px solid var(--color-border)',
      }}
      className="h-16 flex items-center justify-between px-6 shrink-0 glass-panel relative z-10"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          {activeModule?.icon ?? '⚡'}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-zinc-100 tracking-wide">{activeModule?.name ?? 'AlgoPlay'}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Interactive Visualizer</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Customized Speed Slider */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
          <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase select-none">Speed</span>
          <input
            type="range" min={1} max={100} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none"
          />
          <span className="text-xs font-mono font-medium text-indigo-400 w-8 text-right select-none">{speed}%</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border
            ${soundEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-zinc-800/40 border-zinc-700/20 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6h2.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 bg-zinc-800/40 border border-zinc-700/20 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0h-2.25m15.364-6.364l-1.591 1.591M6.343 17.657l-1.591 1.591m12.728 0l-1.591-1.591M6.343 6.343L4.752 4.752M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 4.5 0 8.35-3.09 9.502-7.248z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

