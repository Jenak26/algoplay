// src/hooks/useURLState.ts
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { URLStateEncoder } from '@/engine/URLStateEncoder'
import type { URLState } from '@/types/URLState'

export function useURLState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const read = useCallback((): URLState | null => {
    const param = searchParams.get('s')
    if (!param) return null
    return URLStateEncoder.decode(param)
  }, [searchParams])

  const write = useCallback((state: URLState): void => {
    const encoded = URLStateEncoder.encode(state)
    setSearchParams({ s: encoded }, { replace: true })
  }, [setSearchParams])

  const clear = useCallback((): void => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const copyToClipboard = useCallback(async (state: URLState): Promise<void> => {
    const encoded = URLStateEncoder.encode(state)
    const url = new URL(window.location.href)
    url.searchParams.set('s', encoded)
    await navigator.clipboard.writeText(url.toString())
  }, [])

  return { read, write, clear, copyToClipboard }
}
