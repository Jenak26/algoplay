// src/types/GraphModule.ts
import type { GraphSnapshot } from './GraphSnapshot'
import type { CodeSnippets } from './AlgorithmModule'
import type { BaseRenderer } from '@/renderer/BaseRenderer'
import type { GraphStepRecorder } from '@/engine/GraphStepRecorder'

export interface GraphInput {
  vertices:  readonly { id: number; label: string; x: number; y: number }[]
  edges:     readonly { from: number; to: number; weight: number }[]
  startNode: number
}

export interface GraphAlgorithm {
  id:              string
  name:            string
  timeComplexity:  { best: string; average: string; worst: string }
  spaceComplexity: string
  record:          (input: GraphInput, recorder: GraphStepRecorder) => void
  codeSnippets:    CodeSnippets
}

export interface GraphModule {
  id:            string
  name:          string
  icon:          string
  route:         string
  algorithms:    GraphAlgorithm[]
  Renderer:      new (canvas: HTMLCanvasElement) => BaseRenderer<GraphSnapshot>
  defaultAlgoId: string
}
