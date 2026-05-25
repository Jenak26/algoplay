// src/types/DPModule.ts
import type { DPSnapshot } from './DPSnapshot'
import type { CodeSnippets } from './AlgorithmModule'
import type { BaseRenderer } from '@/renderer/BaseRenderer'
import type { DPStepRecorder } from '@/engine/DPStepRecorder'

export interface DPInput {
  rowString:   string
  colString:   string
  customData?: any
}

export interface DPAlgorithm {
  id:              string
  name:            string
  timeComplexity:  { best: string; average: string; worst: string }
  spaceComplexity: string
  record:          (input: DPInput, recorder: DPStepRecorder) => void
  codeSnippets:    CodeSnippets
}

export interface DPModule {
  id:            string
  name:          string
  icon:          string
  route:         string
  algorithms:    DPAlgorithm[]
  Renderer:      new (canvas: HTMLCanvasElement) => BaseRenderer<DPSnapshot>
  defaultAlgoId: string
}
