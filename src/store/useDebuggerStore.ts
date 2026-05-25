// src/store/useDebuggerStore.ts
import { create } from 'zustand'
import type { UseBoundStore, StoreApi } from 'zustand'
import type { DebugSnapshot } from '@/types/DebugSnapshot'

interface DebuggerState {
  steps:         readonly DebugSnapshot[]
  currentStep:   number
  totalSteps:    number
  isPlaying:     boolean
  playbackSpeed: number
  breakpoints:   Record<number, boolean>
}

interface DebuggerActions {
  loadSteps:    (steps: readonly DebugSnapshot[]) => void
  play:         () => void
  pause:        () => void
  stepForward:  () => void
  stepBackward: () => void
  seekTo:       (stepIndex: number) => void
  reset:        () => void
  toggleBreakpoint: (line: number) => void
  clearBreakpoints: () => void
}

const INITIAL_STATE: DebuggerState = {
  steps:         [],
  currentStep:   0,
  totalSteps:    0,
  isPlaying:     false,
  playbackSpeed: 60,
  breakpoints:   {},
}

type DebuggerStoreType = UseBoundStore<StoreApi<DebuggerState & DebuggerActions>> & {
  getInitialState: () => DebuggerState
}

const _store = create<DebuggerState & DebuggerActions>()((set, get) => ({
  ...INITIAL_STATE,
  loadSteps: (steps) =>
    set({ steps, totalSteps: steps.length, currentStep: 0, isPlaying: false }),
  play:  () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stepForward: () => {
    const { currentStep, totalSteps, breakpoints, steps } = get()
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1
      const nextLine = steps[nextStep]?.codeLine
      if (nextLine !== undefined && breakpoints[nextLine] && get().isPlaying) {
        set({ isPlaying: false, currentStep: nextStep })
      } else {
        set({ currentStep: nextStep })
      }
    }
  },
  stepBackward: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },
  seekTo: (stepIndex) => {
    const { totalSteps } = get()
    const clamped = Math.max(0, Math.min(stepIndex, totalSteps - 1))
    set({ currentStep: clamped })
  },
  toggleBreakpoint: (line) => {
    const bps = { ...get().breakpoints }
    bps[line] = !bps[line]
    set({ breakpoints: bps })
  },
  clearBreakpoints: () => set({ breakpoints: {} }),
  reset: () => set({ ...INITIAL_STATE }),
}))

export const useDebuggerStore: DebuggerStoreType = Object.assign(_store, {
  getInitialState: () => ({ ...INITIAL_STATE }),
})

