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
    { key: 'pseudocode', label: 'PSEUDOCODE' },
    { key: 'python',     label: 'PYTHON' },
    { key: 'javascript', label: 'JAVASCRIPT' },
  ]

  const breakpoints      = useDebuggerStore((s) => s.breakpoints)
  const toggleBreakpoint  = useDebuggerStore((s) => s.toggleBreakpoint)

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-bg-panel"
      style={{
        borderLeft: '1px solid var(--color-border)',
      }}
    >
      <div
        className="flex shrink-0 bg-bg"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setLanguage(t.key)}
            className="px-4 py-2.5 text-[10px] tracking-wider font-mono font-semibold transition-all border-r border-border"
            style={{
              color:        codeLanguage === t.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: codeLanguage === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              background:   codeLanguage === t.key ? 'var(--color-bg-surface)' : 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-6 select-none bg-bg-panel">
        {lines.map((line, i) => {
          const hasBP = !!breakpoints[i]
          const isActive = i === activeLine
          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-1.5 transition-all duration-100 group cursor-pointer hover:bg-white/5 ${isActive ? 'pulse-active' : ''}`}
              onClick={() => toggleBreakpoint(i)}
              style={{
                color:      isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
              }}
            >
              {/* Breakpoint margin indicator - sharp square for technical vibe */}
              <span className="shrink-0 w-3 h-3 flex items-center justify-center relative">
                {hasBP ? (
                  <span className="w-2 h-2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]" title="Click to remove breakpoint" />
                ) : (
                  <span className="w-1.5 h-1.5 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity" title="Click to set breakpoint" />
                )}
              </span>

              <span className="shrink-0 w-5 text-right font-semibold select-none pr-1" style={{ color: 'var(--color-border-light)' }}>
                {i + 1}
              </span>
              <span className="whitespace-pre">{line || ' '}</span>
            </div>
          )
        })}
      </div>

      {steps[currentStep] && (
        <div
          className="shrink-0 px-4 py-3 text-xs font-mono bg-bg border-t border-border"
          style={{
            color: 'var(--color-text)',
          }}
        >
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-semibold">State / Instruction</div>
          <div className="whitespace-pre-wrap">{steps[currentStep].description}</div>
        </div>
      )}
    </div>
  )
}

