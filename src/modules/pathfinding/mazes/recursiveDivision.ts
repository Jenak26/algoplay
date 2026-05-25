// src/modules/pathfinding/mazes/recursiveDivision.ts
import { CELL } from '@/types/GridSnapshot'

export function generateRecursiveDivision(w: number, h: number): Uint8Array {
  const cells = new Uint8Array(w * h).fill(CELL.OPEN)

  for (let x = 0; x < w; x++) {
    cells[x]               = CELL.WALL
    cells[(h - 1) * w + x] = CELL.WALL
  }
  for (let y = 0; y < h; y++) {
    cells[y * w]         = CELL.WALL
    cells[y * w + w - 1] = CELL.WALL
  }

  divide(cells, w, 1, 1, w - 2, h - 2, chooseOrientation(w - 2, h - 2))
  return cells
}

type Orient = 'h' | 'v'

function chooseOrientation(width: number, height: number): Orient {
  if (width < height) return 'h'
  if (height < width) return 'v'
  return Math.random() < 0.5 ? 'h' : 'v'
}

function divide(cells: Uint8Array, w: number, x: number, y: number, width: number, height: number, orient: Orient): void {
  if (width < 2 || height < 2) return

  const horizontal = orient === 'h'

  const wx = x + (horizontal ? 0 : randEven(width - 2))
  const wy = y + (horizontal ? randEven(height - 2) : 0)

  const px = wx + (horizontal ? randOdd(width) : 0)
  const py = wy + (horizontal ? 0 : randOdd(height))

  const dx = horizontal ? 1 : 0
  const dy = horizontal ? 0 : 1
  const length = horizontal ? width : height

  for (let i = 0; i < length; i++) {
    const cx = wx + dx * i
    const cy = wy + dy * i
    if (cx !== px || cy !== py) cells[cy * w + cx] = CELL.WALL
  }

  const nextOrient = (w0: number, h0: number): Orient => chooseOrientation(w0, h0)

  if (horizontal) {
    const upperH = wy - y
    const lowerH = y + height - (wy + 1)
    divide(cells, w, x, y,      width, upperH, nextOrient(width, upperH))
    divide(cells, w, x, wy + 1, width, lowerH, nextOrient(width, lowerH))
  } else {
    const leftW  = wx - x
    const rightW = x + width - (wx + 1)
    divide(cells, w, x,      y, leftW,  height, nextOrient(leftW, height))
    divide(cells, w, wx + 1, y, rightW, height, nextOrient(rightW, height))
  }
}

function randEven(max: number): number {
  if (max < 2) return 0
  return 2 * Math.floor(Math.random() * (max / 2))
}

function randOdd(max: number): number {
  if (max < 2) return 0
  return 2 * Math.floor(Math.random() * Math.floor((max - 1) / 2)) + 1
}