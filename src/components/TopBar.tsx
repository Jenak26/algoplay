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
      className="h-12 flex items-center justify-between px-6 shrink-0 bg-[#0e0e0e] border-b border-[#3b494b] z-10"
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#00dbe9]/10 border border-[#00dbe9]/30 text-[#00dbe9]">
          {activeModule?.icon ?? '⚡'}
        </div>
        <div className="flex flex-col">
          <span className="font-mono font-bold text-xs text-zinc-100 tracking-wide">{activeModule?.name ?? 'AlgoPlay'}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Customized Speed Slider */}
        <div className="flex items-center gap-3 bg-[#131313] border border-[#3b494b] px-3 py-1 rounded">
          <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wide uppercase select-none">Speed</span>
          <input
            type="range" min={1} max={100} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-20 h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#00dbe9] hover:accent-[#00dbe9]/80 focus:outline-none"
          />
          <span className="text-[10px] font-mono font-semibold text-[#00dbe9] w-8 text-right select-none">{speed}%</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`w-7 h-7 flex items-center justify-center transition-all duration-200 border
            ${soundEnabled 
              ? 'bg-[#00e383]/10 border-[#00e383]/30 text-[#00e383]' 
              : 'bg-[#1c1b1b]/40 border-[#3b494b]/20 text-zinc-500 hover:text-zinc-300'
            }`}
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6h2.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center transition-all duration-200 bg-[#1c1b1b]/40 border border-[#3b494b]/20 text-zinc-400 hover:text-zinc-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0h-2.25m15.364-6.364l-1.591 1.591M6.343 17.657l-1.591 1.591m12.728 0l-1.591-1.591M6.343 6.343L4.752 4.752M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 4.5 0 8.35-3.09 9.502-7.248z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

