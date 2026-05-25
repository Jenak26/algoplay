// src/modules/dp/algorithms/lcs.ts
import type { DPInput } from '@/types/DPModule'
import type { DPStepRecorder } from '@/engine/DPStepRecorder'

export function recordLCS(input: DPInput, recorder: DPStepRecorder): void {
  const { rowString: strA, colString: strB } = input
  const N = strA.length
  const M = strB.length

  const H = N + 1
  const W = M + 1

  const table: number[][] = Array.from({ length: H }, () => Array(W).fill(0))
  const rowLabels = ['-', ...strA.split('')]
  const colLabels = ['-', ...strB.split('')]

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells: [],
    codeLine: 1,
    description: `Initialize LCS matrix for strings A: "${strA}" and B: "${strB}"`
  })

  for (let i = 1; i < H; i++) {
    const charA = strA[i - 1]
    for (let j = 1; j < W; j++) {
      const charB = strB[j - 1]
      recorder.operation()

      if (charA === charB) {
        recorder.comparison()
        table[i][j] = table[i - 1][j - 1] + 1
        
        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: j,
          dependencyCells: [
            { r: i - 1, c: j - 1 }
          ],
          codeLine: 4,
          description: `Characters match ('${charA}' == '${charB}'). Add 1 to diagonal: dp[${i-1}][${j-1}] + 1 = ${table[i][j]}`
        })
      } else {
        const upVal = table[i - 1][j]
        const leftVal = table[i][j - 1]
        table[i][j] = Math.max(upVal, leftVal)

        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: j,
          dependencyCells: [
            { r: i - 1, c: j },
            { r: i, c: j - 1 }
          ],
          codeLine: 7,
          description: `Characters do not match ('${charA}' != '${charB}'). Take max of cell above (${upVal}) and cell left (${leftVal}): ${table[i][j]}`
        })
      }
    }
  }

  // Backtrack to find LCS string
  const dependencyCells: { r: number; c: number }[] = []
  let r = H - 1
  let c = W - 1
  while (r > 0 && c > 0) {
    if (strA[r - 1] === strB[c - 1]) {
      dependencyCells.push({ r, c })
      r--
      c--
    } else if (table[r - 1][c] >= table[r][c - 1]) {
      r--
    } else {
      c--
    }
  }

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells,
    codeLine: 10,
    description: `LCS completed. Length of Longest Common Subsequence is ${table[H - 1][W - 1]}.`
  })
}
