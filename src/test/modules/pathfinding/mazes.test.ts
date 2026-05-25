// src/test/modules/pathfinding/mazes.test.ts
import { describe, it, expect } from 'vitest'
import { CELL } from '@/types/GridSnapshot'
import { generateRandomWalls }       from '@/modules/pathfinding/mazes/randomWalls'
import { generateRecursiveDivision } from '@/modules/pathfinding/mazes/recursiveDivision'
import { generatePrimMaze }          from '@/modules/pathfinding/mazes/prim'

type Maze = (w: number, h: number) => Uint8Array

const generators: [string, Maze][] = [
  ['random',    (w, h) => generateRandomWalls(w, h, 0.3)],
  ['recursive', generateRecursiveDivision],
  ['prim',      generatePrimMaze],
]

describe.each(generators)('%s maze', (_name, gen) => {
  it('returns a Uint8Array of length w*h', () => {
    const m = gen(11, 7)
    expect(m).toBeInstanceOf(Uint8Array)
    expect(m.length).toBe(11 * 7)
  })

  it('only contains OPEN or WALL cells', () => {
    const m = gen(15, 9)
    for (let i = 0; i < m.length; i++) {
      expect([CELL.OPEN, CELL.WALL]).toContain(m[i])
    }
  })

  it('handles 5x5 minimum size without error', () => {
    expect(() => gen(5, 5)).not.toThrow()
  })

  it('produces walls (not all open)', () => {
    const m = gen(15, 9)
    const walls = Array.from(m).filter((c) => c === CELL.WALL).length
    expect(walls).toBeGreaterThan(0)
  })
})