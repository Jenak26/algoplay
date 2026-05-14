// src/engine/URLStateEncoder.ts
import LZString from 'lz-string'
import { isURLState } from '@/types/URLState'
import type { URLState } from '@/types/URLState'

export class URLStateEncoder {
  static encode(state: URLState): string {
    return LZString.compressToEncodedURIComponent(JSON.stringify(state))
  }

  static decode(param: string): URLState | null {
    try {
      const json = LZString.decompressFromEncodedURIComponent(param)
      if (!json) return null
      const parsed: unknown = JSON.parse(json)
      return isURLState(parsed) ? parsed : null
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
