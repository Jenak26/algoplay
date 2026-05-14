// src/test/modules/sorting/algorithms.test.ts
import { describe, it, expect } from 'vitest'
import { StepRecorder } from '@/engine/StepRecorder'
import { recordBubble }    from '@/modules/sorting/algorithms/bubble'
import { recordSelection } from '@/modules/sorting/algorithms/selection'
import { recordInsertion } from '@/modules/sorting/algorithms/insertion'
import { recordCocktail }  from '@/modules/sorting/algorithms/cocktail'
import { recordMerge }     from '@/modules/sorting/algorithms/merge'
import { recordQuick }     from '@/modules/sorting/algorithms/quick'
import { recordHeap }      from '@/modules/sorting/algorithms/heap'
import { recordShell }     from '@/modules/sorting/algorithms/shell'
import { recordCounting }  from '@/modules/sorting/algorithms/counting'
import { recordRadix }     from '@/modules/sorting/algorithms/radix'

const UNSORTED = [5, 3, 8, 1, 9, 2, 7, 4, 6]
const SORTED   = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function runAndGetFinal(fn: (a: number[], r: StepRecorder) => void, input = UNSORTED) {
  const recorder = new StepRecorder()
  fn([...input], recorder)
  const steps = recorder.getSteps()
  return { steps, final: steps.length > 0 ? [...steps.at(-1)!.array] : [...input] }
}

const algorithms: [string, (a: number[], r: StepRecorder) => void][] = [
  ['bubble',    recordBubble],
  ['selection', recordSelection],
  ['insertion', recordInsertion],
  ['cocktail',  recordCocktail],
  ['merge',     recordMerge],
  ['quick',     recordQuick],
  ['heap',      recordHeap],
  ['shell',     recordShell],
  ['counting',  recordCounting],
  ['radix',     recordRadix],
]

describe.each(algorithms)('%s sort', (_name, fn) => {
  it('sorts the array correctly', () => {
    const { final } = runAndGetFinal(fn)
    expect(final).toEqual(SORTED)
  })

  it('records at least one step', () => {
    const { steps } = runAndGetFinal(fn)
    expect(steps.length).toBeGreaterThan(0)
  })

  it('handles already-sorted input without error', () => {
    expect(() => runAndGetFinal(fn, [1, 2, 3, 4, 5])).not.toThrow()
  })

  it('handles single element without error', () => {
    expect(() => runAndGetFinal(fn, [42])).not.toThrow()
  })

  it('handles empty array without error', () => {
    expect(() => runAndGetFinal(fn, [])).not.toThrow()
  })

  it('every snapshot array has the same elements as input', () => {
    const { steps } = runAndGetFinal(fn)
    const inputSorted = [...UNSORTED].sort((a, b) => a - b)
    steps.forEach(s => {
      expect([...s.array].sort((a, b) => a - b)).toEqual(inputSorted)
    })
  })
})
