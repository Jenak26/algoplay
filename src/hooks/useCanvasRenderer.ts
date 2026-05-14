// src/hooks/useCanvasRenderer.ts
import { useEffect, useRef, type RefObject } from 'react'
import type { BaseRenderer } from '@/renderer/BaseRenderer'

/**
 * Wires a React canvas element to an imperative BaseRenderer subclass.
 * Returns a ref to attach to <canvas>.
 *
 * @example
 * const canvasRef = useCanvasRenderer(SortRenderer, currentSnapshot)
 * return <canvas ref={canvasRef} />
 */
export function useCanvasRenderer<TSnapshot>(
  RendererClass: new (canvas: HTMLCanvasElement) => BaseRenderer<TSnapshot>,
  snapshot: TSnapshot | null
): RefObject<HTMLCanvasElement | null> {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<BaseRenderer<TSnapshot> | null>(null)

  // Create renderer once on mount, destroy on unmount
  useEffect(() => {
    if (!canvasRef.current) return
    rendererRef.current = new RendererClass(canvasRef.current)
    rendererRef.current.resize()

    const onResize = () => rendererRef.current?.resize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      rendererRef.current?.destroy()
      rendererRef.current = null
    }
  }, [RendererClass])

  // Push new snapshot to renderer whenever it changes
  useEffect(() => {
    if (snapshot !== null) {
      rendererRef.current?.updateSnapshot(snapshot)
    }
  }, [snapshot])

  return canvasRef
}
