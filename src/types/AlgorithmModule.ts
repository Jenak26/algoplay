// src/types/AlgorithmModule.ts
import type { StepSnapshot } from './StepSnapshot'
import type { BaseRenderer } from '@/renderer/BaseRenderer'

export interface CodeSnippets {
  pseudocode: readonly string[]
  python:     readonly string[]
  javascript: readonly string[]
  /** lineMap[stepIndex] = line number (0-indexed) in the active language view */
  lineMap:    readonly number[]
}

export interface AlgorithmDefinition {
  id:              string
  name:            string
  timeComplexity:  { best: string; average: string; worst: string }
  spaceComplexity: string
  stable:          boolean
  /** Pure function — records steps into recorder, returns void */
  record:          (array: number[], recorder: import('@/engine/StepRecorder').StepRecorder) => void
  codeSnippets:    CodeSnippets
}

export interface AlgorithmModule {
  id:            string
  name:          string
  icon:          string
  route:         string
  algorithms:    AlgorithmDefinition[]
  /** Canvas renderer class (not instance) */
  Renderer:      new (canvas: HTMLCanvasElement) => BaseRenderer<StepSnapshot>
  defaultAlgoId: string
}
