// src/modules/sorting/algorithms/cocktail.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordCocktail(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  const n = arr.length
  if (n <= 1) return

  let start = 0
  let end = n - 1
  let swapped = true

  while (swapped) {
    swapped = false

    // Forward pass
    for (let i = start; i < end; i++) {
      recorder.comparison()
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[i, 'comparing'], [i + 1, 'comparing']]),
        pointers: { i, start, end },
        codeLine: 3,
        description: `Forward: compare ${arr[i]} and ${arr[i + 1]}`,
      })
      if (arr[i] > arr[i + 1]) {
        ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        recorder.swap()
        recorder.capture({
          array: arr,
          highlights: new Map<number, HighlightRole>([[i, 'swapping'], [i + 1, 'swapping']]),
          pointers: { i },
          codeLine: 4,
          description: `Swap ${arr[i + 1]} ↔ ${arr[i]}`,
        })
        swapped = true
      }
    }
    if (!swapped) break

    const hEnd = new Map<number, HighlightRole>([[end, 'sorted']])
    recorder.capture({ array: arr, highlights: hEnd, pointers: { end }, codeLine: 5, description: `End ${end} sorted` })
    end--
    swapped = false

    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      recorder.comparison()
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[i, 'comparing'], [i + 1, 'comparing']]),
        pointers: { i, start, end },
        codeLine: 7,
        description: `Backward: compare ${arr[i]} and ${arr[i + 1]}`,
      })
      if (arr[i] > arr[i + 1]) {
        ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        recorder.swap()
        recorder.capture({
          array: arr,
          highlights: new Map<number, HighlightRole>([[i, 'swapping'], [i + 1, 'swapping']]),
          pointers: { i },
          codeLine: 8,
          description: `Swap ${arr[i + 1]} ↔ ${arr[i]}`,
        })
        swapped = true
      }
    }

    const hStart = new Map<number, HighlightRole>([[start, 'sorted']])
    recorder.capture({ array: arr, highlights: hStart, pointers: { start }, codeLine: 9, description: `Start ${start} sorted` })
    start++
  }

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 10, description: 'Sorted' })
}
