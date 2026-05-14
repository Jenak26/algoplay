// src/modules/sorting/algorithms/shell.ts
// Swap-based shell sort to preserve the multiset invariant at every captured snapshot.
// Instead of shifting (which creates temporary duplicates), we swap adjacent gap-pairs
// moving leftward — semantically identical to shift-based shell sort.
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordShell(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  const n = arr.length
  if (n <= 1) return

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    recorder.capture({
      array: arr,
      highlights: new Map(),
      pointers: { gap },
      codeLine: 1,
      description: `Shell sort pass with gap = ${gap}`,
    })

    for (let i = gap; i < n; i++) {
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[i, 'key']]),
        pointers: { i, gap, key: i },
        codeLine: 3,
        description: `Key = ${arr[i]} at index ${i}`,
      })

      let j = i
      while (j >= gap && arr[j - gap] > arr[j]) {
        recorder.comparison()
        ;[arr[j - gap], arr[j]] = [arr[j], arr[j - gap]]
        recorder.swap()
        recorder.capture({
          array: arr,
          highlights: new Map<number, HighlightRole>([[j, 'swapping'], [j - gap, 'swapping']]),
          pointers: { j, gap },
          codeLine: 5,
          description: `Swap ${arr[j - gap]} ↔ ${arr[j]} (gap ${gap})`,
        })
        j -= gap
      }
      if (j >= gap) recorder.comparison() // final comparison that broke the while

      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[j, 'sorted']]),
        pointers: { j },
        codeLine: 6,
        description: `Element settled at index ${j}`,
      })
    }
  }

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 7, description: 'Sorted' })
}