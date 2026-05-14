// src/modules/sorting/SortRenderer.ts
import { BaseRenderer } from '@/renderer/BaseRenderer'
import { HIGHLIGHT_COLORS } from '@/types/StepSnapshot'
import type { StepSnapshot } from '@/types/StepSnapshot'

export class SortRenderer extends BaseRenderer<StepSnapshot> {
  protected render(snapshot: StepSnapshot): void {
    const { width: w, height: h } = this.canvas
    this.clear()

    const n = snapshot.array.length
    if (n === 0) return

    // Cache max once per frame — the original project's O(n)-per-bar bug is fixed here
    const maxVal = Math.max(...snapshot.array, 1)

    // Gap shrinks as n grows so bars stay visible
    const gap = n > 200 ? 0 : n > 100 ? 1 : 2
    const barW = Math.max(1, (w - gap * (n - 1)) / n)
    const paddingTop = 8
    const availH = h - paddingTop

    snapshot.array.forEach((val, i) => {
      const role = snapshot.highlights.get(i) ?? 'default'
      const barH = Math.max(2, (val / maxVal) * availH)
      const x = i * (barW + gap)
      const y = h - barH

      this.ctx.fillStyle = HIGHLIGHT_COLORS[role]
      // Floor/ceil prevents sub-pixel blurriness at non-integer bar widths
      this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(barW), Math.ceil(barH))
    })
  }
}
