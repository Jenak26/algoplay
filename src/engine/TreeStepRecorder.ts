// src/engine/TreeStepRecorder.ts
import type { TreeSnapshot, TreeNode } from '@/types/TreeSnapshot'

type CaptureInput = {
  nodes:           readonly TreeNode[]
  activeNode:      number | null
  visited:         Record<number, boolean>
  traversalOutput: readonly number[]
  pointers:        Record<string, number | null>
  activeEdge:      { from: number; to: number } | null
  queue:           readonly number[]
  codeLine:        number
  description:     string
}

export class TreeStepRecorder {
  private steps:       TreeSnapshot[] = []
  private comparisons: number = 0
  private operations:  number = 0

  comparison(): void { this.comparisons++ }
  operation():  void { this.operations++ }

  capture(input: CaptureInput): void {
    this.steps.push({
      nodes:           input.nodes.map(n => ({ ...n })),
      activeNode:      input.activeNode,
      visited:         { ...input.visited },
      traversalOutput: [...input.traversalOutput],
      pointers:        { ...input.pointers },
      activeEdge:      input.activeEdge ? { ...input.activeEdge } : null,
      queue:           [...input.queue],
      opCount: {
        comparisons: this.comparisons,
        operations:  this.operations,
      },
      codeLine:    input.codeLine,
      description: input.description,
    })
  }

  getSteps(): readonly TreeSnapshot[] {
    return Object.freeze([...this.steps])
  }

  reset(): void {
    this.steps       = []
    this.comparisons = 0
    this.operations  = 0
  }
}
