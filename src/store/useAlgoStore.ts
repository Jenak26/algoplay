// src/store/useAlgoStore.ts
import { create } from 'zustand'
import type { UseBoundStore, StoreApi } from 'zustand'

type ArrayPattern = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique'

interface AlgoState {
  activeModuleId: string
  activeAlgoId:   string
  array:          number[]
  arrayPattern:   ArrayPattern
  arraySize:      number
  speed:          number
  isRunning:      boolean
}

interface AlgoActions {
  setActiveModule:  (id: string) => void
  setActiveAlgo:    (id: string) => void
  setArray:         (arr: number[]) => void
  setArrayPattern:  (p: ArrayPattern) => void
  setArraySize:     (n: number) => void
  setSpeed:         (n: number) => void
  setIsRunning:     (v: boolean) => void
  generateArray:    () => void
}

const INITIAL_STATE: AlgoState = {
  activeModuleId: 'sorting',
  activeAlgoId:   'bubble',
  array:          [],
  arrayPattern:   'random',
  arraySize:      50,
  speed:          75,
  isRunning:      false,
}

function makeArray(size: number, pattern: ArrayPattern): number[] {
  const arr = Array.from({ length: size }, (_, i) =>
    pattern === 'reversed'      ? size - i :
    pattern === 'nearly-sorted' ? i + (Math.random() < 0.1 ? Math.floor(Math.random() * 10) - 5 : 0) :
    pattern === 'few-unique'    ? Math.floor(Math.random() * 5) + 1 :
    Math.floor(Math.random() * 95) + 5
  )
  return arr.map(v => Math.max(1, Math.min(100, v)))
}

type AlgoStoreType = UseBoundStore<StoreApi<AlgoState & AlgoActions>> & {
  getInitialState: () => AlgoState
}

const _store = create<AlgoState & AlgoActions>()((set, get) => ({
  ...INITIAL_STATE,
  setActiveModule: (id) => set({ activeModuleId: id }),
  setActiveAlgo:   (id) => set({ activeAlgoId: id }),
  setArray:        (arr) => set({ array: arr }),
  setArrayPattern: (p) => set({ arrayPattern: p }),
  setArraySize:    (n) => set({ arraySize: n }),
  setSpeed:        (n) => set({ speed: n }),
  setIsRunning:    (v) => set({ isRunning: v }),
  generateArray: () => {
    const { arraySize, arrayPattern } = get()
    set({ array: makeArray(arraySize, arrayPattern) })
  },
}))

export const useAlgoStore: AlgoStoreType = Object.assign(_store, {
  getInitialState: () => ({ ...INITIAL_STATE }),
})
