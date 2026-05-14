// src/types/GridSnapshot.ts
import type { DebugSnapshot } from './DebugSnapshot'

/**
 * Cell role encoded as a small int so the cells array can live in a Uint8Array,
 * making snapshots cheap to clone and easy to RLE-encode for sharing.
 */
export const CELL = {
  OPEN:     0,
  WALL:     1,
  HEAVY:    2,   // weight 5 — passable but expensive
  START:    3,
  END:      4,
  VISITED:  5,
  FRONTIER: 6,
  PATH:     7,
} as const

export type CellRole = typeof CELL[keyof typeof CELL]

export const CELL_COLORS: Record<CellRole, string> = {
  [CELL.OPEN]:     '#18181b',
  [CELL.WALL]:     '#52525b',
  [CELL.HEAVY]:    '#7c2d12',
  [CELL.START]:    '#10b981',
  [CELL.END]:      '#ef4444',
  [CELL.VISITED]:  '#3730a3',
  [CELL.FRONTIER]: '#6366f1',
  [CELL.PATH]:     '#eab308',
}

/** Cost of traversing a cell of this role. WALL is impassable (Infinity). */
export const CELL_WEIGHT: Record<CellRole, number> = {
  [CELL.OPEN]:     1,
  [CELL.WALL]:     Infinity,
  [CELL.HEAVY]:    5,
  [CELL.START]:    1,
  [CELL.END]:      1,
  [CELL.VISITED]:  1,
  [CELL.FRONTIER]: 1,
  [CELL.PATH]:     1,
}

export interface GridSnapshot extends DebugSnapshot {
  readonly width:      number
  readonly height:     number
  /** Row-major: cell at (x,y) lives at cells[y * width + x] */
  readonly cells:      Readonly<Uint8Array>
  readonly start:      number
  readonly end:        number
  /** Per-cell visit step (0..N) for heat map; -1 = never visited */
  readonly visitOrder: Readonly<Int32Array>
  readonly opCount:    { readonly cellsVisited: number; readonly pathLength: number }
}
