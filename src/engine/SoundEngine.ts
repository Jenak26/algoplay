// src/engine/SoundEngine.ts

export class SoundEngine {
  private ctx: AudioContext | null = null

  init(): void {
    if (!this.ctx) {
      const w = window as Window & { webkitAudioContext?: typeof AudioContext }
      const Ctor = window.AudioContext || w.webkitAudioContext
      if (!Ctor) return
      this.ctx = new Ctor()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
  }

  playNote(value: number): void {
    if (!this.ctx) return
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 200 + value * 6
    gain.gain.value = 0.04
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.08)
  }

  destroy(): void {
    void this.ctx?.close()
    this.ctx = null
  }
}

export const soundEngine = new SoundEngine()
