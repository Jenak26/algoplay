// src/types/StepSnapshot.ts

export type HighlightRole =
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'
  | 'min'
  | 'key'
  | 'default'

export const HIGHLIGHT_COLORS: Record<HighlightRole, string> = {
  comparing: '#eab308',
  swapping:  '#ef4444',
  sorted:    '#10b981',
  pivot:     '#f97316',
  min:       '#ef4444',
  key:       '#eab308',
  default:   '#6366f1',
}

export interface StepSnapshot {
  readonly array:       readonly number[]
  readonly highlights:  ReadonlyMap<number, HighlightRole>
  readonly pointers:    Readonly<Record<string, number>>
  readonly opCount:     { readonly comparisons: number; readonly swaps: number }
  readonly codeLine:    number
  readonly description: string
}
