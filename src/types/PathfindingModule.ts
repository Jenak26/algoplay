// src/types/PathfindingModule.ts
import type { GridSnapshot } from './GridSnapshot'
import type { CodeSnippets }  from './AlgorithmModule'
import type { BaseRenderer }  from '@/renderer/BaseRenderer'
import type { GridStepRecorder } from '@/engine/GridStepRecorder'

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

export interface PathfindingAlgorithm {
  id:              string
  name:            string
  timeComplexity:  { best: string; average: string; worst: string }
  spaceComplexity: string
  weighted:        boolean
  record:          (grid: GridInput, recorder: GridStepRecorder) => void
  codeSnippets:    CodeSnippets
}

export interface MazeGenerator {
  id:       string
  name:     string
  generate: (w: number, h: number) => Uint8Array
}

export interface PathfindingModule {
  id:            string
  name:          string
  icon:          string
  route:         string
  algorithms:    PathfindingAlgorithm[]
  mazes:         MazeGenerator[]
  Renderer:      new (canvas: HTMLCanvasElement) => BaseRenderer<GridSnapshot>
  defaultAlgoId: string
  defaultGrid:   { width: number; height: number }
}
