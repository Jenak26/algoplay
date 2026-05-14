// src/types/URLState.ts

export interface URLState {
  /** Schema version — increment on breaking changes to keep old links valid */
  v:       1
  module:  string
  algo?:   string
  array?:  number[]
  speed?:  number
  lang?:   'pseudocode' | 'python' | 'javascript'
  /** Run-length encoded grid string (pathfinding module only) */
  grid?:   string
  gridW?:  number
  gridH?:  number
  start?:  [number, number]
  end?:    [number, number]
}

export function isURLState(val: unknown): val is URLState {
  return (
    typeof val === 'object' &&
    val !== null &&
    (val as URLState).v === 1 &&
    typeof (val as URLState).module === 'string'
  )
}
