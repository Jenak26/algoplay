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
}

interface DebuggerActions {
  loadSteps:    (steps: readonly DebugSnapshot[]) => void
  play:         () => void
  pause:        () => void
  stepForward:  () => void
  stepBackward: () => void
  seekTo:       (stepIndex: number) => void
  reset:        () => void
}

const INITIAL_STATE: DebuggerState = {
  steps:         [],
  currentStep:   0,
  totalSteps:    0,
  isPlaying:     false,
  playbackSpeed: 60,
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
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps - 1) set({ currentStep: currentStep + 1 })
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
  reset: () => set({ ...INITIAL_STATE }),
}))

export const useDebuggerStore: DebuggerStoreType = Object.assign(_store, {
  getInitialState: () => ({ ...INITIAL_STATE }),
})
