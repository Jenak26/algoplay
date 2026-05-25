// src/types/TreeSnapshot.ts
import type { DebugSnapshot } from './DebugSnapshot'

export interface TreeNode {
  id: number
  val: number
  x: number
  y: number
  leftId: number | null
  rightId: number | null
  parentId: number | null
}

export interface TreeSnapshot extends DebugSnapshot {
  readonly nodes:           readonly TreeNode[]
  readonly activeNode:      number | null
  readonly visited:         Readonly<Record<number, boolean>>
  readonly traversalOutput: readonly number[]
  readonly pointers:        Readonly<Record<string, number | null>>
  readonly activeEdge:      { from: number; to: number } | null
  readonly queue:           readonly number[]
  readonly opCount:         { readonly comparisons: number; readonly operations: number }
}
