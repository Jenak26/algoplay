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
        ctx.strokeStyle = '#00dbe9' // Electric Cyan for active edge
        ctx.lineWidth = 4
      } else if (isPathEdge) {
        ctx.strokeStyle = '#eab308' // Gold for shortest path
        ctx.lineWidth = 4
      } else if (isMSTEdge) {
        ctx.strokeStyle = 'rgba(0, 219, 233, 0.6)' // Semi-transparent Cyan for MST connections
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = '#3b494b' // Outline variant/Dim default edge
        ctx.lineWidth = 1.5
      }

      ctx.stroke()

      // Draw Edge Weight
      const mx = (ux + vx) / 2
      const my = (uy + vy) / 2
      ctx.fillStyle = isActiveEdge || isPathEdge ? '#ffffff' : '#b9cacb'
      ctx.font = '10px var(--font-mono, monospace)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw background circle for weight so it doesn't overlap line
      ctx.beginPath()
      ctx.arc(mx, my, 8, 0, 2 * Math.PI)
      ctx.fillStyle = '#0e0e0e' // Surface container lowest
      ctx.fill()
      
      ctx.fillStyle = isActiveEdge ? '#00dbe9' : isPathEdge ? '#eab308' : '#b9cacb'
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
      let fillStyle = '#1c1b1b' // Surface container low
      let strokeStyle = '#3b494b' // Outline variant
      let lineWidth = 2
      let labelColor = '#e5e2e1' // on-surface

      if (isActive) {
        fillStyle = '#00dbe9' // Electric Cyan active
        strokeStyle = '#ffffff'
        lineWidth = 3
        labelColor = '#000000' // Black text for high contrast on Cyan
      } else if (inPath) {
        fillStyle = '#eab308' // Gold path
        strokeStyle = '#ffffff'
        lineWidth = 2.5
        labelColor = '#000000' // Black text for high contrast on Gold
      } else if (isVisited) {
        fillStyle = 'rgba(0, 227, 131, 0.15)' // Transparent Emerald success
        strokeStyle = '#00e383' // Emerald
        lineWidth = 2
        labelColor = '#00e383'
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
      ctx.fillStyle = labelColor
      ctx.font = 'bold 12px var(--font-sans, sans-serif)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, nx, ny)

      // Draw Distance label if computed (for Dijkstra)
      if (hasDistance && !isActive && !inPath) {
        ctx.fillStyle = isVisited ? '#00e383' : '#b9cacb'
        ctx.font = '10px var(--font-mono, monospace)'
        ctx.fillText(`d:${distance[node.id]}`, nx, ny + radius + 12)
      } else if (distance[node.id] === Infinity && !isActive) {
        ctx.fillStyle = '#849495' // Outline gray
        ctx.font = '10px var(--font-mono, monospace)'
        ctx.fillText('d:∞', nx, ny + radius + 12)
      }
    }
  }
}
