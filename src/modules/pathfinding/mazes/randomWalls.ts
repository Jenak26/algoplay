// src/modules/pathfinding/mazes/randomWalls.ts
import { CELL } from '@/types/GridSnapshot'

export function generateRandomWalls(w: number, h: number, density = 0.3): Uint8Array {
  const cells = new Uint8Array(w * h).fill(CELL.OPEN)
  const corners = new Set([0, w - 1, (h - 1) * w, h * w - 1])
  for (let i = 0; i < cells.length; i++) {
    if (corners.has(i)) continue
    if (Math.random() < density) cells[i] = CELL.WALL
  }
  return cells
}