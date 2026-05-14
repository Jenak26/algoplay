// src/test/store/stores.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useAlgoStore }     from '@/store/useAlgoStore'
import { useDebuggerStore } from '@/store/useDebuggerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import type { StepSnapshot } from '@/types/StepSnapshot'

describe('useAlgoStore', () => {
  beforeEach(() => useAlgoStore.setState(useAlgoStore.getInitialState()))

  it('has default activeModuleId of "sorting"', () => {
    expect(useAlgoStore.getState().activeModuleId).toBe('sorting')
  })

  it('setSpeed updates speed', () => {
    act(() => useAlgoStore.getState().setSpeed(42))
    expect(useAlgoStore.getState().speed).toBe(42)
  })

  it('setArray updates array', () => {
    act(() => useAlgoStore.getState().setArray([3, 1, 2]))
    expect(useAlgoStore.getState().array).toEqual([3, 1, 2])
  })
})

describe('useDebuggerStore', () => {
  const makeSnap = (n: number): StepSnapshot => ({
    array:       [n],
    highlights:  new Map(),
    pointers:    {},
    opCount:     { comparisons: 0, swaps: 0 },
    codeLine:    0,
    description: '',
  })

  beforeEach(() => useDebuggerStore.setState(useDebuggerStore.getInitialState()))

  it('loadSteps sets totalSteps and resets currentStep to 0', () => {
    act(() => useDebuggerStore.getState().loadSteps([makeSnap(1), makeSnap(2), makeSnap(3)]))
    const s = useDebuggerStore.getState()
    expect(s.totalSteps).toBe(3)
    expect(s.currentStep).toBe(0)
  })

  it('stepForward increments currentStep', () => {
    act(() => useDebuggerStore.getState().loadSteps([makeSnap(1), makeSnap(2)]))
    act(() => useDebuggerStore.getState().stepForward())
    expect(useDebuggerStore.getState().currentStep).toBe(1)
  })

  it('stepForward does not exceed totalSteps - 1', () => {
    act(() => useDebuggerStore.getState().loadSteps([makeSnap(1)]))
    act(() => useDebuggerStore.getState().stepForward())
    expect(useDebuggerStore.getState().currentStep).toBe(0)
  })

  it('stepBackward decrements currentStep', () => {
    act(() => useDebuggerStore.getState().loadSteps([makeSnap(1), makeSnap(2)]))
    act(() => useDebuggerStore.getState().seekTo(1))
    act(() => useDebuggerStore.getState().stepBackward())
    expect(useDebuggerStore.getState().currentStep).toBe(0)
  })

  it('stepBackward does not go below 0', () => {
    act(() => useDebuggerStore.getState().loadSteps([makeSnap(1)]))
    act(() => useDebuggerStore.getState().stepBackward())
    expect(useDebuggerStore.getState().currentStep).toBe(0)
  })

  it('reset sets currentStep to 0 and clears steps', () => {
    act(() => useDebuggerStore.getState().loadSteps([makeSnap(1), makeSnap(2)]))
    act(() => useDebuggerStore.getState().reset())
    const s = useDebuggerStore.getState()
    expect(s.currentStep).toBe(0)
    expect(s.totalSteps).toBe(0)
  })
})

describe('useSettingsStore', () => {
  beforeEach(() => useSettingsStore.setState(useSettingsStore.getInitialState()))

  it('defaults to dark theme', () => {
    expect(useSettingsStore.getState().theme).toBe('dark')
  })

  it('toggleTheme switches between dark and light', () => {
    act(() => useSettingsStore.getState().toggleTheme())
    expect(useSettingsStore.getState().theme).toBe('light')
    act(() => useSettingsStore.getState().toggleTheme())
    expect(useSettingsStore.getState().theme).toBe('dark')
  })

  it('setCodeLanguage updates language', () => {
    act(() => useSettingsStore.getState().setCodeLanguage('python'))
    expect(useSettingsStore.getState().codeLanguage).toBe('python')
  })
})
