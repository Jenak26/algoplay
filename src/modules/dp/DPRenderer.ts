// src/modules/dp/DPRenderer.ts
import { BaseRenderer } from '@/renderer/BaseRenderer'
import type { DPSnapshot } from '@/types/DPSnapshot'

export class DPRenderer extends BaseRenderer<DPSnapshot> {
  protected render(snapshot: DPSnapshot): void {
    this.clear()

    const { table, rowLabels, colLabels, currentRow, currentCol, dependencyCells } = snapshot
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height

    const rows = table.length
    const cols = table[0]?.length ?? 0
    if (rows === 0 || cols === 0) return

    // Calculate cell dimensions
    const labelWidth = 90
    const labelHeight = 40
    
    const cellWidth = (w - labelWidth) / cols
    const cellHeight = (h - labelHeight) / rows

    // Draw Column Labels (Headers)
    ctx.fillStyle = '#b9cacb' // on-surface-variant
    ctx.font = 'bold 11px var(--font-mono, monospace)' // label-caps style
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let c = 0; c < cols; c++) {
      const cx = labelWidth + c * cellWidth + cellWidth / 2
      const cy = labelHeight / 2
      ctx.fillText(colLabels[c], cx, cy)
    }

    // Draw Row Labels (Headers)
    ctx.textAlign = 'left'
    ctx.font = 'bold 11px var(--font-mono, monospace)'
    for (let r = 0; r < rows; r++) {
      const cx = 10
      const cy = labelHeight + r * cellHeight + cellHeight / 2
      ctx.fillText(rowLabels[r], cx, cy)
    }

    // Draw Grid Cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = labelWidth + c * cellWidth
        const y = labelHeight + r * cellHeight

        const isCurrent = currentRow === r && currentCol === c
        const isDependency = dependencyCells.some(cell => cell.r === r && cell.c === c)

        // Select background cell fill
        let fillStyle = '#131313' // Near-black default cell background
        let strokeStyle = '#3b494b' // Outline variant
        let lineWidth = 1

        if (isCurrent) {
          fillStyle = 'rgba(0, 219, 233, 0.15)' // Cyan active glow
          strokeStyle = '#00dbe9' // Cyan
          lineWidth = 2
        } else if (isDependency) {
          fillStyle = 'rgba(0, 227, 131, 0.15)' // Emerald dependency glow
          strokeStyle = '#00e383' // Emerald
          lineWidth = 1.5
        } else if (currentRow !== null && currentCol !== null && (r < currentRow || (r === currentRow && c < currentCol))) {
          fillStyle = '#0e0e0e' // Surface container lowest for computed/completed cells
        }

        ctx.fillStyle = fillStyle
        ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)

        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)

        // Draw Cell Value
        const val = table[r][c]
        ctx.fillStyle = isCurrent ? '#00dbe9' : isDependency ? '#00e383' : '#e5e2e1'
        ctx.font = '13px var(--font-mono, monospace)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(val.toString(), x + cellWidth / 2, y + cellHeight / 2)
      }
    }

    // Draw Lookback Dependency Curves/Arrows (from current active cell to its dependencies)
    if (currentRow !== null && currentCol !== null && dependencyCells.length > 0) {
      const activeX = labelWidth + currentCol * cellWidth + cellWidth / 2
      const activeY = labelHeight + currentRow * cellHeight + cellHeight / 2

      ctx.lineWidth = 2.5
      ctx.strokeStyle = '#eab308' // Gold line for lookback paths
      
      for (const dep of dependencyCells) {
        const depX = labelWidth + dep.c * cellWidth + cellWidth / 2
        const depY = labelHeight + dep.r * cellHeight + cellHeight / 2

        // Draw curve path
        ctx.beginPath()
        ctx.moveTo(activeX, activeY)
        
        // Control point for quadratic curve to make it look smooth
        const cpX = (activeX + depX) / 2
        const cpY = Math.min(activeY, depY) - 30
        
        ctx.quadraticCurveTo(cpX, cpY, depX, depY)
        ctx.setLineDash([4, 4]) // Dashed lines
        ctx.stroke()
        ctx.setLineDash([]) // Reset solid lines

        // Draw tiny circle at target lookback cell center
        ctx.beginPath()
        ctx.arc(depX, depY, 4, 0, 2 * Math.PI)
        ctx.fillStyle = '#eab308'
        ctx.fill()
      }
    }
  }
}
