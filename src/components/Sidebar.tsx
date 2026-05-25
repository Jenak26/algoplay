// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { MODULE_NAV } from '@/modules/registry'

export function Sidebar() {
  return (
    <aside
      className="w-16 flex flex-col items-center py-6 gap-4 shrink-0 bg-[#0e0e0e] border-r border-[#3b494b] z-10"
    >
      {/* Brand Logo */}
      <div
        className="w-10 h-10 flex items-center justify-center mb-6 text-xs font-mono font-black tracking-wider select-none relative group border border-[#00dbe9]/30"
        style={{ 
          background: 'rgba(0, 219, 233, 0.15)',
          color: '#00dbe9',
        }}
      >
        <span>AP</span>
        <div className="absolute inset-0 bg-[#00dbe9]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-2 w-full items-center">
        {MODULE_NAV.map((mod) => (
          <NavLink
            key={mod.id}
            to={mod.route}
            title={mod.name}
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center text-lg transition-all duration-200 relative group
               ${isActive 
                 ? 'bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30' 
                 : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#1c1b1b] border border-transparent'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active side indicator */}
                {isActive && (
                  <span 
                    className="absolute left-0 w-[3px] h-6 bg-[#00dbe9] shadow-[0_0_8px_#00dbe9]"
                  />
                )}
                <span className="group-hover:scale-105 transition-transform duration-200">{mod.icon}</span>
                {/* Hover Tooltip */}
                <div 
                  className="absolute left-full ml-3 px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-100 bg-[#1c1b1b] border border-[#3b494b] opacity-0 scale-95 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-50"
                >
                  {mod.name}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

