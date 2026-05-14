// src/modules/sorting/algorithms/heap.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordHeap(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  const n = arr.length
  if (n <= 1) return

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, recorder)
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    recorder.swap()
    recorder.capture({
      array: arr,
      highlights: new Map<number, HighlightRole>([[0, 'swapping'], [i, 'sorted']]),
      pointers: { heapSize: i },
      codeLine: 5,
      description: `Move max ${arr[i]} to sorted position ${i}`,
    })
    heapify(arr, i, 0, recorder)
  }
  recorder.capture({
    array: arr,
    highlights: new Map<number, HighlightRole>([[0, 'sorted']]),
    pointers: {},
    codeLine: 6,
    description: 'Sorted',
  })
}

function heapify(arr: number[], n: number, i: number, recorder: StepRecorder): void {
  let largest = i
  const l = 2 * i + 1
  const r = 2 * i + 2

  const h = new Map<number, HighlightRole>([[i, 'comparing']])
  if (l < n) h.set(l, 'comparing')
  if (r < n) h.set(r, 'comparing')
  recorder.capture({ array: arr, highlights: h, pointers: { i, l, r }, codeLine: 2, description: `Heapify at index ${i}` })

  if (l < n) { recorder.comparison(); if (arr[l] > arr[largest]) largest = l }
  if (r < n) { recorder.comparison(); if (arr[r] > arr[largest]) largest = r }

  if (largest !== i) {
    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
    recorder.swap()
    recorder.capture({
      array: arr,
      highlights: new Map<number, HighlightRole>([[i, 'swapping'], [largest, 'swapping']]),
      pointers: { i, largest },
      codeLine: 4,
      description: `Swap ${arr[largest]} ↔ ${arr[i]} to maintain heap`,
    })
    heapify(arr, n, largest, recorder)
  }
}