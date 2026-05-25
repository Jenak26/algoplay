// src/modules/pathfinding/algorithms/dijkstra.ts
import type { GridStepRecorder } from '@/engine/GridStepRecorder'
import { CELL, CELL_WEIGHT, type CellRole } from '@/types/GridSnapshot'

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

export function recordDijkstra(grid: GridInput, recorder: GridStepRecorder): void {
  const { width: w, height: h, start, end } = grid
  const n = w * h
  const cells      = new Uint8Array(grid.cells)
  const visitOrder = new Int32Array(n).fill(-1)
  const parent     = new Int32Array(n).fill(-1)
  const dist       = new Float64Array(n).fill(Infinity)
  const visited    = new Uint8Array(n)
  dist[start] = 0
  visitOrder[start] = 0

  recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 0, description: 'Initialize Dijkstra' })

  if (start === end) {
    cells[start] = CELL.START
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 7, description: 'Start equals end' })
    return
  }

  let step = 0
  let found = false

  while (true) {
    let curr = -1
    let best = Infinity
    for (let i = 0; i < n; i++) {
      if (!visited[i] && dist[i] < best) { best = dist[i]; curr = i }
    }
    if (curr === -1) break
    visited[curr] = 1
    if (curr !== start && curr !== end) cells[curr] = CELL.VISITED
    recorder.visit()
    step++

    if (curr === end) { found = true; break }

    for (const next of neighbors(curr, w, h)) {
      if (visited[next] || cells[next] === CELL.WALL) continue
      const wt = CELL_WEIGHT[cells[next] as CellRole]
      const alt = dist[curr] + wt
      if (alt < dist[next]) {
        dist[next]       = alt
        parent[next]     = curr
        visitOrder[next] = step
        if (next !== end) cells[next] = CELL.FRONTIER
      }
    }

    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 4, description: `Relax neighbors of ${curr} (d=${dist[curr].toFixed(0)})` })
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
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 7, description: `Path found (cost ${dist[end].toFixed(0)})` })
  } else {
    cells[start] = CELL.START
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 7, description: 'No path' })
  }
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
