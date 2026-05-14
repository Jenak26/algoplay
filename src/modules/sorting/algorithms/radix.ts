// src/modules/sorting/algorithms/radix.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordRadix(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  if (arr.length <= 1) {
    if (arr.length === 1) {
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[0, 'sorted']]),
        pointers: {},
        codeLine: 8,
        description: 'Sorted',
      })
    }
    return
  }

  const max = Math.max(...arr)

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    recorder.capture({
      array: arr,
      highlights: new Map(),
      pointers: { exp },
      codeLine: 1,
      description: `Radix pass for digit place ${exp}`,
    })

    const output = new Array<number>(arr.length).fill(0)
    const count  = new Array<number>(10).fill(0)

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]++
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[i, 'comparing']]),
        pointers: { i, exp, digit },
        codeLine: 3,
        description: `${arr[i]} -> digit ${digit} at place ${exp}`,
      })
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1]

    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      output[count[digit] - 1] = arr[i]
      count[digit]--
    }

    for (let i = 0; i < arr.length; i++) arr[i] = output[i]

    recorder.capture({
      array: arr,
      highlights: new Map(),
      pointers: { exp },
      codeLine: 7,
      description: `Pass ${exp} complete`,
    })
  }

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 8, description: 'Sorted' })
}
