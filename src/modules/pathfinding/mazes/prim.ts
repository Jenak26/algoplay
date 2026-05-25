// src/modules/pathfinding/mazes/prim.ts
import { CELL } from '@/types/GridSnapshot'

export function generatePrimMaze(w: number, h: number): Uint8Array {
  const cells = new Uint8Array(w * h).fill(CELL.WALL)

  const startX = 1
  const startY = 1
  if (startX >= w || startY >= h) return cells

  cells[startY * w + startX] = CELL.OPEN

  const frontier: [number, number][] = []
  pushFrontier(frontier, startX, startY, w, h, cells)

  while (frontier.length > 0) {
    const i = Math.floor(Math.random() * frontier.length)
    const [fx, fy] = frontier.splice(i, 1)[0]

    const opens: [number, number][] = []
    if (fx >= 2 && cells[fy * w + (fx - 2)] === CELL.OPEN)    opens.push([fx - 2, fy])
    if (fx + 2 < w && cells[fy * w + (fx + 2)] === CELL.OPEN) opens.push([fx + 2, fy])
    if (fy >= 2 && cells[(fy - 2) * w + fx] === CELL.OPEN)    opens.push([fx, fy - 2])
    if (fy + 2 < h && cells[(fy + 2) * w + fx] === CELL.OPEN) opens.push([fx, fy + 2])

    if (opens.length > 0) {
      const [ox, oy] = opens[Math.floor(Math.random() * opens.length)]
      const mx = (fx + ox) / 2
      const my = (fy + oy) / 2
      cells[fy * w + fx] = CELL.OPEN
      cells[my * w + mx] = CELL.OPEN
      pushFrontier(frontier, fx, fy, w, h, cells)
    }
  }

  return cells
}

function pushFrontier(frontier: [number, number][], x: number, y: number, w: number, h: number, cells: Uint8Array): void {
  const push = (nx: number, ny: number) => {
    if (nx >= 0 && nx < w && ny >= 0 && ny < h && cells[ny * w + nx] === CELL.WALL) {
      frontier.push([nx, ny])
    }
  }
  if (x >= 2)    push(x - 2, y)
  if (x + 2 < w) push(x + 2, y)
  if (y >= 2)    push(x, y - 2)
  if (y + 2 < h) push(x, y + 2)
}