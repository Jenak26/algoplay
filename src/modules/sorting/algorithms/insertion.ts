// src/modules/sorting/algorithms/insertion.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordInsertion(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  const n = arr.length
  if (n <= 1) return

  recorder.capture({
    array: arr,
    highlights: new Map<number, HighlightRole>([[0, 'sorted']]),
    pointers: {},
    codeLine: 0,
    description: 'Index 0 is trivially sorted',
  })

  for (let i = 1; i < n; i++) {
    recorder.capture({
      array: arr,
      highlights: new Map<number, HighlightRole>([[i, 'key']]),
      pointers: { i },
      codeLine: 2,
      description: `Pick key = ${arr[i]} at index ${i}`,
    })

    let j = i
    while (j > 0 && arr[j - 1] > arr[j]) {
      recorder.comparison()
      ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      recorder.swap()
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[j - 1, 'swapping'], [j, 'swapping']]),
        pointers: { i, j },
        codeLine: 5,
        description: `Swap ${arr[j - 1]} and ${arr[j]}`,
      })
      j--
    }
    if (j > 0) {
      recorder.comparison() // final comparison that breaks the while
    }

    const h = new Map<number, HighlightRole>()
    for (let k = 0; k <= i; k++) h.set(k, 'sorted')
    recorder.capture({
      array: arr,
      highlights: h,
      pointers: { i },
      codeLine: 7,
      description: `Element settled at position ${j}`,
    })
  }

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 8, description: 'Sorted' })
}
