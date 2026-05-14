// src/modules/pathfinding/algorithms/dijkstra.ts
// Stub — will be implemented in Task 4
import type { GridStepRecorder } from '@/engine/GridStepRecorder'

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

export function recordDijkstra(_grid: GridInput, _recorder: GridStepRecorder): void {
  throw new Error('recordDijkstra: not yet implemented (Task 4)')
}
