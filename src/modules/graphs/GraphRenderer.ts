// src/modules/graphs/GraphRenderer.ts
import { BaseRenderer } from '@/renderer/BaseRenderer'
import type { GraphSnapshot } from '@/types/GraphSnapshot'

export class GraphRenderer extends BaseRenderer<GraphSnapshot> {
  protected render(snapshot: GraphSnapshot): void {
    this.clear()

    const { vertices, edges, visited, activeNode, activeEdge, parent, path, distance } = snapshot
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height

    // Draw Edges first (so they sit underneath vertices)
    for (const edge of edges) {
      const u = vertices.find(v => v.id === edge.from)
      const v = vertices.find(v => v.id === edge.to)
      if (!u || !v) continue

      // Translate coordinates to screen coordinates
      const ux = u.x * w
      const uy = u.y * h
      const vx = v.x * w
      const vy = v.y * h

      // Determine edge styling
      let isPathEdge = false
      if (path.length > 0) {
        const uIdxInPath = path.indexOf(u.id)
        const vIdxInPath = path.indexOf(v.id)
        if (uIdxInPath !== -1 && vIdxInPath !== -1 && Math.abs(uIdxInPath - vIdxInPath) === 1) {
          isPathEdge = true
        }
      }

      const isMSTEdge = parent[u.id] === v.id || parent[v.id] === u.id
      const isActiveEdge = activeEdge && (
        (activeEdge.from === edge.from && activeEdge.to === edge.to) ||
        (activeEdge.from === edge.to && activeEdge.to === edge.from)
      )

      ctx.beginPath()
      ctx.moveTo(ux, uy)
      ctx.lineTo(vx, vy)

      if (isActiveEdge) {
        ctx.strokeStyle = '#f59e0b' // Yellow-orange for active edge
        ctx.lineWidth = 4
      } else if (isPathEdge) {
        ctx.strokeStyle = '#eab308' // Gold for shortest path
        ctx.lineWidth = 4
      } else if (isMSTEdge) {
        ctx.strokeStyle = '#6366f1' // Indigo for MST parent connections
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)' // Dim default edge
        ctx.lineWidth = 1.5
      }

      ctx.stroke()

      // Draw Edge Weight
      const mx = (ux + vx) / 2
      const my = (uy + vy) / 2
      ctx.fillStyle = isActiveEdge || isPathEdge ? '#ffffff' : '#9ca3af'
      ctx.font = '10px var(--font-mono, monospace)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw background circle for weight so it doesn't overlap line
      ctx.beginPath()
      ctx.arc(mx, my, 8, 0, 2 * Math.PI)
      ctx.fillStyle = '#111827'
      ctx.fill()
      
      ctx.fillStyle = isActiveEdge || isPathEdge ? '#eab308' : '#9ca3af'
      ctx.fillText(edge.weight.toString(), mx, my)
    }

    // Draw Vertices
    const radius = 18
    for (const node of vertices) {
      const nx = node.x * w
      const ny = node.y * h

      const isVisited = visited[node.id]
      const isActive = activeNode === node.id
      const inPath = path.includes(node.id)
      const hasDistance = distance[node.id] !== undefined && distance[node.id] !== Infinity

      // Determine fill and stroke colors
      let fillStyle = '#1f2937' // Default dark gray
      let strokeStyle = 'rgba(255, 255, 255, 0.2)'
      let lineWidth = 2

      if (isActive) {
        fillStyle = '#4f46e5' // Bright Indigo
        strokeStyle = '#ffffff'
        lineWidth = 3
      } else if (inPath) {
        fillStyle = '#b45309' // Warm Amber
        strokeStyle = '#f59e0b'
        lineWidth = 2.5
      } else if (isVisited) {
        fillStyle = '#312e81' // Deep purple-blue
        strokeStyle = '#818cf8'
        lineWidth = 2
      }

      // Draw Vertex Circle
      ctx.beginPath()
      ctx.arc(nx, ny, radius, 0, 2 * Math.PI)
      ctx.fillStyle = fillStyle
      ctx.fill()
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.stroke()

      // Draw Vertex Label
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px var(--font-sans, sans-serif)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, nx, ny)

      // Draw Distance label if computed (for Dijkstra)
      if (hasDistance && !isActive && !inPath) {
        ctx.fillStyle = '#818cf8'
        ctx.font = '10px var(--font-mono, monospace)'
        ctx.fillText(`d:${distance[node.id]}`, nx, ny + radius + 12)
      } else if (distance[node.id] === Infinity && !isActive) {
        ctx.fillStyle = '#6b7280'
        ctx.font = '10px var(--font-mono, monospace)'
        ctx.fillText('d:∞', nx, ny + radius + 12)
      }
    }
  }
}
