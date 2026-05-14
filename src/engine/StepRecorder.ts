// src/engine/StepRecorder.ts
import type { StepSnapshot, HighlightRole } from '@/types/StepSnapshot'

type CaptureInput = {
  array:       readonly number[]
  highlights:  ReadonlyMap<number, HighlightRole>
  pointers:    Readonly<Record<string, number>>
  codeLine:    number
  description: string
}

export class StepRecorder {
  private steps:       StepSnapshot[] = []
  private comparisons: number = 0
  private swaps:       number = 0

  comparison(): void { this.comparisons++ }
  swap():        void { this.swaps++ }

  capture(input: CaptureInput): void {
    this.steps.push({
      array:       Object.freeze([...input.array]),
      highlights:  new Map(input.highlights),
      pointers:    { ...input.pointers },
      opCount:     { comparisons: this.comparisons, swaps: this.swaps },
      codeLine:    input.codeLine,
      description: input.description,
    })
  }

  getSteps(): readonly StepSnapshot[] {
    return Object.freeze([...this.steps])
  }

  reset(): void {
    this.steps       = []
    this.comparisons = 0
    this.swaps       = 0
  }
}
