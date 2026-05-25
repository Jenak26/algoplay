// src/modules/pathfinding/algorithms/astar.ts
import type { GridStepRecorder } from '@/engine/GridStepRecorder'
import { CELL, CELL_WEIGHT, type CellRole } from '@/types/GridSnapshot'

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

export function recordAStar(grid: GridInput, recorder: GridStepRecorder): void {
  const { width: w, height: h, start, end } = grid
  const n = w * h
  const cells      = new Uint8Array(grid.cells)
  const visitOrder = new Int32Array(n).fill(-1)
  const parent     = new Int32Array(n).fill(-1)
  const gScore     = new Float64Array(n).fill(Infinity)
  const fScore     = new Float64Array(n).fill(Infinity)
  const inOpen     = new Uint8Array(n)
  const closed     = new Uint8Array(n)
  gScore[start] = 0
  fScore[start] = heuristic(start, end, w)
  inOpen[start] = 1
  visitOrder[start] = 0

  recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 0, description: 'Initialize A*' })

  if (start === end) {
    cells[start] = CELL.START
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 8, description: 'Start equals end' })
    return
  }

  let step = 0
  let found = false

  while (true) {
    let curr = -1
    let best = Infinity
    for (let i = 0; i < n; i++) {
      if (inOpen[i] && fScore[i] < best) { best = fScore[i]; curr = i }
    }
    if (curr === -1) break

    inOpen[curr] = 0
    closed[curr] = 1
    if (curr !== start && curr !== end) cells[curr] = CELL.VISITED
    recorder.visit()
    step++

    if (curr === end) { found = true; break }

    for (const next of neighbors(curr, w, h)) {
      if (closed[next] || cells[next] === CELL.WALL) continue
      const wt = CELL_WEIGHT[cells[next] as CellRole]
      const tentativeG = gScore[curr] + wt
      if (tentativeG < gScore[next]) {
        parent[next]     = curr
        gScore[next]     = tentativeG
        fScore[next]     = tentativeG + heuristic(next, end, w)
        visitOrder[next] = step
        if (!inOpen[next]) {
          inOpen[next] = 1
          if (next !== end) cells[next] = CELL.FRONTIER
        }
      }
    }

    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 5, description: `Expand ${curr} (f=${fScore[curr].toFixed(0)})` })
  }

  if (found) {
    let pathLen = 0
    let curr = parent[end]
    while (curr !== -1 && curr !== start) {
      cells[curr] = CELL.PATH
      pathLen++
      curr = parent[curr]
    }
    cells[end]   = CELL.END
    cells[start] = CELL.START
    recorder.setPath(pathLen + 1)
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 8, description: `Path found (cost ${gScore[end].toFixed(0)})` })
  } else {
    cells[start] = CELL.START
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 8, description: 'No path' })
  }
}

function heuristic(a: number, b: number, w: number): number {
  const ax = a % w, ay = Math.floor(a / w)
  const bx = b % w, by = Math.floor(b / w)
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

function neighbors(idx: number, w: number, h: number): number[] {
  const x = idx % w
  const y = Math.floor(idx / w)
  const out: number[] = []
  if (y > 0)     out.push(idx - w)
  if (x < w - 1) out.push(idx + 1)
  if (y < h - 1) out.push(idx + w)
  if (x > 0)     out.push(idx - 1)
  return out
}
