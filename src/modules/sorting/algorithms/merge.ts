// src/modules/sorting/algorithms/merge.ts
import type { StepRecorder } from '@/engine/StepRecorder'
import type { HighlightRole } from '@/types/StepSnapshot'

export function recordMerge(array: number[], recorder: StepRecorder): void {
  const arr = [...array]
  if (arr.length <= 1) return
  mergeSortHelper(arr, 0, arr.length - 1, recorder)

  const allSorted = new Map<number, HighlightRole>(arr.map((_, k) => [k, 'sorted']))
  recorder.capture({ array: arr, highlights: allSorted, pointers: {}, codeLine: 7, description: 'Sorted' })
}

function mergeSortHelper(arr: number[], l: number, r: number, recorder: StepRecorder): void {
  if (l >= r) return
  const m = l + Math.floor((r - l) / 2)
  mergeSortHelper(arr, l, m, recorder)
  mergeSortHelper(arr, m + 1, r, recorder)
  merge(arr, l, m, r, recorder)
}

function merge(arr: number[], l: number, m: number, r: number, recorder: StepRecorder): void {
  const left  = arr.slice(l, m + 1)
  const right = arr.slice(m + 1, r + 1)

  // Highlight the two halves being merged — snapshot before any writes
  const hMerge = new Map<number, HighlightRole>()
  for (let k = l; k <= m; k++) hMerge.set(k, 'comparing')
  for (let k = m + 1; k <= r; k++) hMerge.set(k, 'swapping')
  recorder.capture({ array: arr, highlights: hMerge, pointers: { l, m, r }, codeLine: 3, description: `Merge [${l}..${m}] and [${m + 1}..${r}]` })

  // Perform the merge — no snapshots mid-write (would expose partial overwrites)
  let i = 0, j = 0, k = l
  while (i < left.length && j < right.length) {
    recorder.comparison()
    if (left[i] <= right[j]) {
      arr[k] = left[i++]
    } else {
      arr[k] = right[j++]
    }
    k++
  }
  while (i < left.length)  { arr[k] = left[i++];  k++ }
  while (j < right.length) { arr[k] = right[j++]; k++ }

  // Show merged section — arr[l..r] is now fully merged and multiset-valid
  const hDone = new Map<number, HighlightRole>()
  for (let x = l; x <= r; x++) hDone.set(x, 'sorted')
  recorder.capture({ array: arr, highlights: hDone, pointers: { l, r }, codeLine: 6, description: `Subarray [${l}..${r}] merged` })
}
