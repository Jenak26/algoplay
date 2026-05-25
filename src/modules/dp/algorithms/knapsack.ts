// src/modules/dp/algorithms/knapsack.ts
import type { DPInput } from '@/types/DPModule'
import type { DPStepRecorder } from '@/engine/DPStepRecorder'

export function recordKnapsack(input: DPInput, recorder: DPStepRecorder): void {
  const { colString: capacityStr, customData } = input
  const items = customData?.items ?? [
    { label: 'A', weight: 2, value: 3 },
    { label: 'B', weight: 3, value: 4 },
    { label: 'C', weight: 4, value: 5 },
    { label: 'D', weight: 5, value: 8 }
  ]
  const capacity = Number(capacityStr) || 7

  const H = items.length + 1
  const W = capacity + 1

  const table: number[][] = Array.from({ length: H }, () => Array(W).fill(0))
  const rowLabels = ['-', ...items.map((it: any) => `${it.label}(w:${it.weight},v:${it.value})`)]
  const colLabels = Array.from({ length: W }, (_, i) => i.toString())

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells: [],
    codeLine: 1,
    description: 'Initialize DP table for Knapsack with 0 values.'
  })

  // Fill table
  for (let i = 1; i < H; i++) {
    const item = items[i - 1]
    for (let w = 1; w < W; w++) {
      recorder.operation()
      
      if (item.weight <= w) {
        recorder.comparison()
        const valWith = item.value + table[i - 1][w - item.weight]
        const valWithout = table[i - 1][w]
        
        table[i][w] = Math.max(valWith, valWithout)

        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: w,
          dependencyCells: [
            { r: i - 1, c: w },
            { r: i - 1, c: w - item.weight }
          ],
          codeLine: 4,
          description: `Item ${item.label} (weight ${item.weight}, value ${item.value}) fits in capacity ${w}. Max value of including it (${item.value} + dp[${i-1}][${w-item.weight}] = ${valWith}) and excluding it (dp[${i-1}][${w}] = ${valWithout}) is ${table[i][w]}`
        })
      } else {
        table[i][w] = table[i - 1][w]
        
        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: w,
          dependencyCells: [
            { r: i - 1, c: w }
          ],
          codeLine: 7,
          description: `Item ${item.label} (weight ${item.weight}) does not fit in capacity ${w}. Copy value from cell above: ${table[i][w]}`
        })
      }
    }
  }

  // Reconstruct Knapsack items (Backtracking)
  const dependencyCells: { r: number; c: number }[] = []
  let tempW = capacity
  for (let i = H - 1; i > 0; i--) {
    const item = items[i - 1]
    if (table[i][tempW] !== table[i - 1][tempW]) {
      dependencyCells.push({ r: i, c: tempW })
      tempW -= item.weight
    }
  }

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells,
    codeLine: 9,
    description: `Knapsack completed. Maximum value: ${table[H - 1][capacity]}. Backtracked items highlighted.`
  })
}
