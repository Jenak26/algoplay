// src/modules/trees/TreeRenderer.ts
import { BaseRenderer } from '@/renderer/BaseRenderer'
import type { TreeSnapshot } from '@/types/TreeSnapshot'

export class TreeRenderer extends BaseRenderer<TreeSnapshot> {
  private panX = 0
  private panY = 0
  private zoom = 1
  private isDragging = false
  private startX = 0
  private startY = 0

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.canvas.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mouseup', this.onMouseUp)
    this.canvas.addEventListener('mouseleave', this.onMouseLeave)
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false })
    this.canvas.addEventListener('dblclick', this.onDblClick)
  }

  destroy(): void {
    super.destroy()
    this.canvas.removeEventListener('mousedown', this.onMouseDown)
    this.canvas.removeEventListener('mousemove', this.onMouseMove)
    this.canvas.removeEventListener('mouseup', this.onMouseUp)
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave)
    this.canvas.removeEventListener('wheel', this.onWheel)
    this.canvas.removeEventListener('dblclick', this.onDblClick)
  }

  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true
    this.startX = e.clientX - this.panX
    this.startY = e.clientY - this.panY
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return
    this.panX = e.clientX - this.startX
    this.panY = e.clientY - this.startY
    this.requestRender()
  }

  private onMouseUp = () => {
    this.isDragging = false
  }

  private onMouseLeave = () => {
    this.isDragging = false
  }

  private onDblClick = () => {
    this.panX = 0
    this.panY = 0
    this.zoom = 1
    this.requestRender()
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const zoomFactor = 1.1
    const oldZoom = this.zoom

    if (e.deltaY < 0) {
      this.zoom = Math.min(this.zoom * zoomFactor, 5)
    } else {
      this.zoom = Math.max(this.zoom / zoomFactor, 0.3)
    }

    const rect = this.canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    this.panX = mouseX - (mouseX - this.panX) * (this.zoom / oldZoom)
    this.panY = mouseY - (mouseY - this.panY) * (this.zoom / oldZoom)

    this.requestRender()
  }

  protected render(snapshot: TreeSnapshot): void {
    this.clear()

    const { nodes, activeNode, visited, activeEdge } = snapshot
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height

    ctx.save()
    ctx.translate(this.panX, this.panY)
    ctx.scale(this.zoom, this.zoom)

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

    ctx.restore()
  }
}
