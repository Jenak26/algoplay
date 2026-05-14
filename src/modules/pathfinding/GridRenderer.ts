// src/modules/pathfinding/GridRenderer.ts
import { BaseRenderer } from '@/renderer/BaseRenderer'
import { CELL, CELL_COLORS, type CellRole } from '@/types/GridSnapshot'
import type { GridSnapshot } from '@/types/GridSnapshot'

/**
 * Renders a GridSnapshot. When heatMapEnabled is true, VISITED cells are
 * tinted by visitOrder (blue -> red gradient) instead of the flat indigo.
 */
export class GridRenderer extends BaseRenderer<GridSnapshot> {
  public heatMapEnabled = false

  protected render(snapshot: GridSnapshot): void {
    const { width: w, height: h } = this.canvas
    this.clear()

    const cols = snapshot.width
    const rows = snapshot.height
    if (cols === 0 || rows === 0) return

    const cellW = w / cols
    const cellH = h / rows

    let maxVisit = 0
    if (this.heatMapEnabled) {
      for (let i = 0; i < snapshot.visitOrder.length; i++) {
        if (snapshot.visitOrder[i] > maxVisit) maxVisit = snapshot.visitOrder[i]
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx  = y * cols + x
        const role = snapshot.cells[idx] as CellRole

        let fill = CELL_COLORS[role]
        if (this.heatMapEnabled && role === CELL.VISITED && maxVisit > 0) {
          const t = snapshot.visitOrder[idx] / maxVisit
          fill = heatColor(t)
        }

        this.ctx.fillStyle = fill
        this.ctx.fillRect(
          Math.floor(x * cellW),
          Math.floor(y * cellH),
          Math.ceil(cellW) + 1,
          Math.ceil(cellH) + 1,
        )
      }
    }

    if (cellW >= 12 && cellH >= 12) {
      this.ctx.strokeStyle = 'rgba(0,0,0,0.25)'
      this.ctx.lineWidth = 1
      for (let x = 0; x <= cols; x++) {
        const px = Math.floor(x * cellW) + 0.5
        this.ctx.beginPath()
        this.ctx.moveTo(px, 0)
        this.ctx.lineTo(px, h)
        this.ctx.stroke()
      }
      for (let y = 0; y <= rows; y++) {
        const py = Math.floor(y * cellH) + 0.5
        this.ctx.beginPath()
        this.ctx.moveTo(0, py)
        this.ctx.lineTo(w, py)
        this.ctx.stroke()
      }
    }
  }
}

/** Blue (cold/early) -> red (hot/late) gradient. t in [0,1]. */
function heatColor(t: number): string {
  const r = Math.round(255 * t)
  const b = Math.round(255 * (1 - t))
  const g = Math.round(64 * (1 - Math.abs(t - 0.5) * 2))
  return `rgb(${r},${g},${b})`
}
