// src/store/useSettingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CodeLanguage = 'pseudocode' | 'python' | 'javascript'
type Theme = 'dark' | 'light'

interface SettingsState {
  theme:               Theme
  soundEnabled:        boolean
  codeLanguage:        CodeLanguage
  showComplexityChart: boolean
  showCodeView:        boolean
}

interface SettingsActions {
  toggleTheme:      () => void
  toggleSound:      () => void
  setCodeLanguage:  (lang: CodeLanguage) => void
  toggleComplexity: () => void
  toggleCodeView:   () => void
}

const INITIAL_STATE: SettingsState = {
  theme:               'dark',
  soundEnabled:        false,
  codeLanguage:        'pseudocode',
  showComplexityChart: true,
  showCodeView:        true,
}

const _store = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      toggleTheme:      () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      toggleSound:      () => set({ soundEnabled: !get().soundEnabled }),
      setCodeLanguage:  (lang) => set({ codeLanguage: lang }),
      toggleComplexity: () => set({ showComplexityChart: !get().showComplexityChart }),
      toggleCodeView:   () => set({ showCodeView: !get().showCodeView }),
    }),
    { name: 'deterministic-debugger-settings' }
  )
)

export const useSettingsStore = Object.assign(_store, {
  getInitialState: () => ({ ...INITIAL_STATE }),
})
