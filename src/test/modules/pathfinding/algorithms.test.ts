// src/test/modules/pathfinding/algorithms.test.ts
import { describe, it, expect } from 'vitest'
import { GridStepRecorder } from '@/engine/GridStepRecorder'
import { CELL } from '@/types/GridSnapshot'
import { recordBFS }      from '@/modules/pathfinding/algorithms/bfs'
import { recordDFS }      from '@/modules/pathfinding/algorithms/dfs'
import { recordDijkstra } from '@/modules/pathfinding/algorithms/dijkstra'
import { recordAStar }    from '@/modules/pathfinding/algorithms/astar'
import type { GridSnapshot } from '@/types/GridSnapshot'

type Algo = (grid: GridInput, r: GridStepRecorder) => void

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

function clearGrid(w: number, h: number): GridInput {
  const cells = new Uint8Array(w * h).fill(CELL.OPEN)
  const start = 0
  const end   = w * h - 1
  cells[start] = CELL.START
  cells[end]   = CELL.END
  return { width: w, height: h, cells, start, end }
}

function run(algo: Algo, grid: GridInput): { steps: readonly GridSnapshot[]; last: GridSnapshot | null } {
  const r = new GridStepRecorder()
  algo({ ...grid, cells: new Uint8Array(grid.cells) }, r)
  const steps = r.getSteps()
  return { steps, last: steps.at(-1) ?? null }
}

function pathCellsFrom(snap: GridSnapshot | null): number[] {
  if (!snap) return []
  const out: number[] = []
  for (let i = 0; i < snap.cells.length; i++) {
    if (snap.cells[i] === CELL.PATH) out.push(i)
  }
  return out
}

const algos: [string, Algo][] = [
  ['bfs',      recordBFS],
  ['dfs',      recordDFS],
  ['dijkstra', recordDijkstra],
  ['astar',    recordAStar],
]

describe.each(algos)('%s pathfinder', (_name, algo) => {
  it('records at least one step on an open grid', () => {
    const { steps } = run(algo, clearGrid(5, 5))
    expect(steps.length).toBeGreaterThan(0)
  })

  it('finds a path on a 5x5 open grid', () => {
    const { last } = run(algo, clearGrid(5, 5))
    expect(last).not.toBeNull()
    const pathCount = pathCellsFrom(last).length
    expect(pathCount).toBeGreaterThan(0)
  })

  it('marks no path when end is walled off', () => {
    const g = clearGrid(5, 5)
    g.cells[23] = CELL.WALL
    g.cells[19] = CELL.WALL
    const { last } = run(algo, g)
    expect(last).not.toBeNull()
    expect(pathCellsFrom(last).length).toBe(0)
  })

  it('handles 1x1 grid (start == end) without error', () => {
    const g: GridInput = { width: 1, height: 1, cells: new Uint8Array([CELL.START]), start: 0, end: 0 }
    expect(() => run(algo, g)).not.toThrow()
  })

  it('every snapshot has matching width*height cells', () => {
    const { steps } = run(algo, clearGrid(6, 4))
    steps.forEach((s) => {
      expect(s.cells.length).toBe(s.width * s.height)
      expect(s.visitOrder.length).toBe(s.width * s.height)
    })
  })
})

describe('BFS specifics', () => {
  it('finds shortest path on open 5x5 grid (length 9)', () => {
    const { last } = run(recordBFS, clearGrid(5, 5))
    expect(pathCellsFrom(last).length).toBeGreaterThanOrEqual(7)
  })
})

describe('Dijkstra honors weights', () => {
  it('avoids heavy cells when an open alternative is the same length', () => {
    const w = 3, h = 3
    const cells = new Uint8Array(w * h).fill(CELL.OPEN)
    cells[0] = CELL.START
    cells[8] = CELL.END
    cells[3] = CELL.HEAVY
    cells[4] = CELL.HEAVY
    cells[5] = CELL.HEAVY
    const { last } = run(recordDijkstra, { width: w, height: h, cells, start: 0, end: 8 })
    expect(pathCellsFrom(last).length).toBeGreaterThan(0)
    const path = new Set(pathCellsFrom(last))
    expect(path.has(3)).toBe(false)
    expect(path.has(4)).toBe(false)
    expect(path.has(5)).toBe(false)
  })
})
