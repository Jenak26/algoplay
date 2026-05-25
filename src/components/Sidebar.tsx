// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { MODULE_NAV } from '@/modules/registry'

export function Sidebar() {
  return (
    <aside
      className="w-20 flex flex-col items-center py-6 gap-4 shrink-0 glass-panel relative z-10"
      style={{ borderRight: '1px solid var(--color-border)' }}
    >
      {/* Brand Logo */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-lg font-black tracking-wider shadow-lg select-none relative group"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-purple))',
          color: '#fff',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}
      >
        <span>AP</span>
        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-3 w-full items-center">
        {MODULE_NAV.map((mod) => (
          <NavLink
            key={mod.id}
            to={mod.route}
            title={mod.name}
            className={({ isActive }) =>
              `w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 relative group
               ${isActive 
                 ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-indigo-500/10' 
                 : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active side indicator */}
                {isActive && (
                  <span 
                    className="absolute left-0 w-1 h-6 rounded-r bg-indigo-500 shadow-[0_0_8px_#6366f1]"
                  />
                )}
                <span className="group-hover:scale-110 transition-transform duration-200">{mod.icon}</span>
                {/* Hover Tooltip */}
                <div 
                  className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-zinc-950/90 border border-zinc-800/80 shadow-xl opacity-0 scale-95 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-50"
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

