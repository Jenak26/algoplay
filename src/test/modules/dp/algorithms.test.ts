// src/test/modules/dp/algorithms.test.ts
import { describe, it, expect } from 'vitest'
import { DPStepRecorder } from '@/engine/DPStepRecorder'
import { recordKnapsack } from '@/modules/dp/algorithms/knapsack'
import { recordLCS } from '@/modules/dp/algorithms/lcs'

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
})
