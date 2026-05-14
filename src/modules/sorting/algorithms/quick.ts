// src/modules/sorting/algorithms/quick.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordQuick(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  if (arr.length <= 1) return
  quickHelper(arr, 0, arr.length - 1, recorder)

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 8, description: 'Sorted' })
}

function quickHelper(arr: number[], low: number, high: number, recorder: StepRecorder): void {
  if (low >= high) {
    if (low === high) {
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[low, 'sorted']]),
        pointers: { low, high },
        codeLine: 0,
        description: `Single element ${arr[low]} at index ${low} is sorted`,
      })
    }
    return
  }
  const pi = partition(arr, low, high, recorder)
  quickHelper(arr, low, pi - 1, recorder)
  quickHelper(arr, pi + 1, high, recorder)
}

function partition(arr: number[], low: number, high: number, recorder: StepRecorder): number {
  const pivot = arr[high]
  recorder.capture({
    array: arr,
    highlights: new Map<number, HighlightRole>([[high, 'pivot']]),
    pointers: { low, high, pivot: high },
    codeLine: 3,
    description: `Pivot = ${pivot} at index ${high}`,
  })

  let i = low - 1
  for (let j = low; j < high; j++) {
    recorder.comparison()
    recorder.capture({
      array: arr,
      highlights: new Map<number, HighlightRole>([[j, 'comparing'], [high, 'pivot']]),
      pointers: { i, j, pivot: high },
      codeLine: 5,
      description: `Compare ${arr[j]} with pivot ${pivot}`,
    })

    if (arr[j] <= pivot) {
      i++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      recorder.swap()
      recorder.capture({
        array: arr,
        highlights: new Map<number, HighlightRole>([[i, 'swapping'], [j, 'swapping'], [high, 'pivot']]),
        pointers: { i, j },
        codeLine: 6,
        description: `Swap ${arr[j]} ↔ ${arr[i]}`,
      })
    }
  }

  ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
  recorder.swap()
  recorder.capture({
    array: arr,
    highlights: new Map<number, HighlightRole>([[i + 1, 'sorted'], [high, 'swapping']]),
    pointers: { pivotFinal: i + 1 },
    codeLine: 7,
    description: `Pivot ${arr[i + 1]} placed at final position ${i + 1}`,
  })

  return i + 1
}