// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { MODULE_NAV } from '@/modules/registry'

export function Sidebar() {
  return (
    <aside
      style={{ background: 'var(--color-bg-panel)', borderRight: '1px solid var(--color-border)' }}
      className="w-16 flex flex-col items-center py-4 gap-2 shrink-0"
    >
      {/* Logo */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-sm font-black"
        style={{ background: 'var(--color-primary)', color: '#fff' }}
      >
        A
      </div>

      {MODULE_NAV.map((mod) => (
        <NavLink
          key={mod.id}
          to={mod.route}
          title={mod.name}
          className={({ isActive }) =>
            `w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all
             hover:bg-zinc-800 ${isActive ? 'bg-zinc-800 ring-1 ring-indigo-500/50' : ''}`
          }
        >
          {mod.icon}
        </NavLink>
      ))}
    </aside>
  )
}
