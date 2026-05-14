// src/engine/URLStateEncoder.ts
import { isURLState } from '@/types/URLState'
import type { URLState } from '@/types/URLState'

/**
 * Maps full URLState keys to single-character short keys for compact encoding.
 * This reduces the serialised size below raw JSON.stringify output.
 */
const KEY_MAP: Record<string, string> = {
  v:      'v',
  module: 'm',
  algo:   'a',
  array:  'r',
  speed:  's',
  lang:   'l',
  grid:   'g',
  gridW:  'w',
  gridH:  'h',
  start:  't',
  end:    'e',
}

const REV_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k]),
)

/** Keys whose values are number arrays */
const ARRAY_KEYS = new Set(['array', 'start', 'end'])

/** Keys whose values are numbers */
const NUMBER_KEYS = new Set(['v', 'speed', 'gridW', 'gridH'])

/** Valid characters in an encoded URL state param */
const VALID_PARAM = /^[A-Za-z0-9~=_.,-]+$/

export class URLStateEncoder {
  /**
   * Encode a URLState to a compact, URL-safe string.
   *
   * Format: `key=value` pairs joined by `~`, where:
   *  - keys are shortened via KEY_MAP
   *  - array values are joined by `_`
   *
   * This always produces shorter output than JSON.stringify for the
   * expected URLState shape.
   */
  static encode(state: URLState): string {
    const parts: string[] = []
    for (const [k, v] of Object.entries(state)) {
      if (v === undefined) continue
      const sk = KEY_MAP[k] ?? k
      if (Array.isArray(v)) {
        parts.push(`${sk}=${(v as number[]).join('_')}`)
      } else {
        parts.push(`${sk}=${v}`)
      }
    }
    return parts.join('~')
  }

  /**
   * Decode a compact URL param back to a URLState.
   * Returns null if the param is invalid or fails the isURLState guard.
   */
  static decode(param: string): URLState | null {
    try {
      if (!param || !VALID_PARAM.test(param)) return null

      const state: Record<string, unknown> = {}

      for (const part of param.split('~')) {
        const idx = part.indexOf('=')
        if (idx < 1) return null
        const sk  = part.slice(0, idx)
        const val = part.slice(idx + 1)
        const k   = REV_MAP[sk] ?? sk

        if (NUMBER_KEYS.has(k)) {
          state[k] = Number(val)
        } else if (ARRAY_KEYS.has(k)) {
          state[k] = val.split('_').map(Number)
        } else {
          state[k] = val
        }
      }

      return isURLState(state) ? state : null
    } catch {
      return null
    }
  }

  /**
   * Run-length encode a Uint8Array to a compact string.
   * Format: "value:count,value:count,..."
   */
  static encodeGrid(cells: Uint8Array): string {
    if (cells.length === 0) return ''
    const runs: string[] = []
    let current = cells[0]
    let count   = 1

    for (let i = 1; i < cells.length; i++) {
      if (cells[i] === current) {
        count++
      } else {
        runs.push(`${current}:${count}`)
        current = cells[i]
        count   = 1
      }
    }
    runs.push(`${current}:${count}`)
    return runs.join(',')
  }

  static decodeGrid(encoded: string, expectedLength: number): Uint8Array {
    const cells = new Uint8Array(expectedLength)
    if (!encoded) return cells

    let idx = 0
    for (const run of encoded.split(',')) {
      const [val, cnt] = run.split(':').map(Number)
      for (let i = 0; i < cnt && idx < expectedLength; i++) {
        cells[idx++] = val
      }
    }
    return cells
  }
}
