// src/modules/sorting/algorithms/selection.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordSelection(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  const n = arr.length
  if (n <= 1) return

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    recorder.capture({
      array: arr,
      highlights: new Map<number, HighlightRole>([[i, 'min']]),
      pointers: { i, minIdx },
      codeLine: 2,
      description: `Start pass ${i + 1}, current min at index ${i}`,
    })

    for (let j = i + 1; j < n; j++) {
      recorder.comparison()
      const h = new Map<number, HighlightRole>([[j, 'comparing'], [minIdx, 'min']])
      recorder.capture({
        array: arr,
        highlights: h,
        pointers: { i, j, minIdx },
        codeLine: 4,
        description: `Compare ${arr[j]} with min ${arr[minIdx]}`,
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        recorder.capture({
          array: arr,
          highlights: new Map<number, HighlightRole>([[minIdx, 'min']]),
          pointers: { i, j, minIdx },
          codeLine: 5,
          description: `New min found: ${arr[minIdx]} at index ${minIdx}`,
        })
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      recorder.swap()
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[i, 'swapping'], [minIdx, 'swapping']]),
        pointers: { i, minIdx },
        codeLine: 6,
        description: `Swap min ${arr[i]} to position ${i}`,
      })
    }

    const h2 = new Map<number, HighlightRole>()
    for (let k = 0; k <= i; k++) h2.set(k, 'sorted')
    recorder.capture({ array: arr, highlights: h2, pointers: { i }, codeLine: 1, description: `Position ${i} sorted` })
  }

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 7, description: 'Sorted' })
}
