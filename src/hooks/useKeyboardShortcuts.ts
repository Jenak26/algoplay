// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useAlgoStore }     from '@/store/useAlgoStore'

export function useKeyboardShortcuts() {
  const debugger_ = useDebuggerStore()
  const settings  = useSettingsStore()
  const algo      = useAlgoStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if focus is in an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          debugger_.isPlaying ? debugger_.pause() : debugger_.play()
          break
        case 'ArrowRight':
          e.preventDefault()
          debugger_.stepForward()
          break
        case 'ArrowLeft':
          e.preventDefault()
          debugger_.stepBackward()
          break
        case 'r':
        case 'R':
          algo.generateArray()
          break
        case 's':
        case 'S':
          settings.toggleSound()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [debugger_, settings, algo])
}
