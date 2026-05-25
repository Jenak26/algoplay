// src/renderer/BaseRenderer.ts

export abstract class BaseRenderer<TSnapshot> {
  protected readonly canvas: HTMLCanvasElement
  protected readonly ctx:    CanvasRenderingContext2D

  private animFrameId:     number | null  = null
  private dirty:           boolean        = false
  private currentSnapshot: TSnapshot | null = null
  private resizeObserver:  ResizeObserver | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get 2D canvas context')
    this.ctx = ctx

    // Setup ResizeObserver to handle layout and routing changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.resize()
      })
      this.resizeObserver.observe(canvas)
    }
  }

  /**
   * Called from React when the step changes.
   * Marks the renderer dirty and schedules a repaint via rAF.
   */
  updateSnapshot(snapshot: TSnapshot): void {
    this.currentSnapshot = snapshot
    this.requestRender()
  }

  /** Force a repaint of the current snapshot. Useful for interactive canvas panning/zooming. */
  requestRender(): void {
    this.dirty = true
    if (this.currentSnapshot !== null && this.animFrameId === null) {
      this.animFrameId = requestAnimationFrame(this.tick)
    }
  }

  private tick = (): void => {
    this.animFrameId = null
    if (this.dirty && this.currentSnapshot !== null) {
      this.render(this.currentSnapshot)
      this.dirty = false
    }
  }

  /** Resize canvas to match its CSS size. */
  resize(): void {
    const { offsetWidth: w, offsetHeight: h } = this.canvas
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width  = w
      this.canvas.height = h
      this.dirty = true
      if (this.currentSnapshot !== null && this.animFrameId === null) {
        this.animFrameId = requestAnimationFrame(this.tick)
      }
    }
  }

  /** Clear the canvas. */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /** Cancel pending rAF and disconnect ResizeObserver. */
  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
  }

  /** Subclasses implement the actual draw logic. */
  protected abstract render(snapshot: TSnapshot): void
}
