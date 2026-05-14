// src/components/AppShell.tsx
import { useEffect } from 'react'
import { Outlet }    from 'react-router-dom'
import { Sidebar }   from './Sidebar'
import { TopBar }    from './TopBar'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useSettingsStore }     from '@/store/useSettingsStore'

export function AppShell() {
  useKeyboardShortcuts()
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main
          className="flex-1 overflow-hidden"
          style={{ background: 'var(--color-bg)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
