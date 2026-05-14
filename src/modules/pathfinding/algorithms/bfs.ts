// src/modules/pathfinding/algorithms/bfs.ts
import type { GridStepRecorder } from '@/engine/GridStepRecorder'
import { CELL } from '@/types/GridSnapshot'

interface GridInput {
  width:  number
  height: number
  cells:  Uint8Array
  start:  number
  end:    number
}

export function recordBFS(grid: GridInput, recorder: GridStepRecorder): void {
  const { width: w, height: h, start, end } = grid
  const cells      = new Uint8Array(grid.cells)
  const visitOrder = new Int32Array(w * h).fill(-1)
  const parent     = new Int32Array(w * h).fill(-1)

  recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 0, description: 'Initialize BFS' })

  if (start === end) {
    cells[start] = CELL.START
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 6, description: 'Start equals end' })
    return
  }

  const queue: number[] = [start]
  const enqueued = new Uint8Array(w * h)
  enqueued[start] = 1
  visitOrder[start] = 0
  let step = 0
  let found = false

  while (queue.length > 0) {
    const curr = queue.shift()!
    if (curr !== start && curr !== end) cells[curr] = CELL.VISITED
    recorder.visit()
    step++

    if (curr === end) { found = true; break }

    for (const next of neighbors(curr, w, h)) {
      if (enqueued[next] || cells[next] === CELL.WALL) continue
      enqueued[next] = 1
      parent[next]   = curr
      visitOrder[next] = step
      if (next !== end) cells[next] = CELL.FRONTIER
      queue.push(next)
    }

    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 3, description: `Visit cell ${curr}` })
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
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 6, description: `Path found (${pathLen + 1} cells)` })
  } else {
    cells[start] = CELL.START
    recorder.capture({ width: w, height: h, cells, start, end, visitOrder, codeLine: 6, description: 'No path' })
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
