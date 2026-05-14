// src/modules/sorting/algorithms/counting.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordCounting(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  if (arr.length <= 1) {
    if (arr.length === 1) {
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[0, 'sorted']]),
        pointers: {},
        codeLine: 6,
        description: 'Sorted',
      })
    }
    return
  }

  const max = Math.max(...arr)
  const count = new Array<number>(max + 1).fill(0)

  recorder.capture({
    array: arr,
    highlights: new Map(),
    pointers: {},
    codeLine: 0,
    description: `Counting sort with buckets 0..${max}`,
  })

  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++
    recorder.capture({
      array: arr,
      highlights: new Map<number, HighlightRole>([[i, 'comparing']]),
      pointers: { i },
      codeLine: 2,
      description: `Count ${arr[i]}: bucket[${arr[i]}] = ${count[arr[i]]}`,
    })
  }

  const sorted: number[] = []
  for (let v = 0; v <= max; v++) {
    for (let c = 0; c < count[v]; c++) sorted.push(v)
  }

  for (let i = 0; i < arr.length; i++) arr[i] = sorted[i]

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({
    array: arr,
    highlights: allSorted,
    pointers: {},
    codeLine: 6,
    description: 'Sorted',
  })
}
