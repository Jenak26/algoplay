// src/modules/dp/algorithms/coinChange.ts
import type { DPInput } from '@/types/DPModule'
import type { DPStepRecorder } from '@/engine/DPStepRecorder'

export function recordCoinChange(input: DPInput, recorder: DPStepRecorder): void {
  const coinsStr = input.rowString || '1,2,5'
  const coins = coinsStr
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => !isNaN(n) && n > 0)
    .sort((a, b) => a - b)
  
  const amount = Number(input.colString) || 11

  const H = coins.length + 1
  const W = amount + 1

  // Use 99 to represent Infinity for cleaner display
  const INF = 99
  const table: number[][] = Array.from({ length: H }, () => Array(W).fill(0))
  
  const rowLabels = ['-', ...coins.map(c => `Coin(${c})`)]
  const colLabels = Array.from({ length: W }, (_, i) => i.toString())

  // Initialize base cases
  for (let j = 1; j < W; j++) {
    table[0][j] = INF // Empty set of coins can't make positive amount
  }
  for (let i = 0; i < H; i++) {
    table[i][0] = 0 // 0 coins to make amount 0
  }

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells: [],
    codeLine: 1,
    description: `Initialize Coin Change table. Row 0 is set to infinity (99) since 0 coins cannot make sums > 0. Column 0 is set to 0.`
  })

  for (let i = 1; i < H; i++) {
    const coin = coins[i - 1]
    for (let j = 1; j < W; j++) {
      recorder.operation()

      if (coin <= j) {
        recorder.comparison()
        const excludeVal = table[i - 1][j]
        const includeVal = table[i][j - coin] === INF ? INF : table[i][j - coin] + 1
        table[i][j] = Math.min(excludeVal, includeVal)

        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: j,
          dependencyCells: [
            { r: i - 1, c: j },
            { r: i, c: j - coin }
          ],
          codeLine: 4,
          description: `Coin ${coin} <= amount ${j}. Compare excluding coin (dp[${i-1}][${j}] = ${excludeVal === INF ? 'INF' : excludeVal}) and including coin (1 + dp[${i}][${j - coin}] = ${includeVal === INF ? 'INF' : includeVal}). Min = ${table[i][j] === INF ? 'INF' : table[i][j]}`
        })
      } else {
        table[i][j] = table[i - 1][j]

        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: j,
          dependencyCells: [
            { r: i - 1, c: j }
          ],
          codeLine: 6,
          description: `Coin ${coin} > amount ${j}. Cannot use coin, copy value from cell above: dp[${i-1}][${j}] = ${table[i][j] === INF ? 'INF' : table[i][j]}`
        })
      }
    }
  }

  // Backtrack to find the coins used
  const dependencyCells: { r: number; c: number }[] = []
  if (table[H - 1][amount] !== INF) {
    let r = H - 1
    let c = amount
    while (r > 0 && c > 0) {
      if (table[r][c] !== table[r - 1][c]) {
        dependencyCells.push({ r, c })
        c -= coins[r - 1]
      } else {
        dependencyCells.push({ r, c })
        r--
      }
    }
    if (c === 0) {
      dependencyCells.push({ r, c: 0 })
    }
  }

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells,
    codeLine: 9,
    description: `Coin Change completed. Minimum coins needed to make amount ${amount} is ${table[H - 1][amount] === INF ? 'impossible (INF)' : table[H - 1][amount]}.`
  })
}
