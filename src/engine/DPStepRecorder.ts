// src/engine/DPStepRecorder.ts
import type { DPSnapshot, CellCoord } from '@/types/DPSnapshot'

type CaptureInput = {
  table:           number[][]
  rowLabels:       readonly string[]
  colLabels:       readonly string[]
  currentRow:      number | null
  currentCol:      number | null
  dependencyCells: readonly CellCoord[]
  codeLine:        number
  description:     string
}

export class DPStepRecorder {
  private steps:       DPSnapshot[] = []
  private comparisons: number = 0
  private operations:  number = 0

  comparison(): void { this.comparisons++ }
  operation():  void { this.operations++ }

  capture(input: CaptureInput): void {
    const tableClone = input.table.map(row => [...row])
    
    this.steps.push({
      table:           tableClone,
      rowLabels:       [...input.rowLabels],
      colLabels:       [...input.colLabels],
      currentRow:      input.currentRow,
      currentCol:      input.currentCol,
      dependencyCells: [...input.dependencyCells],
      opCount: {
        comparisons: this.comparisons,
        operations:  this.operations,
      },
      codeLine:    input.codeLine,
      description: input.description,
    })
  }

  getSteps(): readonly DPSnapshot[] {
    return Object.freeze([...this.steps])
  }

  reset(): void {
    this.steps       = []
    this.comparisons = 0
    this.operations  = 0
  }
}
