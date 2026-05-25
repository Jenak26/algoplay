// src/types/DPSnapshot.ts
import type { DebugSnapshot } from './DebugSnapshot'

export interface CellCoord {
  r: number
  c: number
}

export interface DPSnapshot extends DebugSnapshot {
  readonly table:           readonly (readonly number[])[]
  readonly rowLabels:       readonly string[]
  readonly colLabels:       readonly string[]
  readonly currentRow:      number | null
  readonly currentCol:      number | null
  readonly dependencyCells: readonly CellCoord[]
  readonly opCount:         { readonly comparisons: number; readonly operations: number }
}
