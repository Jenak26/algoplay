// src/test/engine/StepRecorder.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { StepRecorder } from '@/engine/StepRecorder'

describe('StepRecorder', () => {
  let recorder: StepRecorder

  beforeEach(() => {
    recorder = new StepRecorder()
  })

  it('starts with zero steps', () => {
    expect(recorder.getSteps()).toHaveLength(0)
  })

  it('captures a snapshot and returns it', () => {
    recorder.capture({
      array:       [3, 1, 2],
      highlights:  new Map([[0, 'comparing'], [1, 'comparing']]),
      pointers:    { i: 0, j: 1 },
      codeLine:    2,
      description: 'Comparing index 0 and 1',
    })
    const steps = recorder.getSteps()
    expect(steps).toHaveLength(1)
    expect(steps[0].array).toEqual([3, 1, 2])
    expect(steps[0].opCount.comparisons).toBe(0)
  })

  it('tracks comparison count across captures', () => {
    recorder.comparison()
    recorder.comparison()
    recorder.capture({
      array: [1], highlights: new Map(), pointers: {}, codeLine: 0, description: '',
    })
    expect(recorder.getSteps()[0].opCount.comparisons).toBe(2)
  })

  it('tracks swap count across captures', () => {
    recorder.swap()
    recorder.capture({
      array: [1], highlights: new Map(), pointers: {}, codeLine: 0, description: '',
    })
    expect(recorder.getSteps()[0].opCount.swaps).toBe(1)
  })

  it('resets all state on reset()', () => {
    recorder.comparison()
    recorder.swap()
    recorder.capture({
      array: [1], highlights: new Map(), pointers: {}, codeLine: 0, description: '',
    })
    recorder.reset()
    expect(recorder.getSteps()).toHaveLength(0)
  })

  it('getSteps() returns a frozen readonly reference', () => {
    recorder.capture({
      array: [1], highlights: new Map(), pointers: {}, codeLine: 0, description: '',
    })
    const steps = recorder.getSteps()
    expect(() => {
      // @ts-expect-error — intentionally testing immutability at runtime
      ;(steps as unknown[]).push({})
    }).toThrow()
  })
})
