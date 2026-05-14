// src/engine/GridStepRecorder.ts
import type { GridSnapshot } from '@/types/GridSnapshot'

type CaptureInput = {
  width:       number
  height:      number
  cells:       Uint8Array
  start:       number
  end:         number
  visitOrder:  Int32Array
  codeLine:    number
  description: string
}

export class GridStepRecorder {
  private steps:         GridSnapshot[] = []
  private cellsVisited:  number = 0
  private pathLength:    number = 0

  visit():        void { this.cellsVisited++ }
  setPath(n: number): void { this.pathLength = n }

  capture(input: CaptureInput): void {
    // Copy the typed arrays so consumers can mutate freely between captures
    const cells      = new Uint8Array(input.cells)
    const visitOrder = new Int32Array(input.visitOrder)
    this.steps.push({
      width:       input.width,
      height:      input.height,
      cells,
      start:       input.start,
      end:         input.end,
      visitOrder,
      codeLine:    input.codeLine,
      description: input.description,
      opCount: {
        cellsVisited: this.cellsVisited,
        pathLength:   this.pathLength,
      },
    })
  }

  getSteps(): readonly GridSnapshot[] {
    return this.steps.slice()
  }

  reset(): void {
    this.steps        = []
    this.cellsVisited = 0
    this.pathLength   = 0
  }
}
