// src/modules/sorting/algorithms/bubble.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordBubble(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  const n = arr.length
  if (n <= 1) return

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      recorder.comparison()
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[j, 'comparing'], [j + 1, 'comparing']]),
        pointers: { i, j },
        codeLine: 3,
        description: `Compare ${arr[j]} and ${arr[j + 1]}`,
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        recorder.swap()
        recorder.capture({
          array: arr,
          highlights: new Map<number, HighlightRole>([[j, 'swapping'], [j + 1, 'swapping']]),
          pointers: { i, j },
          codeLine: 4,
          description: `Swap → ${arr[j]} and ${arr[j + 1]}`,
        })
      }
    }
    // Mark the last i+1 positions as sorted
    const h = new Map<number, HighlightRole>()
    for (let k = n - 1 - i; k < n; k++) h.set(k, 'sorted')
    recorder.capture({ array: arr, highlights: h, pointers: { i }, codeLine: 1, description: `Pass ${i + 1} complete` })
  }

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 5, description: 'Sorted' })
}
