// src/types/DebugSnapshot.ts

/**
 * Minimal shape every debugger frame must satisfy regardless of module.
 * Module-specific snapshots (StepSnapshot for sorts, GridSnapshot for grids)
 * extend this so the shared useDebuggerStore can hold either.
 */
export interface DebugSnapshot {
  readonly codeLine:    number
  readonly description: string
}
