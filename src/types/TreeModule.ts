// src/types/TreeModule.ts
import type { TreeSnapshot, TreeNode } from './TreeSnapshot'
import type { CodeSnippets } from './AlgorithmModule'
import type { BaseRenderer } from '@/renderer/BaseRenderer'
import type { TreeStepRecorder } from '@/engine/TreeStepRecorder'

export interface TreeInput {
  nodes:        readonly TreeNode[]
  rootId:       number | null
  valToOperate?: number
}

export interface TreeAlgorithm {
  id:              string
  name:            string
  timeComplexity:  { best: string; average: string; worst: string }
  spaceComplexity: string
  record:          (input: TreeInput, recorder: TreeStepRecorder) => void
  codeSnippets:    CodeSnippets
}

export interface TreeModule {
  id:            string
  name:          string
  icon:          string
  route:         string
  algorithms:    TreeAlgorithm[]
  Renderer:      new (canvas: HTMLCanvasElement) => BaseRenderer<TreeSnapshot>
  defaultAlgoId: string
}
