// src/test/engine/URLStateEncoder.test.ts
import { describe, it, expect } from 'vitest'
import { URLStateEncoder } from '@/engine/URLStateEncoder'
import type { URLState } from '@/types/URLState'

describe('URLStateEncoder', () => {
  const state: URLState = {
    v:      1,
    module: 'sorting',
    algo:   'bubble',
    array:  [5, 3, 1, 4, 2],
    speed:  75,
    lang:   'javascript',
  }

  it('encode() returns a non-empty string', () => {
    expect(URLStateEncoder.encode(state).length).toBeGreaterThan(0)
  })

  it('decode(encode(state)) round-trips losslessly', () => {
    const encoded = URLStateEncoder.encode(state)
    const decoded = URLStateEncoder.decode(encoded)
    expect(decoded).toEqual(state)
  })

  it('decode() returns null for garbage input', () => {
    expect(URLStateEncoder.decode('not-valid-base64!!!!')).toBeNull()
  })

  it('decode() returns null for wrong schema version', () => {
    const badState = { v: 99, module: 'sorting' }
    const encoded = URLStateEncoder.encode(badState as unknown as URLState)
    expect(URLStateEncoder.decode(encoded)).toBeNull()
  })

  it('compressed output is shorter than raw JSON for large payloads', () => {
    // LZString compresses repeated patterns well — a large array is a realistic use case
    const largeState: URLState = {
      v:      1,
      module: 'sorting',
      algo:   'merge',
      array:  Array.from({ length: 100 }, (_, i) => (i * 7 + 3) % 100 + 1),
      speed:  50,
      lang:   'pseudocode',
    }
    const raw = JSON.stringify(largeState)
    const compressed = URLStateEncoder.encode(largeState)
    expect(compressed.length).toBeLessThan(raw.length)
  })

  it('encodeGrid / decodeGrid round-trips a Uint8Array', () => {
    const cells = new Uint8Array([0, 0, 1, 0, 2, 0, 0, 1, 3, 0])
    const encoded = URLStateEncoder.encodeGrid(cells)
    const decoded = URLStateEncoder.decodeGrid(encoded, cells.length)
    expect(Array.from(decoded)).toEqual(Array.from(cells))
  })
})
