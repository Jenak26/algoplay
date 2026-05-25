// src/renderer/BaseRenderer.ts

export abstract class BaseRenderer<TSnapshot> {
  protected readonly canvas: HTMLCanvasElement
  protected readonly ctx:    CanvasRenderingContext2D

  private animFrameId:     number | null  = null
  private dirty:           boolean        = false
  private currentSnapshot: TSnapshot | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get 2D canvas context')
    this.ctx = ctx
  }

  /**
   * Called from React (via useCanvasRenderer hook) when the step changes.
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

  /** Resize canvas to match its CSS size. Call on window resize. */
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

  /** Cancel pending rAF. Call in React cleanup (useEffect return). */
  destroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
  }

  /** Subclasses implement the actual draw logic. */
  protected abstract render(snapshot: TSnapshot): void
}
