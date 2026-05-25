// src/test/modules/dp/algorithms.test.ts
import { describe, it, expect } from 'vitest'
import { DPStepRecorder } from '@/engine/DPStepRecorder'
import { recordKnapsack } from '@/modules/dp/algorithms/knapsack'
import { recordLCS } from '@/modules/dp/algorithms/lcs'
import { recordEditDistance } from '@/modules/dp/algorithms/editDistance'
import { recordCoinChange } from '@/modules/dp/algorithms/coinChange'

describe('DP Knapsack and LCS solvers', () => {
  it('Knapsack solves maximum value within capacity', () => {
    const r = new DPStepRecorder()
    recordKnapsack({ rowString: '', colString: '5' }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const last = steps.at(-1)!
    expect(last.table[4][5]).toBe(8) // Capacity 5, items are preset. Item D has weight 5, value 8.
  })

  it('LCS finds longest common subsequence of two strings', () => {
    const r = new DPStepRecorder()
    recordLCS({ rowString: 'ABC', colString: 'AC' }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const last = steps.at(-1)!
    expect(last.table[3][2]).toBe(2) // Subsequence is "AC", length 2.
  })

  it('Edit Distance calculates correct minimum operations', () => {
    const r = new DPStepRecorder()
    recordEditDistance({ rowString: 'HORSE', colString: 'ROS' }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const last = steps.at(-1)!
    expect(last.table[5][3]).toBe(3) // Min operations to convert HORSE to ROS is 3
  })

  it('Coin Change calculates minimum coins needed', () => {
    const r = new DPStepRecorder()
    recordCoinChange({ rowString: '1,2,5', colString: '11' }, r)
    const steps = r.getSteps()
    expect(steps.length).toBeGreaterThan(0)
    const last = steps.at(-1)!
    expect(last.table[3][11]).toBe(3) // 5 + 5 + 1 = 3 coins
  })
})
