// src/modules/trees/TreeRenderer.ts
import { BaseRenderer } from '@/renderer/BaseRenderer'
import type { TreeSnapshot } from '@/types/TreeSnapshot'

export class TreeRenderer extends BaseRenderer<TreeSnapshot> {
  protected render(snapshot: TreeSnapshot): void {
    this.clear()

    const { nodes, activeNode, visited, activeEdge } = snapshot
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height

    // Draw Edges first
    for (const node of nodes) {
      if (node.parentId === null) continue
      const parent = nodes.find(n => n.id === node.parentId)
      if (!parent) continue

      const px = parent.x * w
      const py = parent.y * h
      const cx = node.x * w
      const cy = node.y * h

      const isActiveEdge = activeEdge && (
        (activeEdge.from === parent.id && activeEdge.to === node.id)
      )

      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(cx, cy)

      if (isActiveEdge) {
        ctx.strokeStyle = '#f59e0b' // Yellow-orange for active traversal edge
        ctx.lineWidth = 4.5
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
        ctx.lineWidth = 2
      }
      ctx.stroke()
    }

    // Draw Nodes
    const radius = 18
    for (const node of nodes) {
      const nx = node.x * w
      const ny = node.y * h

      const isVisited = visited[node.id]
      const isActive = activeNode === node.id

      let fillStyle = '#1f2937' // Default dark gray
      let strokeStyle = 'rgba(255, 255, 255, 0.2)'
      let lineWidth = 2

      if (isActive) {
        fillStyle = '#4f46e5' // Bright Indigo
        strokeStyle = '#ffffff'
        lineWidth = 3
      } else if (isVisited) {
        fillStyle = '#312e81' // Deep purple-blue
        strokeStyle = '#818cf8'
        lineWidth = 2
      }

      // Draw Node Circle
      ctx.beginPath()
      ctx.arc(nx, ny, radius, 0, 2 * Math.PI)
      ctx.fillStyle = fillStyle
      ctx.fill()
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.stroke()

      // Draw Node Value
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px var(--font-sans, sans-serif)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.val.toString(), nx, ny)
    }
  }
}
