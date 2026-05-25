// src/engine/GraphStepRecorder.ts
import type { GraphSnapshot, Vertex, Edge } from '@/types/GraphSnapshot'

type CaptureInput = {
  vertices:   readonly Vertex[]
  edges:      readonly Edge[]
  visited:    Record<number, boolean>
  activeNode: number | null
  activeEdge: Edge | null
  visitOrder: Record<number, number>
  parent:     Record<number, number>
  path:       readonly number[]
  queue:      readonly number[]
  distance:   Record<number, number>
  codeLine:    number
  description: string
}

export class GraphStepRecorder {
  private steps:       GraphSnapshot[] = []
  private comparisons: number = 0
  private operations:  number = 0

  comparison(): void { this.comparisons++ }
  operation():  void { this.operations++ }

  capture(input: CaptureInput): void {
    this.steps.push({
      vertices:   [...input.vertices],
      edges:      [...input.edges],
      visited:    { ...input.visited },
      activeNode: input.activeNode,
      activeEdge: input.activeEdge ? { ...input.activeEdge } : null,
      visitOrder: { ...input.visitOrder },
      parent:     { ...input.parent },
      path:       [...input.path],
      queue:      [...input.queue],
      distance:   { ...input.distance },
      opCount: {
        comparisons: this.comparisons,
        operations:  this.operations,
      },
      codeLine:    input.codeLine,
      description: input.description,
    })
  }

  getSteps(): readonly GraphSnapshot[] {
    return Object.freeze([...this.steps])
  }

  reset(): void {
    this.steps       = []
    this.comparisons = 0
    this.operations  = 0
  }
}
