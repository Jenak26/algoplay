// src/types/GraphSnapshot.ts
import type { DebugSnapshot } from './DebugSnapshot'

export interface Vertex {
  id: number
  label: string
  x: number
  y: number
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface GraphSnapshot extends DebugSnapshot {
  readonly vertices:   readonly Vertex[]
  readonly edges:      readonly Edge[]
  readonly visited:    Readonly<Record<number, boolean>>
  readonly activeNode: number | null
  readonly activeEdge: Edge | null
  readonly visitOrder: Readonly<Record<number, number>>
  readonly parent:     Readonly<Record<number, number>>
  readonly path:       readonly number[]
  readonly queue:      readonly number[]
  readonly distance:   Readonly<Record<number, number>>
  readonly opCount:    { readonly comparisons: number; readonly operations: number }
}
