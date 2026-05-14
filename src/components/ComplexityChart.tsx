// src/components/ComplexityChart.tsx
import { useEffect, useRef } from 'react'
import { useDebuggerStore }  from '@/store/useDebuggerStore'

interface Props {
  complexity: 'n2' | 'nlogn' | 'n' | 'nk'
  arraySize:  number
}

export function ComplexityChart({ complexity, arraySize }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const currentStep = useDebuggerStore((s) => s.currentStep)
  const totalSteps  = useDebuggerStore((s) => s.totalSteps)
  const steps       = useDebuggerStore((s) => s.steps)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || totalSteps === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width: w, height: h } = canvas
    ctx.clearRect(0, 0, w, h)

    const n = arraySize
    const maxOps =
      complexity === 'n2'    ? n * n :
      complexity === 'nlogn' ? Math.ceil(n * Math.log2(Math.max(n, 2))) * 3 :
      complexity === 'nk'    ? n * 10 :
      n * 2

    const xScale = w / Math.max(totalSteps - 1, 1)
    const yScale = h / Math.max(maxOps, 1)

    ctx.beginPath()
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 1
    for (let s = 0; s < totalSteps; s++) {
      const progress = s / Math.max(totalSteps - 1, 1)
      const theorOps =
        complexity === 'n2'    ? maxOps * progress * progress :
        complexity === 'nlogn' ? maxOps * progress :
        maxOps * progress
      const x = s * xScale
      const y = h - theorOps * yScale
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 2
    for (let s = 0; s <= currentStep && s < totalSteps; s++) {
      const ops = steps[s].opCount.comparisons + steps[s].opCount.swaps
      const x = s * xScale
      const y = h - Math.min(ops * yScale, h)
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()

    if (steps[currentStep]) {
      const ops = steps[currentStep].opCount.comparisons + steps[currentStep].opCount.swaps
      const x = currentStep * xScale
      const y = h - Math.min(ops * yScale, h)
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#818cf8'
      ctx.fill()
    }
  }, [currentStep, totalSteps, steps, complexity, arraySize])

  return (
    <div className="flex flex-col" style={{ borderTop: '1px solid var(--color-border, #3f3f46)' }}>
      <div
        className="flex items-center justify-between px-3 py-1 text-xs"
        style={{ color: 'var(--color-text-muted, #a1a1aa)', background: 'var(--color-bg-surface, #18181b)' }}
      >
        <span>Operations</span>
        <span style={{ color: '#818cf8' }}>actual</span>
        <span style={{ color: '#3f3f46' }}>theoretical</span>
      </div>
      <canvas
        ref={canvasRef}
        width={240}
        height={80}
        style={{ background: 'var(--color-bg-surface, #18181b)', display: 'block', width: '100%' }}
      />
    </div>
  )
}
