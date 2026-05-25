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
    ctx.fillStyle = '#6b7280'
    ctx.font = 'bold 11px var(--font-sans, sans-serif)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let c = 0; c < cols; c++) {
      const cx = labelWidth + c * cellWidth + cellWidth / 2
      const cy = labelHeight / 2
      ctx.fillText(colLabels[c], cx, cy)
    }

    // Draw Row Labels (Headers)
    ctx.textAlign = 'left'
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
        let fillStyle = 'rgba(255, 255, 255, 0.02)'
        let strokeStyle = 'rgba(255, 255, 255, 0.06)'
        let lineWidth = 1

        if (isCurrent) {
          fillStyle = 'rgba(99, 102, 241, 0.2)' // Indigo glow for active cell
          strokeStyle = '#6366f1'
          lineWidth = 2
        } else if (isDependency) {
          fillStyle = 'rgba(16, 185, 129, 0.15)' // Green glow for dependencies / backtracking path
          strokeStyle = '#10b981'
          lineWidth = 1.5
        } else if (currentRow !== null && currentCol !== null && (r < currentRow || (r === currentRow && c < currentCol))) {
          fillStyle = 'rgba(255, 255, 255, 0.05)' // Dim gray for completed cells
        }

        ctx.fillStyle = fillStyle
        ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)

        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4)

        // Draw Cell Value
        const val = table[r][c]
        ctx.fillStyle = isCurrent ? '#a5b4fc' : isDependency ? '#34d399' : '#ffffff'
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
      ctx.strokeStyle = '#f59e0b' // Gold line
      
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
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
      }
    }
  }
}
