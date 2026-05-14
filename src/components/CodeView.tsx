// src/components/CodeView.tsx
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import type { CodeSnippets } from '@/types/AlgorithmModule'

interface Props {
  snippets: CodeSnippets
}

export function CodeView({ snippets }: Props) {
  const currentStep  = useDebuggerStore((s) => s.currentStep)
  const steps        = useDebuggerStore((s) => s.steps)
  const codeLanguage = useSettingsStore((s) => s.codeLanguage)
  const setLanguage  = useSettingsStore((s) => s.setCodeLanguage)

  const activeLine = steps[currentStep]?.codeLine ?? -1
  const lines = codeLanguage === 'python'
    ? snippets.python
    : codeLanguage === 'javascript'
    ? snippets.javascript
    : snippets.pseudocode

  const tabs: { key: 'pseudocode' | 'python' | 'javascript'; label: string }[] = [
    { key: 'pseudocode', label: 'Pseudo' },
    { key: 'python',     label: 'Python' },
    { key: 'javascript', label: 'JS'     },
  ]

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: 'var(--color-bg-surface, #18181b)',
        borderLeft: '1px solid var(--color-border, #3f3f46)',
      }}
    >
      <div
        className="flex shrink-0"
        style={{ borderBottom: '1px solid var(--color-border, #3f3f46)' }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setLanguage(t.key)}
            className="px-3 py-2 text-xs font-semibold transition-colors"
            style={{
              color:        codeLanguage === t.key ? '#fff' : 'var(--color-text-muted, #a1a1aa)',
              borderBottom: codeLanguage === t.key ? '2px solid var(--color-primary, #6366f1)' : '2px solid transparent',
              background:   'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-6">
        {lines.map((line, i) => (
          <div
            key={i}
            className="flex gap-2 px-1 rounded"
            style={{
              background: i === activeLine ? 'rgba(99,102,241,0.15)' : 'transparent',
              color:      i === activeLine ? '#e0e0ff' : 'var(--color-text-muted, #a1a1aa)',
              borderLeft: i === activeLine ? '2px solid var(--color-primary, #6366f1)' : '2px solid transparent',
            }}
          >
            <span className="shrink-0 w-5 text-right" style={{ color: 'var(--color-border-light, #52525b)' }}>
              {i + 1}
            </span>
            <span>{line || ' '}</span>
          </div>
        ))}
      </div>

      {steps[currentStep] && (
        <div
          className="shrink-0 px-3 py-2 text-xs truncate"
          style={{
            borderTop: '1px solid var(--color-border, #3f3f46)',
            color: 'var(--color-text-muted, #a1a1aa)',
          }}
        >
          {steps[currentStep].description}
        </div>
      )}
    </div>
  )
}
