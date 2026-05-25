// src/modules/dp/algorithms/editDistance.ts
import type { DPInput } from '@/types/DPModule'
import type { DPStepRecorder } from '@/engine/DPStepRecorder'

export function recordEditDistance(input: DPInput, recorder: DPStepRecorder): void {
  const { rowString: strA, colString: strB } = input
  const N = strA.length
  const M = strB.length

  const H = N + 1
  const W = M + 1

  const table: number[][] = Array.from({ length: H }, () => Array(W).fill(0))
  const rowLabels = ['-', ...strA.split('')]
  const colLabels = ['-', ...strB.split('')]

  // Initialize base cases
  for (let i = 0; i < H; i++) {
    table[i][0] = i
  }
  for (let j = 0; j < W; j++) {
    table[0][j] = j
  }

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells: [],
    codeLine: 1,
    description: `Initialize Edit Distance matrix. Base cases: converting empty string to substring of length k requires k insertions/deletions.`
  })

  for (let i = 1; i < H; i++) {
    const charA = strA[i - 1]
    for (let j = 1; j < W; j++) {
      const charB = strB[j - 1]
      recorder.operation()

      if (charA === charB) {
        recorder.comparison()
        table[i][j] = table[i - 1][j - 1]
        
        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: j,
          dependencyCells: [
            { r: i - 1, c: j - 1 }
          ],
          codeLine: 4,
          description: `Characters match ('${charA}' == '${charB}'). No edit needed: copy diagonal value dp[${i-1}][${j-1}] = ${table[i][j]}`
        })
      } else {
        const replaceVal = table[i - 1][j - 1]
        const deleteVal = table[i - 1][j]
        const insertVal = table[i][j - 1]
        const minVal = Math.min(replaceVal, deleteVal, insertVal)
        table[i][j] = minVal + 1

        recorder.capture({
          table, rowLabels, colLabels,
          currentRow: i, currentCol: j,
          dependencyCells: [
            { r: i - 1, c: j - 1 }, // Diagonal (Replace)
            { r: i - 1, c: j },     // Up (Delete)
            { r: i, c: j - 1 }      // Left (Insert)
          ],
          codeLine: 7,
          description: `Mismatch ('${charA}' != '${charB}'). Take 1 + min of: diagonal (replace: ${replaceVal}), above (delete: ${deleteVal}), or left (insert: ${insertVal}). Min Edit Distance = ${table[i][j]}`
        })
      }
    }
  }

  // Backtrack to find the transformation path
  const dependencyCells: { r: number; c: number }[] = []
  let r = H - 1
  let c = W - 1
  while (r > 0 || c > 0) {
    dependencyCells.push({ r, c })
    if (r > 0 && c > 0 && strA[r - 1] === strB[c - 1]) {
      r--
      c--
    } else {
      const diag = r > 0 && c > 0 ? table[r - 1][c - 1] : Infinity
      const up = r > 0 ? table[r - 1][c] : Infinity
      const left = c > 0 ? table[r][c - 1] : Infinity
      const m = Math.min(diag, up, left)

      if (m === diag) {
        r--
        c--
      } else if (m === up) {
        r--
      } else {
        c--
      }
    }
  }
  dependencyCells.push({ r: 0, c: 0 })

  recorder.capture({
    table, rowLabels, colLabels,
    currentRow: null, currentCol: null,
    dependencyCells,
    codeLine: 10,
    description: `Edit Distance completed. Minimum operations needed to transform "${strA}" to "${strB}" is ${table[H - 1][W - 1]}.`
  })
}
