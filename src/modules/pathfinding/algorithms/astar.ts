// src/modules/pathfinding/algorithms/astar.ts
// Stub — will be implemented in Task 4
import type { GridStepRecorder } from '@/engine/GridStepRecorder'

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

export function recordAStar(_grid: GridInput, _recorder: GridStepRecorder): void {
  throw new Error('recordAStar: not yet implemented (Task 4)')
}
