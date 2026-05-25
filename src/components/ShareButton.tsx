// src/components/ShareButton.tsx
import { useState, useCallback } from 'react'
import { useURLState }      from '@/hooks/useURLState'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { URLStateEncoder }  from '@/engine/URLStateEncoder'

interface Props {
  grid?: {
    width:  number
    height: number
    cells:  Uint8Array
    start:  number
    end:    number
  }
  module?: string
}

export function ShareButton({ grid, module: moduleOverride }: Props = {}) {
  const [copied, setCopied] = useState(false)
  const { copyToClipboard } = useURLState()

  const activeAlgoId   = useAlgoStore((s) => s.activeAlgoId)
  const activeModuleId = useAlgoStore((s) => s.activeModuleId)
  const array          = useAlgoStore((s) => s.array)
  const speed          = useAlgoStore((s) => s.speed)
  const codeLanguage   = useSettingsStore((s) => s.codeLanguage)

  const handleShare = useCallback(async () => {
    const moduleId = moduleOverride ?? activeModuleId
    if (grid) {
      await copyToClipboard({
        v:      1,
        module: moduleId,
        algo:   activeAlgoId,
        grid:   URLStateEncoder.encodeGrid(grid.cells),
        gridW:  grid.width,
        gridH:  grid.height,
        start:  [grid.start % grid.width, Math.floor(grid.start / grid.width)],
        end:    [grid.end % grid.width,   Math.floor(grid.end / grid.width)],
        speed,
        lang:   codeLanguage,
      })
    } else {
      await copyToClipboard({
        v:      1,
        module: moduleId,
        algo:   activeAlgoId,
        array:  array.length <= 100 ? array : undefined,
        speed,
        lang:   codeLanguage,
      })
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [copyToClipboard, activeAlgoId, activeModuleId, moduleOverride, array, speed, codeLanguage, grid])

  return (
    <button
      onClick={() => void handleShare()}
      className="flex items-center gap-1 text-xs px-3 py-1 rounded transition-all"
      style={{
        background: copied ? 'rgba(16,185,129,0.15)' : 'var(--color-bg-surface, #18181b)',
        border:     copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--color-border-light, #52525b)',
        color:      copied ? 'var(--color-green, #10b981)' : 'var(--color-text-muted, #a1a1aa)',
      }}
      aria-label="Copy shareable link"
      title="Copy shareable link"
    >
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}
